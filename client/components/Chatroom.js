import React from 'react'
import {connect} from 'react-redux'
import NewMessage from './NewMessage'
import {fetchMessages} from '../store/messagesReducer'
import MessageList from './MessageList'
import NameEntry from './NameEntry'

class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.scroll = React.createRef()
  }
  componentDidUpdate() {
    this.scroll.current.scrollTop = this.scroll.current.scrollHeight
  }
  render() {
    return (
      <React.Fragment>
        <NameEntry />

        <MessageList />
        <NewMessage />
      </React.Fragment>
    )
  }
}

export default Chatroom
