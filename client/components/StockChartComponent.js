import React from 'react'
import {connect} from 'react-redux'
import SearchBar from './SearchBar'
import ChartComponent from './ChartComponent'
import StockNewsOnChart from './StockNewsOnChart'

const StockChartComponent = (props) => {
  const {stock} = props
  return (
    <React.Fragment>
      <h1>Welcome to my AWP/Stackathon Project - Stock Searcher</h1>
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
      {stock.company && <StockNewsOnChart stock={stock} />}
    </React.Fragment>
  )
}

const mapState = (state) => {
  return {
    stock: state.singleStock,
  }
}

export default connect(mapState, null)(StockChartComponent)
