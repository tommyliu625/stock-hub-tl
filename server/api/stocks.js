const router = require('express').Router()
const stocks = require('../stockList')

// api/stocks
router.get('/', (req, res, next) => {
  try {
    const data = stocks
    const newData = data.map((info) => {
      return {
        ticker: info.Symbol,
        name: info.Name,
        country: info.Country,
        sector: info.Sector,
        industry: info.Industry,
      }
    })
    res.send(newData)
  } catch (err) {
    next(err)
  }
})

module.exports = router
