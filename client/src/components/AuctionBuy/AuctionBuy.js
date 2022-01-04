import React, { Component } from 'react'
import NavBar from '../NavBar/NavBar'
import CarListing from '../CarListing/CarListing'
import SearchBar from '../SearchBar/SearchBar'
import SignInPopUp from "../SignIn/SignIn";

export default class AuctionBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen : false,
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

    render() {
        const {isOpen} = this.state;
        return (
            <div>
                {isOpen && <SignInPopUp togglePopup={() => this.togglePopup()}/>}
                <NavBar togglePopup={() => this.togglePopup()}/>
                <SearchBar/>
                <CarListing carList={ this.props.carList } mode={ 'auction' }/>
            </div>
        )
    }
}
