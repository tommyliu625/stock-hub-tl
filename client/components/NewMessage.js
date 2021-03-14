import React from 'react'
import {connect} from 'react-redux'
import {sendMessage} from '../store/messagesReducer'

class NewMessage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.sendMessage({
      content: e.target.content.value,
      name: this.props.messages.user,
    })
  }
  render() {
    return (
      <form id="new-message-form" onSubmit={this.handleSubmit}>
        <input
          className="form-control"
          type="text"
          name="content"
          placeholder="Say something nice..."
        />
        <span className="input-group-btn">
          <button className="btn btn-default" type="submit">
            Chat!
          </button>
        </span>
      </form>
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
    sendMessage: (message) => dispatch(sendMessage(message)),
  }
}

export default connect(mapState, mapDispatch)(NewMessage)
