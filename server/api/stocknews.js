/* eslint-disable complexity */
/* eslint-disable max-statements */
const router = require('express').Router()
const axios = require('axios')
const cheerio = require('cheerio')
// const puppeteer = require('puppeteer')
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const allStocks = require('../StockListWithExchanges/tickerWithExchanges')

// add recaptcha plugin and provide it your 2captcha token (= their apiKey)
// 2captcha is the builtin solution provider but others would work as well.
// Please note: You need to add funds to your 2captcha account for this to work

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

const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: captchaAPI, // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    },
    visualFeedback: false, // colorize reCAPTCHAs (violet = detected, green = solved)
  })
)

const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' '
  let isFinished = false
  let isDataSent = false
  // Only extend the timeout for API requests
  if (process.env.NODE_ENV !== 'production') {
    next()
    return
  } else if (
    !req.url.includes('/bloomberg') &&
    !req.url.includes('/tradingview') &&
    !req.url.includes('/motleyfool')
  ) {
    console.log('req.url', req.url)
    next()
    return
  }
  console.log('Trying to extend', req.url)
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
        console.log('inside wait and send')
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

const TradingViewHeroku = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

const TradingViewOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  // slowMo: 1,
  defaultViewport: null,
}

// eslint-disable-next-line max-statements
// eslint-disable-next-line complexity
router.get('/tradingview/:ticker', async (req, res, next) => {
  let browser
  if (process.env.NODE_ENV === 'production') {
    browser = await puppeteer.launch(TradingViewHeroku)
  } else {
    browser = await puppeteer.launch(TradingViewOptions)
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
    await page.waitForTimeout(1000)
    await page.goto(
      `https://www.tradingview.com/symbols/${exchange}-${ticker}/`
    )
    let tradingViewInfo = []
    await page.waitForSelector('.news-item--card-14OMzC2A')
    const articles = await page.$$('.js-news-widget-content > *')
    console.log(articles.length)
    for (let i = 2; i < articles.length; i++) {
      await page.click(`.js-news-widget-content :nth-child(${i + 1})`)
      // console.log(i)
      // await page.waitForSelector('.dialog-3Q8J4Pu0')
      let timeDate = await page.$('.container-WM_9Aksw')
      let title = await page.$('.title-2-Un7Upl')
      let body = await page.$('.body-2-Un7Upl')
      if (timeDate && title && body) {
        await page.waitForTimeout(25)
        let articleInfo = {}
        timeDate = await page.$$eval('.container-WM_9Aksw span', (els) =>
          els.map((el) => el.textContent)
        )
        articleInfo.timeDate = timeDate.join(' ')
        articleInfo.title = await page.$eval(
          '.title-2-Un7Upl',
          (el) => el.innerHTML
        )
        body = await page.$$eval('.body-2-Un7Upl span p', (paragraphs) =>
          paragraphs.map((paragraph) => paragraph.textContent)
        )
        articleInfo.body = body.join(' ')

        tradingViewInfo.push(articleInfo)
        // console.log(articleInfo)
        await page.waitForTimeout(25)
        await page.keyboard.press('Escape')
        // console.log(articleInfo.timeDate)
        // console.log(articleInfo.title)
      }
      // await page.screenshot({path: 'example.png'})
      // await browser.close()
    }
    if (tradingViewInfo.length === 0) {
      console.log('Unable to retrieve TradingView data')
      res.status(404).send('Error grabbing data')
    } else if (process.env.NODE_ENV === 'production') {
      console.log('Successfully retrieved TradingView data')
      res.write(JSON.stringify(tradingViewInfo))
      res.end()
    } else {
      console.log('Successfully retrieved TradingView data')
      res.send(tradingViewInfo)
    }
  } catch (err) {
    next(err)
  } finally {
    console.log('Inside tradingview finally, before browser close()')
    await browser.close()
  }
})

const BloombergHeroku = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  slowMo: 10,
}

const BloombergOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  slowMo: 10,
  defaultViewport: null,
  args: [
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
  ],
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
      page.setDefaultTimeout(30000)
    } else {
      page.setDefaultTimeout(10000)
    }
    await page.goto(`https://www.bloomberg.com/quote/${req.params.ticker}:US`)
    let currentUrl = page.url()
    // await page.waitForTimeout(200000)
    console.log('currentUrl b4 captchaSolver', currentUrl)
    console.log('page.url', page.url())
    if (page.url().includes('tosv2')) {
      await page.waitForSelector('#px-captcha > div > div > div > iframe')
      const iframeHandle = await page.$(
        '#px-captcha > div > div > div > iframe'
      )
      const frame = await iframeHandle.contentFrame()
      await frame.click('#recaptcha-anchor')
      await page.waitForTimeout(1000)
      await page.solveRecaptchas()
      await page.waitForTimeout(1000)
      // const iframeHandle2 = await page.$(
      //   '#px-captcha > div > div > div > iframe'
      // )
      // const frame2 = await iframeHandle2.contentFrame()
      // await frame2.click('#recaptcha-verify-button')
    }
    await page.goto(`https://www.bloomberg.com/quote/${req.params.ticker}:US`)
    let newUrl = page.url()
    let bloombergInfo = []
    console.log('newUrl', newUrl)
    if (
      newUrl ===
      `https://www.bloomberg.com/quote/${req.params.ticker.toUpperCase()}:US`
    ) {
      // await page.waitForTimeout(200000)
      const articles = await page.$$('.pressReleaseItem__da8ddb6337')
      console.log(articles)
      console.log(articles.length)
      for (let i = 0; i < articles.length; i++) {
        let obj = {}
        let link = await articles[i].$eval('a', (a) => a.getAttribute('href'))
        let headline = await articles[i].$eval(
          '.headline__3e5c217c11',
          (el) => el.innerHTML
        )
        let date = await articles[i].$eval(
          '.updatedAt__560a44b6d7',
          (el) => el.innerHTML
        )
        obj.headline = headline
        obj.link = link
        obj.date = date
        console.log(obj)
        bloombergInfo.push(obj)
      }
    }
    // await page.screenshot({path: 'example.png'})
    // await browser.close()
    // console.log('bloomberg info', bloombergInfo)
    if (bloombergInfo.length === 0) {
      console.log('Unable to retrieve bloomberg data')
      res.status(404).send('Error grabbing data')
    } else if (process.env.NODE_ENV === 'production') {
      console.log('Successfully retrieved bloomberg data')
      res.write(JSON.stringify(bloombergInfo))
      res.end()
    } else {
      console.log('Successfully retrieved bloomberg data')
      res.send(bloombergInfo)
    }
  } catch (err) {
    next(err)
  } finally {
    console.log('Inside Bloomberg finally')
    await browser.close()
  }
})

const MotleyHeroku = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

const MotleyOptions = {
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  // slowMo: 10,
  defaultViewport: {width: 1700, height: 768},
}

router.get('/motleyfool/:ticker', async (req, res, next) => {
  let browser
  if (process.env.NODE_ENV === 'production') {
    browser = await puppeteer.launch(MotleyHeroku)
  } else {
    browser = await puppeteer.launch(MotleyOptions)
  }
  try {
    // const exchange = allStocks.find((stock) => {
    //   return stock.Symbol === req.params.ticker.toUpperCase()
    // }).exchange
    let ticker = req.params.ticker.toUpperCase()

    const page = await browser.newPage()
    await page.goto('https://www.fool.com/')
    if (process.env.NODE_ENV !== 'production') {
      page.setDefaultTimeout(10000)
    }
    await page.waitForTimeout(500)
    await page.type('#fool-search', ticker, {delay: 1})
    await page.waitForTimeout(1500)
    await page.keyboard.press('Enter')
    let motleyInfo = []
    await page.waitForSelector('#page-1')
    const articleOne = await page.$$('#page-1 > article')
    console.log(articleOne.length)
    for (let i = 0; i < articleOne.length; i++) {
      let obj = {}
      let link = await articleOne[i].$eval('a', (a) => a.getAttribute('href'))
      obj.link = `https://www.fool.com${link}`
      let author = await articleOne[i].$eval(
        '.story-date-author',
        (el) => el.innerHTML
      )
      console.log(i, author)
      obj.author = author
      motleyInfo.push(obj)
    }
    // await page.click('#load-more')
    // await page.waitForSelector('#page-2 > article')
    // const articleTwo = await page.$$('#page-2 > article')
    // for (let i = 0; i < articleTwo.length; i++) {
    //   let obj = {}
    //   let link = await articleTwo[i].$eval('a', (a) => a.getAttribute('href'))
    //   obj.link = `https://www.fool.com${link}`
    //   let author = await articleTwo[i].$eval(
    //     '.story-date-author',
    //     (el) => el.innerHTML
    //   )
    //   obj.author = author
    // motleyInfo.push(obj)
    // }
    if (!motleyInfo.length) {
      console.log('Unable to retrieve MotleyFool data')
      res.status(404).send('Unable to fetch data')
    } else if (process.env.NODE_ENV === 'production') {
      console.log('Successfully retrieved Motleyfool data')
      res.write(JSON.stringify(motleyInfo))
      res.end()
    } else {
      console.log('Successfully retrieved Motleyfool data')
      res.send(motleyInfo)
    }
  } catch (err) {
    next(err)
  } finally {
    console.log('Inside tradingview finally, before browser close()')
    await browser.close()
  }
})

module.exports = router
