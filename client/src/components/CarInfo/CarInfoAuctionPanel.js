import React, { Component } from 'react'
import { placeBid } from '../../actions/auction';
import './CarInfoAuctionPanel.css'

export default class CarInfoAuctionPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bid: 0,
            message: {
                type: '',
                body: ''
            },
            countDownDisplay: '',
            interval: null,
            bidStatus: 'ongoing'
        }
    }

    componentDidMount() {
        const end = new Date(this.props.currentCar.endDate)

        let diff = end - new Date()
        let ended = false
        if (diff <= 0) {
            this.setState({ canBid: 'finished', countDownDisplay: '0d 0h 0m 0s' })
        }
        else {
            const interval = setInterval(() => {
                const days = Math.floor(diff / 86400000)
                const hours = Math.floor((diff % 86400000) / 3600000)
                const minutes = Math.floor((diff % 3600000) / 60000)
                const seconds = Math.floor((diff % 60000) / 1000)
                if (diff <= 0) {
                    ended = true
                    this.setState({ bidStatus: 'finished'})
                    clearInterval(interval)
                }
                else {
                    diff -= 1000
                }

                if (!ended) {
                    this.setState({ countDownDisplay: `${days}d ${hours}h ${minutes}m ${seconds}s`})
                }
                else {
                    this.setState({ countDownDisplay: '0d 0h 0m 0s' })
                }
            }, 1000)
            this.setState({ interval: interval })
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval)
    }

    render() {
        return (
            <div id='panel'>
                <h1 id='countDown'>{ this.state.countDownDisplay }</h1>
                <label>Bid</label>
                <input type="number" placeholder='Enter your bid.' onChange={ (e) => this.setState({ bid: e.target.value }) } />
                <p className={ `message-${this.state.message.type}` }>{ `${this.state.message.body}` }</p>
                <button className={ `panelBtn ${this.state.bidStatus}` } onClick={ () => {
                    if (this.props.currentCar.creator === localStorage.userID) {
                        this.setState({ message: {
                            type: 'bad',
                            body: 'Cannot place bid on your own auction.'
                        } })
                    }
                    else if (localStorage.userType === 'admin') {
                        this.setState({ message: {
                            type: 'bad',
                            body: 'Cannot place bid as admin.'
                        } })
                    }
                    else if (this.state.bidStatus === 'ongoing') {
                        placeBid(localStorage.userID, this.state.bid, this.props.currentCar._id, this.props.infoPage, this, this.props.app);
                    }
                    else {
                        this.setState({ message: {
                            type: 'bad',
                            body: 'Bidding for this car is closed.'
                        } })
                    }  
                } }>Submit Bid</button>
            </div>
        )
    }
}
