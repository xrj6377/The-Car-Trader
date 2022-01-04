import React, { Component } from 'react'
// import Button from '@restart/ui/esm/Button';
import { Link } from 'react-router-dom';
import { approvePost, declinePost } from '../../actions/admin';
import { getCarListing } from '../../actions/listing';
import { getAuctionListing } from '../../actions/auction';
import { contactSeller } from '../../actions/listing';

import './CarInfoAdminPanel.css'

export class CarInfoAdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    render() {
        const { currentCar, mode, app } = this.props
        
        return (
            <div id='panel'>
                <Link to={{ pathname: '/adminHome' }}>
                    <button className='panelBtn approve' onClick={ () => {
                        contactSeller(currentCar.creator, localStorage.userID, `Your post of your ${currentCar.year} ${currentCar.make} ${currentCar.model} has been approved!`, null)
                        approvePost(currentCar._id, mode)
                        if (mode === 'adminListing') {
                            getCarListing(app)
                        }
                        else {
                            getAuctionListing(app)
                        }
                    } }>Approve</button>
                </Link>
                <label>Reason</label>
                <input type="text" placeholder='Enter reason for decline.' onChange={ (e) => this.setState({ message: e.target.value }) } />
                <Link to={{ pathname: '/adminHome' }}>
                    <button className='panelBtn decline' onClick={ () => {
                        contactSeller(currentCar.creator, localStorage.userID, `Your post of your ${currentCar.year} ${currentCar.make} ${currentCar.model} has been declined!\nReason: ` + this.state.message, null)
                        declinePost(currentCar._id, mode)
                        if (mode === 'adminListing') {
                            getCarListing(app)
                        }
                        else {
                            getAuctionListing(app)
                        }
                    } }>Decline</button>
                </Link>
            </div>
        )
    }
}

export default CarInfoAdminPanel
