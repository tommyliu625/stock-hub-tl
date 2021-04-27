/* eslint-disable camelcase */
const router = require('express').Router()
let alphaKey =
  process.env.NODE_ENV === 'production'
    ? // ? JSON.parse(process.env.alphaKey)
      process.env.alphaKey
    : require('../../secrets').alphaKey.key
const alpha = require('alphavantage')({key: alphaKey})

// api/daily-price/:ticker
router.post('/:ticker', async (req, res, next) => {
  try {
    let {timePeriodSelection, interval, ticker} = req.body
    const data = await alpha.data.daily(req.params.ticker, 'full', 'json')
    const timeSeries = data['Time Series (Daily)']
    const timeSeriesArr = Object.keys(timeSeries).map((info) => {
      let objInfo = {
        date: info,
        open: timeSeries[info]['1. open'],
        high: timeSeries[info]['2. high'],
        low: timeSeries[info]['3. low'],
        close: timeSeries[info]['4. close'],
        volume: timeSeries[info]['5. volume'],
      }
      return objInfo
    })
    let dataPointNum
    if (timePeriodSelection === '1month') dataPointNum = 30
    else if (timePeriodSelection === '3month') dataPointNum = 90
    else if (timePeriodSelection === '6month') dataPointNum = 180
    else if (timePeriodSelection === '1year') dataPointNum = 365
    else if (timePeriodSelection === '2year') dataPointNum = 730
    let timeSeriesData = dataPointNum
      ? timeSeriesArr.filter((info, i) => {
          return i <= dataPointNum
        })
      : timeSeriesArr
    data['Meta Data']['4. Interval'] = 'daily'
    const stockInfo = {
      info: data['Meta Data'],
      stockPrices: timeSeriesData,
    }
    res.send(stockInfo)
  } catch (err) {
    next(err)
  }
})

module.exports = router
