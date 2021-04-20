/* eslint-disable react/jsx-key */
import React from 'react'
import {connect} from 'react-redux'
import {resetTV, resetBloomberg, getAllNews} from '../store/stocknewsReducer'
import {fetchStocks} from '../store/stockListReducer'
import FinvizComponent from './FinvizComponent'
import WSJComponent from './WSJComponent'
import TradingViewComponent from './TradingViewComponent'
import BloombergComponent from './BloombergComponent'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      selectedCategory: 'finviz',
      searchBarFilter: [],
      hasSubmitted: false,
    }
  }
  componentDidMount() {
    this.props.fetchStocks()
  }
  handleSubmit = async (e) => {
    e.preventDefault()
    if (!this.state.hasSubmitted) {
      this.setState({...this.state, hasSubmitted: true})
    } else {
      this.props.resetTV()
      this.props.resetBloomberg()
    }
    const errorCatch = await this.props.getAllNews(e.target.ticker.value)
    console.log('errorCatch', errorCatch)
  }
  changeCategory = (e) => {
    e.preventDefault()
    this.setState({...this.state, selectedCategory: e.target.value})
  }
  handleInputChange = async (e) => {
    await this.setState({
      ...this.state,
      input: e.target.value,
    })
    this.filterSearch()
  }
  filterSearch = () => {
    const filterData = this.props.stockList.filter((info) => {
      let input = this.state.input.toUpperCase()
      return info.ticker.includes(input)
    })

    const first25Data = filterData.filter((info, i) => {
      return i < 25
    })
    this.setState({
      ...this.state,
      searchBarFilter: first25Data,
    })
  }
  // eslint-disable-next-line complexity
  render() {
    const {stocknews} = this.props
    let stocksites = Object.keys(this.props.stocknews)
    let selectedNewsJSX
    let {selectedCategory, hasSubmitted} = this.state
    if (selectedCategory === 'finviz' && stocknews.finviz.length) {
      selectedNewsJSX = stocknews[selectedCategory].map((links, i) => {
        return <FinvizComponent links={links} />
      })
    } else if (selectedCategory === 'WSJ') {
      selectedNewsJSX = stocknews[selectedCategory].map((links, i) => {
        return <WSJComponent links={links} />
      })
    } else if (selectedCategory === 'TradingView') {
      if (!stocknews.TradingView.length && this.state.hasSubmitted) {
        selectedNewsJSX = (
          <div className="tradingview-detail-div">
            <div>
              Grabbing TradingView data. This may take up to 10 seconds...{' '}
              <img src="loading-spinner.gif" width="50px" height="50px" />
            </div>
          </div>
        )
      } else {
        selectedNewsJSX = stocknews[selectedCategory].map((info) => {
          return (
            <TradingViewComponent
              info={info}
              hasSubmitted={this.state.hasSubmitted}
            />
          )
        })
      }
    } else if (selectedCategory === 'Bloomberg') {
      if (!stocknews.Bloomberg.length && this.state.hasSubmitted) {
        selectedNewsJSX = (
          <div className="bloomberg-detail-div">
            <div>
              Grabbing Bloomberg data. This may take up to 60 seconds...{' '}
              <img src="loading-spinner.gif" width="50px" height="50px" />
            </div>
          </div>
        )
      } else {
        selectedNewsJSX = stocknews[selectedCategory].map((info) => {
          return <BloombergComponent info={info} />
        })
      }
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="select ticker"
            name="ticker"
            list="tickers"
            value={this.state.input}
            onChange={this.handleInputChange}
          ></input>
          <datalist
            value={this.state.input}
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
          <button type="submit">Submit</button>
          <div>
            {stocksites &&
              stocksites.map((value) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <React.Fragment>
                    <button
                      type="button"
                      value={value}
                      onClick={this.changeCategory}
                    >
                      {value}
                    </button>
                  </React.Fragment>
                )
              })}
          </div>
        </form>
        {selectedNewsJSX}
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    stocknews: state.stocknews,
    stock: state.singleStock,
    stockList: state.stockList,
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchStocks: () => dispatch(fetchStocks()),
    resetTV: () => dispatch(resetTV()),
    resetBloomberg: () => dispatch(resetBloomberg()),
    getAllNews: (ticker) => dispatch(getAllNews(ticker)),
  }
}

export default connect(mapState, mapDispatch)(StockNews)
