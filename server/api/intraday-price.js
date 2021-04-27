/* eslint-disable camelcase */
const router = require('express').Router()
let alphaKey =
  process.env.NODE_ENV === 'production'
    ? // ? JSON.parse(process.env.alphaKey)
      process.env.alphaKey
    : require('../../secrets').alphaKey
const alpha = require('alphavantage')(alphaKey)

// api/historical-chart/1min/:ticker
router.post('/:ticker', async (req, res, next) => {
  try {
    let {timePeriodSelection, interval, ticker} = req.body
    const data = await alpha.data.intraday(
      req.params.ticker,
      'full',
      'json',
      interval
    )
    const timeSeries = data[`Time Series (${interval})`]
    const timeSeriesArr = Object.keys(timeSeries).map((time) => {
      let objInfo = {
        dateTime: time,
        open: timeSeries[time]['1. open'],
        high: timeSeries[time]['2. high'],
        low: timeSeries[time]['3. low'],
        close: timeSeries[time]['4. close'],
        volume: timeSeries[time]['5. volume'],
      }
      return objInfo
    })
    // account for timePeriodSelection = intraday
    let dataPointNum
    if (timePeriodSelection === 'intraday') {
      let oneDay = 480
      let intervalNum = Number(interval.split('min')[0])
      dataPointNum = oneDay / intervalNum

      // account for timePeriodSelection = 5day
    } else if (timePeriodSelection === '5day') {
      let fiveDays = 2400
      let intervalNum = Number(interval.split('min')[0])
      dataPointNum = fiveDays / intervalNum

      // account for timePeriodSelection = 1month
    } else if (timePeriodSelection === '1month') {
      let oneMonth = 13440 // minutes
      let intervalNum = Number(interval.split('min')[0])
      dataPointNum = oneMonth / intervalNum
    }
    let timeSeriesData = dataPointNum
      ? timeSeriesArr.filter((info, i) => {
          return i <= dataPointNum
        })
      : timeSeriesArr
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
