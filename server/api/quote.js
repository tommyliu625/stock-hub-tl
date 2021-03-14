const router = require('express').Router()
// const iex = require('iexcloud_api_wrapper')

router.get('/:ticker', async (req, res, next) => {
  try {
    const data = await iex.quote(req.params.ticker)
    res.send(data)
  } catch (err) {
    next(err)
  }
})

module.exports = router
