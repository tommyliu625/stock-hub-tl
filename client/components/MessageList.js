import React from 'react'
import Message from './Message'
import {connect} from 'react-redux'
import {fetchMessages} from '../store/messagesReducer'

// import {withRouter} from 'react-router-dom'

class MessagesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.scroll = React.createRef()
  }
  async componentDidMount() {
    await this.props.fetchMessages()
  }
  componentDidUpdate() {
    this.scroll.current.scrollTop = this.scroll.current.scrollHeight
  }
  render() {
    const {messages} = this.props
    return (
      <div className="message-box" ref={this.scroll}>
        <ul className="media-list">
          {messages.messages.length &&
            messages.messages.map((message) => <Message message={message} />)}
        </ul>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    messages: state.messages,
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchMessages: () => dispatch(fetchMessages()),
  }
}
export default connect(mapState, mapDispatch)(MessagesList)
