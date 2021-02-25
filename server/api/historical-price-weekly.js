/* eslint-disable camelcase */
const router = require('express').Router()
const alpha = require('alphavantage')({key: 'SMZ4S084COH57OMS'})

// api/historical-price-weekly/1min/:ticker
router.get('/:ticker', async (req, res, next) => {
  try {
    const data = await alpha.data.weekly(req.params.ticker, 'full', 'json')
    const companyData = await alpha.fundamental.company_overview(
      req.params.ticker
    )
    const timeSeries = data['Weekly Time Series']
    const timeSeriesArr = Object.keys(timeSeries).map((time) => {
      let objInfo = {
        week: time,
        open: timeSeries[time]['1. open'],
        high: timeSeries[time]['2. high'],
        low: timeSeries[time]['3. low'],
        close: timeSeries[time]['4. close'],
        volume: timeSeries[time]['5. volume'],
      }
      return objInfo
    })
    const stockInfo = {
      info: companyData,
      stockPrices: timeSeriesArr,
    }
    res.send(stockInfo)
  } catch (err) {
    next(err)
  }
})

module.exports = router
