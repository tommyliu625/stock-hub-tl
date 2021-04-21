import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import singleStock, {getStock, getCompany} from './singleStockReducer'
import stockList from './stockListReducer'
import stocknews from './stocknewsReducer'
import {dummyAAPL1YearDaily, dummyAMZN5yearWeekly} from '../dummyData'

const rootReducer = combineReducers({
  singleStock,
  stockList,
  stocknews,
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(rootReducer, middleware)

const AAPLdata = {
  ticker: 'AAPL',
  name: 'Apple Inc. Common Stock',
  country: 'United States',
  sector: 'Technology',
  industry: 'Computer Manufacturing',
}

// store.dispatch(getStock(dummyAAPL1YearDaily))
// store.dispatch(getCompany(AAPLdata))

export default store
