/* eslint-disable react/jsx-key */
import React from 'react'
import alphavantage from 'alphavantage'
import {connect} from 'react-redux'
import {dummyInfo, dummyPrices} from '../dummyData'
import {getStock} from '../store/reducer'

const alpha = alphavantage({key: 'SMZ4S084COH57OMS'})

class SearchBar extends React.Component {
  constructor() {
    super()
    this.state = {
      keyword: '',
      searchBarFilter: [],
    }
  }
  componentDidMount() {
    this.props.getStock(dummyPrices.stockPrices)
  }
  handleChange = async (e) => {
    console.log(e.target.value)
    await this.setState({
      ...this.state,
      keyword: e.target.value,
    })
    // this.filterSearch()
  }
  // filterSearch = async () => {
  //   const data = await alpha.data.search(this.state.keyword)
  //   const filterData = data.bestMatches.map((info) => {
  //     return {ticker: info['1. symbol'], name: info['2. name']}
  //   })
  //   await this.setState({
  //     ...this.state,
  //     searchBarFilter: filterData,
  //   })
  // }
  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <label>Choose a stock ticker</label>
          <input
            value={this.state.keyword}
            onChange={this.handleChange}
            list="tickers"
          ></input>
          <datalist
            value={this.keyword}
            onChange={this.handleChange}
            id="tickers"
          >
            <option value="" disabled hidden />
            {this.state.searchBarFilter.length &&
              this.state.searchBarFilter.map((searches) => {
                return (
                  <option value={searches.ticker}>
                    {`${searches.ticker} - ${searches.name}`}
                  </option>
                )
              })}
          </datalist>
          <button type="submit">Submit ticker</button>
        </form>
      </React.Fragment>
    )
  }
}

const mapState = (state) => {
  return {
    stock: state.stock,
  }
}

const mapDispatch = (dispatch) => {
  return {
    getStock: (stock) => dispatch(getStock(stock)),
  }
}

export default connect(mapState, mapDispatch)(SearchBar)
