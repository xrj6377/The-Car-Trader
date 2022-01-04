import React, { Component } from 'react'
import Listing from './Listing'
import './CarListing.css'

export class CarListing extends Component {
    Title(props) {
        if (props.mode === 'adminListing') {
            return <h3 className='listingTitle'>Listing(s) Pending Approval</h3>
        }
        else if (props.mode === 'adminAuction') {
            return <h3 className='listingTitle'>Auction(s) Pending Approval</h3>
        }
        else if (props.mode === 'listing') {
            return <h3 className='listingTitle'>Featured Listings</h3>
        }
        else if (props.mode === 'listing_view') {
            return <h3 className='listingTitle'>My Approved Listings</h3>
        }
        else if (props.mode === 'auction_view') {
            return <h3 className='listingTitle'>My Approved Auctions</h3>
        }
        else if (props.mode === 'TBAlisting_view') {
            return <h3 className='listingTitle'>My TBA Listings</h3>
        }
        else if (props.mode === 'TBAauction_view') {
            return <h3 className='listingTitle'>My TBA Auctions</h3>
        }
        else {
            return <h3 className='listingTitle'>Featured Auctions</h3>
        }
    }

    render() {
        return (
            <div className='featureListingContainer'>
                { this.props.carList.length === 0 ? (
                    <h3 className='listingTitle'>There are currently no listing.</h3>
                ) : (
                    <div className='featureListing'>
                        <this.Title mode={ this.props.mode }/>
                        { this.props.carList.map((car) => <Listing key={ car._id } carInfo={ car } mode={ this.props.mode } myPostingPage={ this.props.myPostingPage }/>) }
                    </div>
                ) }
            </div>
        )
    }
}

export default CarListing

CarListing.defaultProps = {
    mode: 'user'
}