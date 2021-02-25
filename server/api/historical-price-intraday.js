/* eslint-disable camelcase */
const router = require('express').Router()
const alpha = require('alphavantage')({key: 'SMZ4S084COH57OMS'})

// api/historical-chart/1min/:ticker
router.get('/1min/:ticker', async (req, res, next) => {
  try {
    const data = await alpha.data.intraday(
      req.params.ticker,
      'full',
      'json',
      '1min'
    )
    const timeSeries = data['Time Series (1min)']
    const timeSeriesArr = Object.keys(timeSeries).map((time) => {
      let objInfo = {
        time,
        open: timeSeries[time]['1. open'],
        high: timeSeries[time]['2. high'],
        low: timeSeries[time]['3. low'],
        close: timeSeries[time]['4. close'],
        volume: timeSeries[time]['5. volume'],
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

router.get('/5min/:ticker', async (req, res, next) => {
  try {
    const data = await alpha.data.intraday(
      req.params.ticker,
      'full',
      'json',
      '5min'
    )
    const timeSeries = data['Time Series (5min)']
    const timeSeriesArr = Object.keys(timeSeries).map((time) => {
      let objInfo = {
        time,
        open: timeSeries[time]['1. open'],
        high: timeSeries[time]['2. high'],
        low: timeSeries[time]['3. low'],
        close: timeSeries[time]['4. close'],
        volume: timeSeries[time]['5. volume'],
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

router.get('/15min/:ticker', async (req, res, next) => {
  try {
    const data = await alpha.data.intraday(
      req.params.ticker,
      'full',
      'json',
      '15min'
    )
    const timeSeries = data['Time Series (15min)']
    const timeSeriesArr = Object.keys(timeSeries).map((time) => {
      let objInfo = {
        time,
        open: timeSeries[time]['1. open'],
        high: timeSeries[time]['2. high'],
        low: timeSeries[time]['3. low'],
        close: timeSeries[time]['4. close'],
        volume: timeSeries[time]['5. volume'],
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

router.get('/30min/:ticker', async (req, res, next) => {
  try {
    const data = await alpha.data.intraday(
      req.params.ticker,
      'full',
      'json',
      '30min'
    )
    const timeSeries = data['Time Series (30min)']
    const timeSeriesArr = Object.keys(timeSeries).map((info) => {
      let [date, time] = info.split(' ')
      let objInfo = {
        date,
        time,
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

router.get('/60min/:ticker', async (req, res, next) => {
  try {
    const data = await alpha.data.intraday(
      req.params.ticker,
      'full',
      'json',
      '60min'
    )
    const timeSeries = data['Time Series (60min)']
    const timeSeriesArr = Object.keys(timeSeries).map((time) => {
      let objInfo = {
        time,
        open: timeSeries[time]['1. open'],
        high: timeSeries[time]['2. high'],
        low: timeSeries[time]['3. low'],
        close: timeSeries[time]['4. close'],
        volume: timeSeries[time]['5. volume'],
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
