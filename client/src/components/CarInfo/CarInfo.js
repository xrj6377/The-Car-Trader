import React, { Component } from 'react'
import { getAuctionById, getTBAauctionById } from '../../actions/auction'
import { getListingById, getTBAlistingById } from '../../actions/listing'
import SignInPopUp from '../SignIn/SignIn'
import NavBar from '../NavBar/NavBar'
import CarInfoHeader from './CarInfoHeader'
import { Carousel } from 'react-carousel-minimal'
import CarInfoAuctionPanel from './CarInfoAuctionPanel'
import CarInfoContact from './CarInfoContact'
import './CarInfo.css'
import CarInfoAdminPanel from './CarInfoAdminPanel'

export default class CarInfo extends Component {
    componentDidMount() {
        const mode = this.props.match.params.mode
        this.setState({ mode: mode })
        const carId = this.props.match.params.id
        if (mode === 'auction' || mode === 'auction_view') {
            getAuctionById(carId, this);
        }
        else if (mode === 'listing' || mode === 'listing_view') {
            getListingById(carId, this);
        }
        else if (mode === 'adminListing' || mode === 'TBAlisting_view') {
            getTBAlistingById(carId, this);
        }
        else if (mode === 'adminAuction' || mode === 'TBAauction_view') {
            getTBAauctionById(carId, this);
        }
        else {
            console.log("MODE IS MIS-TYPED");
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isOpen : false,
            mode: null,
            car: null,
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


    ChoosePanel (props) {
        if (props.mode === 'auction') {
            return (
                <div id='auctionPanel'>
                    <CarInfoAuctionPanel currentCar={ props.car } infoPage={ props.infoPage } app={ props.app }/>
                </div>
            )
        }
        else if (props.mode === 'listing') {
            return (
                <div id='contact'>
                    <CarInfoContact currentCar={ props.car }/>
                </div>
            )
        }
        else if (props.mode === 'adminAuction' || props.mode === 'adminListing') {
            return (
                <div id='adminPanel'>
                    <CarInfoAdminPanel currentCar={ props.car } mode={ props.mode } app={ props.app }/>
                </div>
            )
        }
        else {
            return (
                <div>
                </div>
            )
        }
    }

    render() {
        if (this.state.car === null) {
            return (
                <div>
                    Loading......
                </div>
            )
        }
        else {
            console.log(this.state.car)
            const data = []

            for (let i = 0; i < this.state.car.pictures.length; i++) {
                data.push({
                    image: this.state.car.pictures[i].image_url
                })
            }

            let price;
            if (this.state.mode === 'auction' || this.state.mode === 'auction_view') {
                price = this.state.car.highestBid;
            }
            else if (this.state.mode === 'adminAuction' || this.state.mode === 'TBAauction_view') {
                price = this.state.car.bidStartPrice;
            }
            else if (this.state.mode === 'listing' || this.state.mode === 'adminListing' || this.state.mode === 'TBAlisting_view' || this.state.mode === 'listing_view') {
                price = this.state.car.listingPrice;
            }

            return (
                <div>
                    {this.state.isOpen && <SignInPopUp togglePopup={() => this.togglePopup()}/>}
                    <NavBar togglePopup={() => this.togglePopup()}/>
                    <div id='mainColumn'>
                        <div id='content-contact-wrapper'>
                            <div id='content'>
                                <CarInfoHeader info={ this.state.car } price={ price }/>
                                <Carousel height='400px' width='600px' radius='10px' data={ data }/>
                            </div>
                            <this.ChoosePanel mode={ this.state.mode } car={ this.state.car } infoPage={ this } app={ this.props.app }/>
                        </div>
                        <div id='description-div'>
                            <h2>Description</h2>
                            <p id='description'>{ this.state.car.description }</p>
                        </div>
                    </div> 
                </div>
            )
        }
    }
}
