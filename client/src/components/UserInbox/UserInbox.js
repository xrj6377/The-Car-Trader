import React, { Component } from 'react'
import { getMessages } from '../../actions/user';
import { Message } from '../Message/Message'
import NavBar from '../NavBar/NavBar'
import './UserInbox.css'

export class UserInbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            messages: [],
            displayOption: 'all'
        }
        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup = () => {
        if (!this.state.isOpen)
            this.setState({
                isOpen: true,
            })
        else {
            this.setState({
                isOpen: false,
            })
        }
    }

    componentDidMount() {
        getMessages(localStorage.userID, this, this.state.displayOption)
    }

    render() {
        return (
            <div>
                <NavBar togglePopup={() => this.togglePopup()}/>
                <div id='mainColumn'>
                    Display Options: 
                    <select name="displaySelect" id="displaySelect" onChange={ (e) => {
                        this.setState({ displayOption: e.target.value })
                        getMessages(localStorage.userID, this, e.target.value)
                    } }>
                        <option value="all">All</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                    { this.state.messages.map((msg) => <Message key={ msg.messages._id } message={ msg.messages } userInbox={ this }/>) }
                </div>
            </div>
        )
    }
}

export default UserInbox