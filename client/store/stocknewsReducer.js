import axios from 'axios'

const GET_FINVIZ = 'GET_FINVIZ'
const GET_WSJ = 'GET_WSJ'
const GET_TRADINGVIEW = 'GET_TRADINGVIEW'
const RESET_TRADINGVIEW = 'RESET_TRADINGVIEW'
const GET_BLOOMBERG = 'GET_BLOOMBERG'
const RESET_BLOOMBERG = 'RESET_BLOOMBERG'

export const setFinviz = (news) => {
  return {
    type: GET_FINVIZ,
    finvizNews: news,
  }
}

export const setWSJ = (news) => {
  return {
    type: GET_WSJ,
    WSJNews: news,
  }
}

export const setTradingView = (news) => {
  return {
    type: GET_TRADINGVIEW,
    tradingViewNews: news,
  }
}

export const setBloomberg = (news) => {
  return {
    type: GET_BLOOMBERG,
    bloombergNews: news,
  }
}

export const resetTV = () => {
  return {
    type: RESET_TRADINGVIEW,
    tradingViewNews: [],
  }
}

export const resetBloomberg = () => {
  return {
    type: RESET_BLOOMBERG,
    bloombergNews: [],
  }
}

export const fetchFinvizNews = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/finviz/${ticker}`)
      dispatch(setFinviz(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export const fetchWSJNews = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/WSJ/${ticker}`)
      dispatch(setWSJ(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export const fetchTradingViewNews = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/tradingview/${ticker}`)
      dispatch(setTradingView(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export const fetchBloomberg = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/bloomberg/${ticker}`)
      dispatch(setBloomberg(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export const getAllNews = (ticker) => {
  return async (dispatch) => {
    try {
      const finvizFunction = async () => {
        const {data} = await axios.get(`/api/stocknews/finviz/${ticker}`)
        dispatch(setFinviz(data))
      }
      const WSJFunction = async () => {
        const {data} = await axios.get(`/api/stocknews/WSJ/${ticker}`)
        dispatch(setWSJ(data))
      }
      const tradingViewFunction = async () => {
        const {data} = await axios.get(`/api/stocknews/tradingview/${ticker}`)
        dispatch(setTradingView(data))
      }
      const bloombergFunction = async () => {
        const {data} = await axios.get(`/api/stocknews/bloomberg/${ticker}`)
        dispatch(setBloomberg(data))
      }
      await Promise.all([
        finvizFunction(),
        WSJFunction(),
        tradingViewFunction(),
        bloombergFunction(),
      ])
    } catch (err) {
      console.log(err)
      return err.response.data
    }
  }
}

const initState = {
  finviz: [],
  WSJ: [],
  TradingView: [],
  Bloomberg: [],
}

export default (state = initState, action) => {
  switch (action.type) {
    case GET_FINVIZ:
      return {...state, finviz: action.finvizNews}
    case GET_WSJ:
      return {...state, WSJ: action.WSJNews}
    case GET_TRADINGVIEW:
      return {...state, TradingView: action.tradingViewNews}
    case RESET_TRADINGVIEW:
      return {...state, TradingView: []}
    case GET_BLOOMBERG:
      return {...state, Bloomberg: action.bloombergNews}
    case RESET_BLOOMBERG:
      return {...state, Bloomberg: []}
    default:
      return state
  }
}
