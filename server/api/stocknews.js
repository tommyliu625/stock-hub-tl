const router = require('express').Router()
const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const poll = require('promise-poller').default
const allStocks = require('../StockListWithExchanges/tickerWithExchanges')
const {captchaAPI} = require('../../secrets')

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

const WSJOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: false,
  slowMo: 10,
  defaultViewport: null,
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

const chromeOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  // slowMo: 1,
  defaultViewport: null,
}

// eslint-disable-next-line max-statements
router.get('/tradingview/:ticker', async (req, res, next) => {
  try {
    const exchange = allStocks.find((stock) => {
      return stock.Symbol === req.params.ticker.toUpperCase()
    }).exchange
    let ticker = req.params.ticker
    const browser = await puppeteer.launch(chromeOptions)
    const page = await browser.newPage()
    await page.goto('https://www.tradingview.com/#signin')
    page.setDefaultNavigationTimeout(10000)
    await page.click('.i-clearfix')
    await page.$eval(
      'input[name=username]',
      (el) => (el.value = 'bemorechillscript@gmail.com')
    )
    await page.$eval('input[name=password]', (el) => (el.value = 'whothem4n'))
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
      await page.waitForTimeout(25)
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
      console.log(articleInfo.timeDate)
      console.log(articleInfo.title)
    }
    await page.screenshot({path: 'example.png'})
    await browser.close()
    res.send(tradingViewInfo)
  } catch (err) {
    next(err)
  }
})

const BloombergOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  slowMo: 10,
  defaultViewport: null,
}

// eslint-disable-next-line max-statements
router.get('/bloomberg/:ticker', async (req, res, next) => {
  try {
    const browser = await puppeteer.launch(BloombergOptions)
    const page = await browser.newPage()
    page.setDefaultTimeout(10000)
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
    currentUrl = page.url()
    let bloombergInfo = []
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
        console.log(obj)
        bloombergInfo.push(obj)
      }
    }
    await page.screenshot({path: 'example.png'})
    await browser.close()
    res.send(bloombergInfo)
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
