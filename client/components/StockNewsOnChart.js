import React from 'react'
import {connect} from 'react-redux'
import {resetTV, resetBloomberg, getAllNews} from '../store/stocknewsReducer'
import FinvizComponent from './FinvizComponent'
import WSJComponent from './WSJComponent'
import TradingViewComponent from './TradingViewComponent'
import BloombergComponent from './BloombergComponent'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {input: '', selectedCategory: 'finviz'}
  }
  // componentDidMount() {
  //   this.props.getFinviz(this.props.stock.company.ticker)
  //   this.props.getWSJ(this.props.stock.company.ticker)
  // }
  changeCategory = (e) => {
    e.preventDefault()
    this.setState({...this.state, selectedCategory: e.target.value})
  }
  // eslint-disable-next-line complexity
  render() {
    const {stocknews} = this.props
    let stocksites = Object.keys(this.props.stocknews)
    let selectedNewsJSX
    let {selectedCategory} = this.state
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
    } else if (selectedCategory === 'TradingView') {
      if (stocknews[selectedCategory].length === 1) {
        selectedNewsJSX = <div>{stocknews[selectedCategory][0]}</div>
      } else if (!stocknews.TradingView.length) {
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
      } else if (!stocknews.Bloomberg.length) {
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
        <div id="stockcharts-news-buttons">
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
        <div id="articles-stockchart">{selectedNewsJSX}</div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    stocknews: state.stocknews,
    // stock: state.singleStock,
  }
}

const mapDispatch = (dispatch) => {
  return {
    resetTV: () => dispatch(resetTV()),
    resetBloomberg: () => dispatch(resetBloomberg()),
    getAllNews: (ticker) => dispatch(getAllNews(ticker)),
  }
}

export default connect(mapState, mapDispatch)(StockNews)
