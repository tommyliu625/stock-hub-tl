import React from 'react'
import {connect} from 'react-redux'
import SearchBar from './SearchBar'
import ChartComponent from './ChartComponent'

const StockChartComponent = (props) => {
  const {stock} = props
  console.log('before render', stock)
  return (
    <React.Fragment>
      <h1>Welcome to my AWP Project - Stock Searcher</h1>
      <SearchBar />
      <div id="title-price-div">
        {stock.company && <span>{stock.company.name}</span>}
        {stock.stockPrices && (
          <span>
            Stock Price: $
            {Number(
              stock.stockPrices[stock.stockPrices.length - 1].open
            ).toFixed(2)}
          </span>
        )}
      </div>
      <ChartComponent />
    </React.Fragment>
  )
}

const mapState = (state) => {
  return {
    stock: state.singleStock,
  }
}

export default connect(mapState, null)(StockChartComponent)
