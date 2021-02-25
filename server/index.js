const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

// middleware
// logging middleware
app.use(morgan('dev'))
// bodyparser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// static middleware
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api', require('./api'))

// error handling middleware
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
}) // Send index.html for any other requests

app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

module.exports = app
