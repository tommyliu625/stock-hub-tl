import axios from 'axios'

const GET_FINVIZ = 'GET_FINVIZ'
const GET_WSJ = 'GET_WSJ'
const GET_MOTLEYFOOL = 'GET_MOTLEYFOOL'
const RESET_MOTLEYFOOL = 'RESET_MOTLEYFOOL'
const GET_SEEKINGALPHA = 'GET_SEEKINGALPHA'
const RESET_SEEKINGALPHA = 'RESET_SEEKINGALPHA'
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

export const setMotleyFool = (news) => {
  return {
    type: GET_MOTLEYFOOL,
    motleyFoolNews: news,
  }
}

export const resetMotleyFool = () => {
  return {
    type: RESET_MOTLEYFOOL,
    motleyFoolNews: [],
  }
}

export const setSeekingAlpha = (news) => {
  return {
    type: GET_SEEKINGALPHA,
    seekingAlphaNews: news,
  }
}

export const resetSeekingAlpha = () => {
  return {
    type: RESET_SEEKINGALPHA,
    seekingAlphaNews: [],
  }
}

export const setTradingView = (news) => {
  return {
    type: GET_TRADINGVIEW,
    tradingViewNews: news,
  }
}

export const resetTV = () => {
  return {
    type: RESET_TRADINGVIEW,
    tradingViewNews: [],
  }
}

export const setBloomberg = (news) => {
  return {
    type: GET_BLOOMBERG,
    bloombergNews: news,
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
      return {Successful: {finviz: 'Successfully received finviz data'}}
    } catch (err) {
      dispatch(setFinviz({error: `Unable to fetch finviz data for ${ticker}.`}))
      return err.response.data
    }
  }
}

export const fetchWSJNews = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/WSJ/${ticker}`)
      dispatch(setWSJ(data))
      return {Successful: {WSJ: 'Successfully received WSJ data'}}
    } catch (err) {
      dispatch(setWSJ({error: `Unable to fetch WSJ data for ${ticker}.`}))
      return err.response.data
    }
  }
}

export const fetchMotleyFoolNews = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/motleyfool/${ticker}`)
      console.log(data)
      if (!Array.isArray(data)) {
        let newData = data.slice(1)
        dispatch(setMotleyFool(JSON.parse(newData)))
      } else {
        dispatch(setMotleyFool(data))
      }
      return {Successful: {MotleyFool: 'Successfully received MotleyFool data'}}
    } catch (err) {
      dispatch(
        setMotleyFool({error: `Unable to fetch MotleyFool data for ${ticker}.`})
      )
      return err.response.data
    }
  }
}

export const fetchSeekingAlphaNews = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/seekingalpha/${ticker}`)
      console.log(data)
      if (!Array.isArray(data)) {
        let newData = data.slice(1)
        dispatch(setSeekingAlpha(JSON.parse(newData)))
      } else {
        dispatch(setSeekingAlpha(data))
      }
      return {
        Successful: {SeekingAlpha: 'Successfully received SeekingAlpha data'},
      }
    } catch (err) {
      dispatch(
        setSeekingAlpha({
          error: `Unable to fetch SeekingAlpha data for ${ticker}.`,
        })
      )
      return err.response.data
    }
  }
}

export const fetchTradingViewNews = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/tradingview/${ticker}`)
      // console.log('tradingview data', data)
      if (!Array.isArray(data)) {
        let newData = data.slice(1)
        dispatch(setTradingView(JSON.parse(newData)))
      } else {
        dispatch(setTradingView(data))
      }
      return {
        Successful: {TradingView: 'Successfully received TradingView data'},
      }
    } catch (err) {
      dispatch(
        setTradingView({
          error: `Unable to fetch TradingView data for ${ticker}.`,
        })
      )
      return err.response.data
    }
  }
}

export const fetchBloomberg = (ticker) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/stocknews/bloomberg/${ticker}`)
      // console.log('bloomberg data', data)
      if (!Array.isArray(data)) {
        let newData = data.slice(1)
        dispatch(setBloomberg(JSON.parse(newData)))
      } else {
        dispatch(setBloomberg(data))
      }
      return {
        Successful: {Bloomberg: 'Successfully received Bloomberg data'},
      }
    } catch (err) {
      console.log(err)
      dispatch(
        setBloomberg({error: `Unable to fetch Bloomberg data for ${ticker}.`})
      )
      return err.response.data
    }
  }
}

export const getAllNews = (ticker) => {
  return async (dispatch) => {
    try {
      const message = await Promise.all([
        dispatch(fetchFinvizNews(ticker)),
        dispatch(fetchWSJNews(ticker)),
        dispatch(fetchMotleyFoolNews(ticker)),
        dispatch(fetchSeekingAlphaNews(ticker)),
        dispatch(fetchTradingViewNews(ticker)),
        dispatch(fetchBloomberg(ticker)),
      ])
      return message
    } catch (err) {
      console.log(err)
      return err
    }
  }
}

const initState = {
  finviz: [],
  WSJ: [],
  MotleyFool: [],
  SeekingAlpha: [],
  TradingView: [],
  Bloomberg: [],
}

// eslint-disable-next-line complexity
export default (state = initState, action) => {
  switch (action.type) {
    case GET_FINVIZ:
      return {...state, finviz: action.finvizNews}
    case GET_WSJ:
      return {...state, WSJ: action.WSJNews}
    case GET_MOTLEYFOOL:
      return {...state, MotleyFool: action.motleyFoolNews}
    case RESET_MOTLEYFOOL:
      return {...state, MotleyFool: []}
    case GET_SEEKINGALPHA:
      return {...state, SeekingAlpha: action.seekingAlphaNews}
    case RESET_SEEKINGALPHA:
      return {...state, SeekingAlpha: []}
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
