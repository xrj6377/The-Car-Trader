import React, { Component } from 'react'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { deleteMyAuction } from './../../actions/auction'
import { deleteMyListing } from './../../actions/listing'

import './Listing.css'

export class Listing extends Component {
    render() {
        let price;
        if (this.props.mode === 'auction' || this.props.mode === 'auction_view') {
            price = this.props.carInfo.highestBid;
        }
        else if (this.props.mode === 'adminAuction' || this.props.mode === 'TBAauction_view') {
            price = this.props.carInfo.bidStartPrice;
        }
        else if (this.props.mode === 'adminListing' || this.props.mode === 'listing' || this.props.mode === 'listing_view' || this.props.mode === 'TBAlisting_view') {
            price = this.props.carInfo.listingPrice;
        }

        const { _id, make, year, model, bodyColor, milage, pictures } = this.props.carInfo || {};

        return (
            <div className='listing'>
                <div className='carPicContainer'>
                    <img src={ pictures[0].image_url } alt={ make } className='carPic' />
                </div>

                <div className='listingContent'>
                    <div className='listingSpan carName'>{ year + ' ' + make + ' ' +  model }</div>
                    <div className='listingSpan'>{ bodyColor }</div>
                    <div className='listingSpan'>
                        <NumberFormat value={ milage } suffix={'km'} thousandSeparator={ true } displayType={'text'}/>
                    </div>
                    <div className='listingSpan'>
                        <NumberFormat value={ price } prefix={'$'} thousandSeparator={ true } displayType={'text'}/>
                    </div>
                    <Link to={{ pathname: `./../carInfo/${this.props.mode}/${_id}` }} underline='none'>
                        <Button sx={{ m:2 }} className="listingBtn" variant="contained">View</Button>
                    </Link>
                    { this.props.mode.endsWith('_view') && <Button sx={{ m:2 }} className="listingBtn" variant="contained" onClick={ () => {
                        // 'listing_view' 'auction_view' 'TBAlisting_view' 'TBAauction_view'
                        if (this.props.mode.endsWith('listing_view')) {
                            deleteMyListing(_id, this.props.carInfo.creator, this.props.mode, this.props.myPostingPage)
                        }
                        else if (this.props.mode.endsWith('auction_view')) {
                            deleteMyAuction(_id, this.props.carInfo.creator, this.props.mode, this.props.myPostingPage)
                        }
                    }}>Delete</Button>}
                </div>
            </div>
        )
    }
}

export default Listing
