import React, { Component } from 'react'
import NavBar from '../NavBar/NavBar';
import SignInPopUp from '../SignIn/SignIn';
import CarListing from '../CarListing/CarListing'
import { getCarListing } from '../../actions/listing';
import { getAuctionListing } from '../../actions/auction';

export class AdminHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
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

    componentDidUpdate() {
        // Getting all car listings, approved and unapproved.
        getCarListing(this.props.app)
        getAuctionListing(this.props.app)
    }

    render() {
        return (
            <div>
                {this.state.isOpen && <SignInPopUp togglePopup={() => this.togglePopup()}/>}
                <NavBar togglePopup={() => this.togglePopup()}/>
                <CarListing carList={ this.props.appState.unapprovedCarList } mode={ 'adminListing' }/>
                <CarListing carList={ this.props.appState.unapprovedAuctionList } mode={ 'adminAuction' }/>
            </div>
        )
    }
}

export default AdminHome
