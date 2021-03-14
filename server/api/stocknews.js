const router = require('express').Router()
const axios = require('axios')
const cheerio = require('cheerio')

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

    res.json(dataArr)
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
    res.json(dataArr)
  } catch (err) {
    next(err)
  }
})

router.get('/tradingview/:ticker', async (req, res, next) => {
  try {
    const {data} = await axios.get(
      `https://www.tradingview.com/symbols/${req.params.ticker}/`
    )
    const dataArr = []
    const $ = cheerio.load(data)

    // $('.tv-widget-news__header span').each((i, el) => {
    // let obj = {}
    // let dateTime = $(el)
    //   .find('.tv-widget-news__header .tv-widget-news__date')
    //   .text()
    // console.log('i', i)
    // dataArr.push(i, el)
    // dataArr.push(dateTime)
    // let element = $(el).find('.tv-widget-news__date').html()
    // dataArr.push(element)

    // console.log(dateTime)
    // dateTime = $(el).find('tv-widget-news__date').text()
    // obj.dateTime = $(el).find('tv-widget-news__date').text()
    // obj.newSource = $(el).find('.tv-widget-news__source').text()
    // obj.description = $(el).find('.tv-widget-news__description-text').text()
    // dataArr.push(obj)
    // })
    res.json(data)
  } catch (err) {
    next(err)
  }
})

module.exports = router
