import React, { Component } from 'react'
import { NavBar } from './../NavBar/NavBar'
import { getMyListings } from './../../actions/listing'
import { getMyAuctions } from './../../actions/auction'
import { CarListing } from './../CarListing/CarListing'

export class MyPostings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            myListing: [],
            myAuction: [],
            myTBAlisting: [],
            myTBAauction: []
        };
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
        getMyListings(localStorage.userID, this)
        getMyAuctions(localStorage.userID, this)
    }

    render() {
        return (
            <div>
                <NavBar togglePopup={() => this.togglePopup()}/>
                <CarListing carList={ this.state.myListing } mode={ 'listing_view' } myPostingPage={ this }/>
                <CarListing carList={ this.state.myAuction } mode={ 'auction_view' } myPostingPage={ this }/>
                <CarListing carList={ this.state.myTBAlisting } mode={ 'TBAlisting_view' } myPostingPage={ this }/>
                <CarListing carList={ this.state.myTBAauction } mode={ 'TBAauction_view' } myPostingPage={ this }/>
            </div>
        )
    }
}

export default MyPostings
