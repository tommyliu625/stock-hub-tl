/* eslint-disable complexity */
/* eslint-disable max-statements */
const router = require('express').Router()
const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const poll = require('promise-poller').default
const allStocks = require('../StockListWithExchanges/tickerWithExchanges')

let captchaAPI =
  process.env.NODE_ENV === 'production'
    ? process.env.captchaAPI
    : require('../../secrets').captchaAPI

let tradingViewUsername =
  process.env.NODE_ENV === 'production'
    ? process.env.tradingViewUsername
    : require('../../secrets').tradingViewUsername

let tradingViewPassword =
  process.env.NODE_ENV === 'production'
    ? process.env.tradingViewPassword
    : require('../../secrets').tradingViewPassword

// let captchaAPI
// let tradingViewUsername
// let tradingViewPassword
// if (process.env.NODE_ENV !== 'production') {
//   let secrets = require('../../secrets')
//   captchaAPI = secrets.captchaAPI
//   tradingViewUsername = secrets.tradingViewUsername
//   tradingViewPassword = secrets.tradingViewPassword
// } else {
//   captchaAPI = process.env.captchaAPI
//   tradingViewUsername = process.env.tradingViewUsername
//   tradingViewPassword = process.env.tradingViewPassword
// }

const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' '
  let isFinished = false
  let isDataSent = false
  // Only extend the timeout for API requests
  console.log('req.url', req.url)
  if (process.env.NODE_ENV !== 'production') {
    next()
    return
  }
  if (!req.url.includes('/bloomberg') && !req.url.includes('/tradingview')) {
    next()
    return
  }
  console.log('after next')
  res.once('finish', () => {
    isFinished = true
  })

  res.once('end', () => {
    isFinished = true
  })

  res.once('close', () => {
    isFinished = true
  })

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true
    }
  })

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          // res.writeHead(202)
          res.writeHead(202, {
            'Content-Type': 'application/json',
          })
        }

        res.write(' ')

        // Wait another 15 seconds
        waitAndSend()
      }
    }, 15000)
  }

  waitAndSend()
  next()
}

router.use(extendTimeoutMiddleware)

router.get('/finviz/:ticker', async (req, res, next) => {
  try {
    const data = await axios.get(
      `https://finviz.com/quote.ashx?t=${req.params.ticker}`
    )
    const dataArr = []
    const $ = cheerio.load(data.data)
    $('#news-table tr').each((i, el) => {
      let obj = {}
      obj.dateTitle = $(el).next().text()
      obj.url = $(el).find('.tab-link-news').attr('href')
      dataArr.push(obj)
    })
    if (dataArr.length) {
      res.send(dataArr)
    } else {
      res.status(404).send({error: {finviz: 'Unable to fetch finviz data'}})
    }
  } catch (err) {
    next(err)
  }
})

const WSJHelper = async (ticker) => {
  const dataArr = []
  const {data} = await axios.request(
    `https://www.wsj.com/market-data/quotes/${ticker}?mod=searchresults_companyquotes`
  )
  const $ = cheerio.load(data)
  $('.WSJTheme--cr_newsSummary--2RNDoLB9  li').each((i, el) => {
    let obj = {}
    const date = $(el).find('.WSJTheme--cr_dateStamp--13KIPpOo ').text()
    obj.date = date
    const urlSpan = $(el).find('.WSJTheme--headline--33gllX4Y ')
    const url = $(urlSpan).find('a').attr('href')
    const details = $(urlSpan).find('a').text()
    obj.url = url
    obj.details = details
    dataArr.push(obj)
  })
  const filterDataArr = dataArr.filter((value) => {
    const {date, url, details} = value
    return date || url || details
  })
  return filterDataArr
}

router.get('/WSJ/:ticker', async (req, res, next) => {
  try {
    let dataArr = []
    let counter = 0
    while (dataArr.length === 0 || counter < 1) {
      dataArr = await WSJHelper(req.params.ticker)
      counter++
    }
    // res.status(404).send('Error grabbing WSJ data')
    res.json(dataArr)
  } catch (err) {
    next(err)
  }
})

const WSJHeroku = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

const WSJOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  // slowMo: 1,
  defaultViewport: null,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

// eslint-disable-next-line max-statements
// eslint-disable-next-line complexity
router.get('/tradingview/:ticker', async (req, res, next) => {
  let browser
  if (process.env.NODE_ENV === 'production') {
    browser = await puppeteer.launch(WSJHeroku)
  } else {
    browser = await puppeteer.launch(WSJOptions)
  }
  try {
    const exchange = allStocks.find((stock) => {
      return stock.Symbol === req.params.ticker.toUpperCase()
    }).exchange
    let ticker = req.params.ticker

    const page = await browser.newPage()
    await page.goto('https://www.tradingview.com/#signin')
    if (process.env.NODE_ENV !== 'production') {
      page.setDefaultNavigationTimeout(10000)
    }
    await page.click('.i-clearfix')
    await page.$eval(
      'input[name=username]',
      (el, tradingViewUsername) => (el.value = tradingViewUsername),
      tradingViewUsername
    )
    await page.$eval(
      'input[name=password]',
      (el, tradingViewPassword) => (el.value = tradingViewPassword),
      tradingViewPassword
    )
    await page.click('.tv-button__loader')
    await page.waitForTimeout(850)
    await page.goto(
      `https://www.tradingview.com/symbols/${exchange}-${ticker}/`
    )
    let tradingViewInfo = []
    await page.waitForSelector('.news-item--card-14OMzC2A')
    const articles = await page.$$('.js-news-widget-content > div')
    console.log(articles.length)
    for (let i = 2; i < articles.length; i++) {
      // await page.waitForSelector(`.js-news-widget-content :nth-child(${i + 1})`)
      await page.click(`.js-news-widget-content div:nth-of-type(${i + 1})`)
      console.log(i)
      // await page.waitForSelector('.dialog-3Q8J4Pu0')
      await page.waitForTimeout(75)
      await page.waitForTimeout()
      const timeDate = await page.$$('.container-WM_9Aksw span')
      const body = await page.$$('.description-1q24HCdy span p')
      const title = await page.$('.title-1q24HCdy')
      let articleInfo = {}
      for (const texts of timeDate) {
        let spanText = await (
          await texts.getProperty('textContent')
        ).jsonValue()
        articleInfo.timeDate = articleInfo.timeDate
          ? articleInfo.timeDate + ' ' + spanText
          : spanText + ' '
      }
      articleInfo.title = await (
        await title.getProperty('textContent')
      ).jsonValue()
      for (const p of body) {
        let bodyText = await (await p.getProperty('textContent')).jsonValue()
        articleInfo.body = articleInfo.body
          ? articleInfo.body + ' \n' + bodyText
          : bodyText
      }
      tradingViewInfo.push(articleInfo)
      await page.waitForTimeout(25)
      await page.keyboard.press('Escape')
      // console.log(articleInfo.timeDate)
      // console.log(articleInfo.title)
    }
    // await page.screenshot({path: 'example.png'})
    await browser.close()
    if (process.env.NODE_ENV === 'production') {
      res.write(JSON.stringify(tradingViewInfo))
      res.end()
    } else {
      res.send(tradingViewInfo)
    }
  } catch (err) {
    next(err)
  } finally {
    await browser.close()
  }
})

const BloombergHeroku = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

const BloombergOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  slowMo: 10,
  defaultViewport: null,
}

// eslint-disable-next-line max-statements
router.get('/bloomberg/:ticker', async (req, res, next) => {
  let browser
  if (process.env.NODE_ENV === 'production') {
    browser = await puppeteer.launch(BloombergHeroku)
  } else {
    browser = await puppeteer.launch(BloombergOptions)
  }
  try {
    const page = await browser.newPage()
    if (process.env.NODE_ENV !== 'production') {
      page.setDefaultTimeout(10000)
    }
    await page.goto(`https://www.bloomberg.com/quote/${req.params.ticker}:US`)
    let currentUrl = page.url()
    if (
      currentUrl !== `https://www.bloomberg.com/quote/${req.params.ticker}:US`
    ) {
      const sitekey = await page.$eval('.g-recaptcha', (element) =>
        element.getAttribute('data-sitekey')
      )
      const requestId = await initiateCaptchaRequest(
        captchaAPI,
        currentUrl,
        sitekey
      )

      let response = await pollForRequestResults(captchaAPI, requestId)

      await page.$eval(
        '#g-recaptcha-response',
        // eslint-disable-next-line no-return-assign
        (el, response) => (el.innerHTML = `${response}`),
        response
      )
      await page.goto(`https://www.bloomberg.com/quote/${req.params.ticker}:US`)
    }
    if (process.env.NODE_ENV === 'production') {
      await page.waitForTimeout(2000)
    }
    currentUrl = page.url()
    let bloombergInfo = []
    console.log('currentUrl', currentUrl)
    if (
      currentUrl ===
      `https://www.bloomberg.com/quote/${req.params.ticker.toUpperCase()}:US`
    ) {
      const articles = await page.$$('#right-rail .pressReleaseItem__e9aac8ef')
      for (let i = 0; i < articles.length; i++) {
        let obj = {}
        let link = await articles[i].$eval('a', (a) => a.getAttribute('href'))
        let headline = await articles[i].$eval(
          '.headline__eb73356e',
          (el) => el.innerHTML
        )
        let date = await articles[i].$eval(
          '.updatedAt__3fe411c9',
          (el) => el.innerHTML
        )
        obj.headline = headline
        obj.link = link
        obj.date = date
        // console.log(obj)
        bloombergInfo.push(obj)
      }
    }
    // await page.screenshot({path: 'example.png'})
    await browser.close()
    console.log('bloomberg info', bloombergInfo)
    if (process.env.NODE_ENV === 'production') {
      res.write(JSON.stringify(bloombergInfo))
      res.end()
    } else {
      res.send(bloombergInfo)
    }
  } catch (err) {
    next(err)
  }
})
async function initiateCaptchaRequest(apiKey, pageurl, sitekey) {
  const formData = {
    method: 'userrecaptcha',
    googlekey: sitekey,
    key: captchaAPI,
    pageurl: pageurl,
    json: 1,
  }
  console.log('Submitting solution request to 2captcha for', pageurl)
  const response = await axios.post('http://2captcha.com/in.php', formData)
  return response.data.request
}

const timeout = (millis) =>
  new Promise((resolve) => setTimeout(resolve, millis))

async function pollForRequestResults(
  key,
  id,
  retries = 45,
  interval = 1000,
  delay = 1000
) {
  console.log(`waiting for ${delay} milliseconds`)
  await timeout(delay)
  return poll({
    taskFn: requestCaptchaResults(key, id),
    interval,
    retries,
  })
}

function requestCaptchaResults(apiKey, requestId) {
  const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`
  return async function () {
    return new Promise(async function (resolve, reject) {
      console.log('Polling for response...')
      const {data} = await axios.get(url)
      console.log(data)
      if (data.status === 0) return reject(data.request)
      resolve(data.request)
    })
  }
}

module.exports = router
