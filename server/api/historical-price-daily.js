/* eslint-disable camelcase */
const router = require('express').Router()
const alpha = require('alphavantage')({key: 'SMZ4S084COH57OMS'})

// api/historical-chart/1min/:ticker
router.get('/:ticker', async (req, res, next) => {
  try {
    const data = await alpha.data.daily(req.params.ticker, 'compact', 'json')
    const timeSeries = data['Time Series (Daily)']
    const timeSeriesArr = Object.keys(timeSeries).map((info) => {
      let objInfo = {
        time: info,
        open: timeSeries[info]['1. open'],
        high: timeSeries[info]['2. high'],
        low: timeSeries[info]['3. low'],
        close: timeSeries[info]['4. close'],
        volume: timeSeries[info]['5. volume'],
      }
      return objInfo
    })
    const stockInfo = {
      info: data['Meta Data'],
      stockPrices: timeSeriesArr,
    }
    res.send(stockInfo)
  } catch (err) {
    next(err)
  }
})

module.exports = router
