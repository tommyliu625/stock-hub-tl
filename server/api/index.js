const router = require('express').Router()
module.exports = router

router.get('/', (req, res, next) => {
  res.send('hello from api route')
})

router.use('/quote', require('./quote'))
router.use('/historical-price-intraday', require('./historical-price-intraday'))
router.use('/historical-price-daily', require('./historical-price-daily'))
router.use('/historical-price-weekly', require('./historical-price-weekly'))
router.use('/historical-price-monthly', require('./historical-price-monthly'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
