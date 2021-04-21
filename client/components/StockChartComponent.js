import React from 'react'
import {connect} from 'react-redux'
import SearchBar from './SearchBar'
import ChartComponent from './ChartComponent'
import StockNewsOnChart from './StockNewsOnChart'

const StockChartComponent = (props) => {
  const {stock} = props
  return (
    <div>
      <div id="stockchart-div">
        <h1>Stock Hub - You're all-in-one hub for stock news and charts</h1>
        <SearchBar />
      </div>
      <div id="title-price-div">
        {stock.company && <span>{stock.company.name}</span>}
        {stock.stockPrices && (
          <span>
            Stock Price: ${Number(stock.stockPrices[0].open).toFixed(2)}
          </span>
        )}
      </div>
      <ChartComponent />
      {stock.company && <StockNewsOnChart stock={stock} />}
    </div>
  )
}

const mapState = (state) => {
  return {
    stock: state.singleStock,
  }
}

export default connect(mapState, null)(StockChartComponent)
