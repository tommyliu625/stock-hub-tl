import React from 'react'
import {connect} from 'react-redux'
import {fetchFinvizNews, fetchWSJNews} from '../store/stocknewsReducer'
import FinvizComponent from './FinvizComponent'
import WSJComponent from './WSJComponent'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {input: '', selectedCategory: 'finviz'}
  }
  componentDidMount() {
    this.props.getFinviz(this.props.stock.company.ticker)
    this.props.getWSJ(this.props.stock.company.ticker)
  }
  changeCategory = (e) => {
    e.preventDefault()
    console.log(e.target.value)
    this.setState({...this.state, selectedCategory: e.target.value})
  }
  render() {
    const {stocknews} = this.props
    let stocksites = Object.keys(this.props.stocknews)
    let {selectedCategory} = this.state
    console.log(stocksites)
    return (
      <div>
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
        {stocknews[selectedCategory].length && selectedCategory === 'finviz'
          ? stocknews[selectedCategory].map((links) => {
              return <FinvizComponent links={links} />
            })
          : selectedCategory === 'WSJ'
          ? stocknews[selectedCategory].map((links) => {
              return <WSJComponent links={links} />
            })
          : null}
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    stocknews: state.stocknews,
    stock: state.singleStock,
  }
}

const mapDispatch = (dispatch) => {
  return {
    getFinviz: (ticker) => dispatch(fetchFinvizNews(ticker)),
    getWSJ: (ticker) => dispatch(fetchWSJNews(ticker)),
  }
}

export default connect(mapState, mapDispatch)(StockNews)
