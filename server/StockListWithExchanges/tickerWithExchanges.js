const AMEXListing = require('./stockListAMEX')
const NASDAQListing = require('./stockListNASDAQ')
const NYSEListing = require('./stockListNYSE')

module.exports = [...AMEXListing, ...NASDAQListing, ...NYSEListing]
