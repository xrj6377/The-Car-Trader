import React from 'react';
import SignInPopUp from "../SignIn/SignIn"

import NavBar from '../NavBar/NavBar';
import CarListing from '../CarListing/CarListing';
import SearchBar from '../SearchBar/SearchBar';
import { Typography } from '@material-ui/core'
import './Home.css'

import { getCarListing } from '../../actions/listing';
import { getAuctionListing } from '../../actions/auction';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isLoggedIn: false,
            loggedIn: false,
            userType: "",
            avatar: "",

            make: "",
            model: "",
            color: "",
            type: "",
        };
        this.togglePopup = this.togglePopup.bind(this);
        if (this.props.location.pathname !== '/') {
            this.props.history.push('/')
        }
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
        // Getting all car listings, approved and unapproved.
        getCarListing(this.props.app)
        getAuctionListing(this.props.app)
    }


    render() {
        const {isOpen} = this.state;
        const loggedIn = localStorage.getItem("userLoggedIn");
        const userType = localStorage.getItem("userType");
        return (
            <div>
                {isOpen && <SignInPopUp togglePopup={() => this.togglePopup()}/>}
                <NavBar togglePopup={() => this.togglePopup()}/>
                <div className="wrapper">
                    <div className = "typing-demo">
                        {loggedIn && <p>{userType.charAt(0).toUpperCase()+userType.slice(1)}, Welcome to Car Trader. </p>}
                        {!loggedIn && <p>Welcome to Car Trader. </p>}
                    </div>
                </div>
                <SearchBar app = {this.props.app} />
                <p>{this.state.loggedIn}</p>
                <CarListing carList={ this.props.carList } mode={ 'listing' }/>
            
            </div>
        )
    }
}


export default Home;