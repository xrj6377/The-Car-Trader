import React, { Component } from 'react'
import { getSenderName, markMessageAsRead, sendMessage, deleteMessage } from '../../actions/user'
import './Message.css'

export class Message extends Component {
    state = {
        body: '',
        senderName: '',
        senderId: '',
        displayReply: false,
        reply: '',
        replyStatus: {
            type: '',
            body: ''
        }
    }

    componentDidMount() {
        this.setState({ senderId: this.props.message.from })
        getSenderName(this.props.message.from, this)
    }

    render() {
        return (
            <div id='message'>
                <div id='messageBody'>
                    <div>
                        From: { this.state.senderName }
                    </div>
                    <div>
                        At: { new Date(this.props.message.date).toString() }
                    </div>
                    <div>
                        Message: { this.props.message.messageBody }
                    </div>
                </div>
                { !this.props.message.read && (<button id='markAsReadBtn' onClick={ () => {
                    markMessageAsRead(localStorage.userID, this.props.message._id, this.props.userInbox)
                } }>Mark As Read</button>) }
                <button id='deleteBtn' onClick={ () => {
                    deleteMessage(localStorage.userID, this.props.message._id, this.props.userInbox)
                } }>Delete Message</button>
                { !this.state.displayReply && <button id='replyBtn' onClick={ () => {
                    this.setState({ displayReply: true })
                } }>Reply</button> }
                <p className={ `replyStatus-${this.state.replyStatus.type}` }>{ this.state.replyStatus.body }</p>
                { this.state.displayReply &&  (<div id='replyBox'>
                                        <input type='text' onChange={ (e) => this.setState({ reply: e.target.value }) }></input>
                                        <button onClick={ () => {
                                            if (this.state.reply !== '') {
                                                sendMessage(localStorage.userID, this.props.message.from, this.state.reply, this)
                                            }
                                            else {
                                                this.setState({ replyStatus: {
                                                    type: 'bad',
                                                    body: "Can't send empty message."
                                                } })
                                            }
                                            this.setState({ displayReply: false, reply: '' })
                                        } }>Submit Reply</button>
                                        <button onClick={ () => {
                                            this.setState({ displayReply: false, reply: '' })
                                        } }>Cancel</button>
                                    </div>)}
            </div>
        )
    }
}


export default Message