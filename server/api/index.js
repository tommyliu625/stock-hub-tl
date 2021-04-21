const router = require('express').Router()
module.exports = router

router.get('/', (req, res, next) => {
  res.send('hello from api route')
})

// route: /api
router.use('/intraday-price', require('./intraday-price'))
router.use('/daily-price', require('./daily-price'))
router.use('/weekly-price', require('./weekly-price'))
router.use('/monthly-price', require('./monthly-price'))
router.use('/stocks', require('./stocks'))
router.use('/stocknews', require('./stocknews'))
router.use('/messages', require('./messages'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
