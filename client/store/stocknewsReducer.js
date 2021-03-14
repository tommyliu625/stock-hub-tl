import axios from 'axios'

const GET_FINVIZ = 'GET_FINVIZ'
const GET_WSJ = 'GET_WSJ'

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

const initState = {
  finviz: [],
  WSJ: [],
}

export default (state = initState, action) => {
  switch (action.type) {
    case GET_FINVIZ:
      return {...state, finviz: action.finvizNews}
    case GET_WSJ:
      return {...state, WSJ: action.WSJNews}
    default:
      return state
  }
}
