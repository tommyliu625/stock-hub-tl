import axios from 'axios'

const NEW_MESSAGE = 'NEW_MESSAGE'
const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER'
const USER_SET = 'USER_SET'

export const userSet = (userName) => ({
  type: USER_SET,
  user: userName,
})

const setNewMessage = (message) => {
  return {
    type: NEW_MESSAGE,
    message,
  }
}

const gotMessagesFromServer = (messages) => ({
  type: GOT_MESSAGES_FROM_SERVER,
  messages,
})

export const fetchMessages = () => async (dispatch) => {
  const {data: messages} = await axios.get('/api/messages')
  dispatch(gotMessagesFromServer(messages))
}

export const sendMessage = (message) => {
  return async (dispatch) => {
    try {
      console.log(message)
      const {data} = await axios.post('/api/messages', message)
      console.log(data)
      dispatch(setNewMessage(data))
    } catch (err) {
      console.log(err)
    }
  }
}

const initState = {
  messages: [],
  user: 'Cody',
}

export default (state = initState, action) => {
  switch (action.type) {
    case GOT_MESSAGES_FROM_SERVER:
      return {...state, messages: action.messages}
    case NEW_MESSAGE:
      return {...state, messages: [...state.messages, action.message]}
    case USER_SET:
      return {...state, user: action.user}
    default:
      return state
  }
}
