/* eslint-disable react/jsx-key */
import React from 'react'
import {connect} from 'react-redux'
import {
  resetTV,
  resetBloomberg,
  resetMotleyFool,
  getAllNews,
} from '../store/stocknewsReducer'
import {fetchStocks} from '../store/stockListReducer'
import FinvizComponent from './FinvizComponent'
import WSJComponent from './WSJComponent'
import TradingViewComponent from './TradingViewComponent'
import BloombergComponent from './BloombergComponent'
import MotleyFoolComponent from './MotleyFoolComponent'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      selectedCategory: 'finviz',
      searchBarFilter: [],
      hasSubmitted: false,
      disable: false,
    }
  }
  componentDidMount() {
    this.props.fetchStocks()
  }
  handleSubmit = async (e) => {
    e.preventDefault()
    console.log('ticker', e.target.ticker.value)
    let ticker = e.target.ticker.value
    await this.setState({...this.state, disable: true})
    if (!this.state.hasSubmitted) {
      await this.setState({...this.state, hasSubmitted: true})
    } else {
      this.props.resetTV()
      this.props.resetBloomberg()
      this.props.resetMotleyFool()
    }
    const response = await this.props.getAllNews(ticker)
    console.log(response)
    await this.setState({...this.state, disable: false})
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
    let {selectedCategory, hasSubmitted, disable} = this.state
    if (selectedCategory === 'finviz') {
      if (stocknews[selectedCategory].length === 1) {
        selectedNewsJSX = <div>{stocknews[selectedCategory][0]}</div>
      } else {
        selectedNewsJSX = stocknews[selectedCategory].map((links, i) => {
          return <FinvizComponent links={links} />
        })
      }
    } else if (selectedCategory === 'WSJ') {
      if (stocknews[selectedCategory].length === 1) {
        selectedNewsJSX = <div>{stocknews[selectedCategory][0]}</div>
      } else {
        selectedNewsJSX = stocknews[selectedCategory].map((links, i) => {
          return <WSJComponent links={links} />
        })
      }
    } else if (selectedCategory === 'MotleyFool') {
      if (stocknews[selectedCategory].length === 1) {
        selectedNewsJSX = <div>{stocknews[selectedCategory][0]}</div>
      } else if (!stocknews.MotleyFool.length && hasSubmitted) {
        selectedNewsJSX = (
          <div className="motleyfool-detail-div">
            <div>
              Grabbing MotleyFool data. This may take up to 10 seconds...{' '}
              <img src="loading-spinner.gif" width="50px" height="50px" />
            </div>
          </div>
        )
      } else {
        selectedNewsJSX = stocknews[selectedCategory].map((links, i) => {
          return <MotleyFoolComponent links={links} />
        })
      }
    } else if (selectedCategory === 'TradingView') {
      if (stocknews[selectedCategory].length === 1) {
        selectedNewsJSX = <div>{stocknews[selectedCategory][0]}</div>
      } else if (!stocknews.TradingView.length && hasSubmitted) {
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
          return <TradingViewComponent info={info} />
        })
      }
    } else if (selectedCategory === 'Bloomberg') {
      if (stocknews.Bloomberg.length === 1) {
        selectedNewsJSX = <div>{stocknews[selectedCategory][0]}</div>
      } else if (!stocknews.Bloomberg.length && hasSubmitted) {
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
      <div id="stocknews-div">
        <h1>Stock News</h1>
        <form
          id="stocknews-form"
          onSubmit={(e) => {
            this.handleSubmit(e)
          }}
        >
          <div id="stocknews-inputButton-div">
            <input
              placeholder="Select ticker..."
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
            <button type="submit" disabled={disable}>
              Submit
            </button>
            {disable && (
              <p style={{color: 'red'}}>
                Button disabled while data is loading
              </p>
            )}
          </div>
          <div id="newsCat-div">
            {stocksites &&
              stocksites.map((value) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <React.Fragment>
                    <button
                      type="button"
                      value={value}
                      style={
                        value === selectedCategory && hasSubmitted
                          ? {'background-color': '#3f51b5', color: 'white'}
                          : null
                      }
                      onClick={this.changeCategory}
                    >
                      {value}
                    </button>
                  </React.Fragment>
                )
              })}
          </div>
        </form>
        <div id="stockarticles-on-stocknews">{selectedNewsJSX}</div>
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
    resetMotleyFool: () => dispatch(resetMotleyFool()),
    getAllNews: (ticker) => dispatch(getAllNews(ticker)),
  }
}

export default connect(mapState, mapDispatch)(StockNews)
