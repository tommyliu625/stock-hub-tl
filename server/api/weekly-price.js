/* eslint-disable camelcase */
const router = require('express').Router()
let alphaKey =
  process.env.NODE_ENV === 'production'
    ? // ? JSON.parse(process.env.alphaKey)
      process.env.alphaKey
    : require('../../secrets').alphaKey
const alpha = require('alphavantage')(alphaKey)

// api/historical-price-weekly/1min/:ticker
router.post('/:ticker', async (req, res, next) => {
  try {
    let {timePeriodSelection, interval, ticker} = req.body
    const data = await alpha.data.weekly(req.params.ticker, 'full', 'json')
    const timeSeries = data['Weekly Time Series']
    const timeSeriesArr = Object.keys(timeSeries).map((time) => {
      let objInfo = {
        date: time,
        open: timeSeries[time]['1. open'],
        high: timeSeries[time]['2. high'],
        low: timeSeries[time]['3. low'],
        close: timeSeries[time]['4. close'],
        volume: timeSeries[time]['5. volume'],
      }
      return objInfo
    })
    let dataPointNum
    if (timePeriodSelection === '1year') dataPointNum = 52
    else if (timePeriodSelection === '2year') dataPointNum = 104
    else if (timePeriodSelection === '5year') dataPointNum = 260
    let timeSeriesData = dataPointNum
      ? timeSeriesArr.filter((info, i) => {
          return i <= dataPointNum
        })
      : timeSeriesArr
    data['Meta Data']['4. Interval'] = 'weekly'
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
