/* eslint-disable complexity */
/* eslint-disable react/jsx-key */
import React from 'react'
import alphavantage from 'alphavantage'
import {connect} from 'react-redux'
import {dummyInfo, dummyPrices} from '../dummyData'
import {fetchStocks} from '../store/stockListReducer'
import {fetchStock, getCompany} from '../store/singleStockReducer'

class SearchBar extends React.Component {
  constructor() {
    super()
    this.state = {
      keyword: '',
      searchBarFilter: [],
      timePeriodSelection: '',
      timeIntervalSelection: '',
    }
  }
  componentDidMount() {
    this.props.fetchStocks()
  }
  handlePeriodChange = (e) => {
    this.setState({
      ...this.state,
      timePeriodSelection: e.target.value,
    })
  }
  handleIntervalChange = (e) => {
    this.setState({
      ...this.state,
      timeIntervalSelection: e.target.value,
    })
  }
  handleSubmit = (e) => {
    // e.preventDefault()
    const {
      keyword,
      timePeriodSelection,
      timeIntervalSelection,
      searchBarFilter,
    } = this.state
    if (!timeIntervalSelection || !keyword || !searchBarFilter) {
      alert('Invalid Input')
    } else {
      this.props.fetchStock({
        keyword: keyword.toUpperCase(),
        timePeriodSelection,
        timeIntervalSelection,
      })
      this.setState({
        ...this.state,
        timeIntervalSelection: '',
        timePeriodSelection: '',
      })
      let selectedTicker = searchBarFilter.find((ticker) => {
        return ticker.ticker === keyword.toUpperCase()
      })
      this.props.getCompany(selectedTicker)
    }
  }
  handleInputChange = async (e) => {
    await this.setState({
      ...this.state,
      keyword: e.target.value,
    })
    this.filterSearch()
  }
  filterSearch = () => {
    const filterData = this.props.stockList.filter((info) => {
      let keyword = this.state.keyword.toUpperCase()
      return info.ticker.includes(keyword)
    })
    const first25Data = filterData.filter((info, i) => {
      return i < 25
    })
    this.setState({
      ...this.state,
      searchBarFilter: first25Data,
    })
  }
  handleIntervalMapping = () => {
    const timePeriod = this.state.timePeriodSelection
    const min1 = <option value="1min">1 Min</option>
    const min5 = <option value="5min">5 Min</option>
    const min15 = <option value="15min">15 Min</option>
    const min30 = <option value="30min">30 Min</option>
    const min60 = <option value="60min">60 Min</option>
    const day = <option value="daily">Day</option>
    const week = <option value="weekly">Week</option>
    const month = <option value="monthly">Month</option>

    return timePeriod === 'intraday'
      ? [min1, min5, min15, min30, min60].map((option) => option)
      : timePeriod === '5day'
      ? [min5, min15, min30, min60].map((option) => option)
      : timePeriod === '1month'
      ? [min60, day].map((option) => option)
      : timePeriod === '3month'
      ? day
      : timePeriod === '6month'
      ? day
      : timePeriod === '1year'
      ? [day, week].map((option) => option)
      : timePeriod === '2year'
      ? [day, week].map((option) => option)
      : timePeriod === '5year'
      ? [week, month].map((option) => option)
      : null
  }
  render() {
    return (
      <React.Fragment>
        <form>
          <label>Choose a stock ticker</label>
          <input
            value={this.state.keyword}
            onChange={this.handleInputChange}
            list="tickers"
          ></input>
          <datalist
            value={this.state.keyword}
            onChange={this.handleInputChange}
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
        </form>
        <div id="time-input-div">
          <div id="time-period-div">
            Time Period
            <select
              id="time-period"
              value={this.state.timePeriodSelection}
              onChange={this.handlePeriodChange}
            >
              <option hidden>Select a time period</option>
              <option value="intraday">Intraday</option>
              <option value="5day">5 Day</option>
              <option value="1month">1 Month</option>
              <option value="3month">3 Months</option>
              <option value="6month">6 Months</option>
              <option value="1year">1 Year</option>
              <option value="2year">2 Year</option>
              <option value="5year">5 Year</option>
            </select>
          </div>
          <div id="time-interval-div">
            Time Interval
            <select
              id="time-interval"
              value={this.state.timeIntervalSelection}
              onChange={this.handleIntervalChange}
            >
              <option hidden>Select a time period first</option>
              {this.state.timePeriodSelection && this.handleIntervalMapping()}
            </select>
          </div>
          <button type="submit" onClick={this.handleSubmit}>
            Submit Info
          </button>
        </div>
      </React.Fragment>
    )
  }
}
// save for letter when we use alphavantage api search

const mapState = (state) => {
  return {
    stockList: state.stockList,
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchStock: (stock) => dispatch(fetchStock(stock)),
    fetchStocks: () => dispatch(fetchStocks()),
    getCompany: (company) => dispatch(getCompany(company)),
  }
}

export default connect(mapState, mapDispatch)(SearchBar)
