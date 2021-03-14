const axios = require('axios')

const GET_STOCK = 'GET_STOCK'
const GET_COMPANY = 'GET_COMPANY'

export const getStock = (stock) => {
  return {
    type: GET_STOCK,
    stock,
  }
}

export const getCompany = (company) => {
  return {
    type: GET_COMPANY,
    company,
  }
}

export const fetchStock = (stock) => {
  return async (dispatch) => {
    try {
      let {keyword, timePeriodSelection, timeIntervalSelection} = stock
      let ticker = keyword
      let interval = timeIntervalSelection
      if (timeIntervalSelection.includes('min'))
        timeIntervalSelection = 'intraday'
      const response = await axios.post(
        `/api/${timeIntervalSelection}-price/${ticker}`,
        {
          ticker,
          timePeriodSelection,
          interval,
        }
      )

      dispatch(getStock(response.data))
    } catch (err) {
      console.log(err)
    }
  }
}

export default (state = {}, action) => {
  switch (action.type) {
    case GET_STOCK:
      return {...state, ...action.stock}
    case GET_COMPANY:
      return {...state, company: action.company}
    default:
      return state
  }
}
