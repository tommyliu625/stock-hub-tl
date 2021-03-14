const axios = require('axios')

const GET_STOCKS = 'GET_STOCKS'

export const getStocks = (stocks) => {
  return {
    type: GET_STOCKS,
    stocks,
  }
}

// thunk to retrieve stocklist
export const fetchStocks = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/stocks')
      dispatch(getStocks(response.data))
    } catch (err) {
      console.log(err)
    }
  }
}

export default (state = [], action) => {
  switch (action.type) {
    case GET_STOCKS:
      return action.stocks
    default:
      return state
  }
}
