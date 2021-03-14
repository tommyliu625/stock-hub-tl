const fs = require('fs')
const parse = require('csv-parse')
const path = require('path')
const results = []

fs.createReadStream(path.join(__dirname, './stockList.csv'))
  .pipe(parse({columns: true}))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // console.log(results)
  })

module.exports = results
