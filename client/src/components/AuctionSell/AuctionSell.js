import React, { Component } from 'react'
import NavBar from '../NavBar/NavBar'
import {TextField } from '@mui/material';
import SignInPopUp from "../SignIn/SignIn";
import SubmitPopUp from '../SubmitPopUp/SubmitPopUp';
import { postNewAuction } from '../../actions/auction';
import './AuctionSell.css';


export default class AuctionSell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            make:'',
            year:'',
            model:'',
            bodyColor:'',
            milage:'',
            bidstartingPrice:'',
            description:'',
            startDate: '',
            endDate: '',
            isOpen: false,
            seen: false,
            empty: true
        }
        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePop = () => {
        for(var key in this.state){
            if(this.state[key] === ''){
                if(key === 'startDate' || key === 'endDate'){
                    continue;
                }else{
                    this.setState({
                        empty: true
                    })
                    break;
                }
            }else{
                this.setState({
                    empty:false
                })
            }
            
        }
        this.setState({
            seen: !this.state.seen
        });
    };

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
        const form_json = this.state;
        const {isOpen} = this.state;
        const userID = localStorage.getItem('userID')
        return (
            <div>
                {isOpen && <SignInPopUp togglePopup={() => this.togglePopup()}/>}
                <NavBar togglePopup={() => this.togglePopup()}/>
                <div className = 'auction_form'>
                    <br/><br/>
                    <h2 id = 'auction_form_header'>Post your car for auction!</h2>
                    <form onSubmit={ (e) => {
                        e.preventDefault();
                        const f = new FormData(e.target)
                        for(const key in form_json){
                            f.append(key, form_json[key])
                        }
                        f.append('userID',userID)
                        postNewAuction(f,this.props.app);
                    } }>
                        <br/><br/>
                        <div className = "auction_car_info">
                            <h3 id = "auction_car_section">Car Info</h3>
                            <div>
                                <TextField sx={{ m:2 }}
                                required
                                id="car_make"
                                label="Make"
                                variant="outlined" 
                                value={this.state.make}
                                onChange={(e) => this.setState({ make: e.target.value})}
                                helperText="Please select the make"
                                >
                                </TextField>
                                <TextField sx={{ m:2 }}
                                required
                                id="car_year" 
                                label="Year" 
                                variant="outlined" 
                                type = "number"
                                value = {this.state.year}
                                onChange={ (e) => this.setState({ year: e.target.value }) }
                                helperText="Please enter the year"
                                />
                                <TextField sx={{ m:2 }}
                                required
                                id="car_model_select"
                                label="Model"
                                variant="outlined" 
                                value={this.state.model}
                                onChange={(e) => this.setState({ model: e.target.value})}
                                helperText="Please select the model"
                                >
                                </TextField>
                                <TextField sx={{ m:2 }}
                                required
                                id="car_color_select"
                                label="Color"
                                variant="outlined" 
                                value={this.state.bodyColor}
                                onChange={(e) => this.setState({ bodyColor: e.target.value})}
                                helperText="Please select the color"
                                >
                                </TextField>
                                <TextField sx={{ m:2 }}
                                required
                                id="car_milage" 
                                label="Milage" 
                                variant="outlined" 
                                type = "number"
                                value = {this.state.milage}
                                onChange={ (e) => this.setState({ milage: e.target.value }) }
                                helperText="Please enter car's milage"
                                />
                                <TextField sx={{ m:2 }}
                                required
                                id="bid_start_price" 
                                label="Bidding Start at ($)" 
                                variant="outlined" 
                                type = "number"
                                value = {this.state.bidstartingPrice}
                                onChange={ (e) => this.setState({ bidstartingPrice: e.target.value }) }
                                helperText="Please enter your desired bid starting price"
                                />
                                <TextField sx={{ m:2 }}
                                required
                                id="bid_start_time"
                                label="Bidding Start at"
                                type="datetime-local"
                                variant="outlined" 
                                value = {this.state.startDate}
                                onChange={ (e) => this.setState({ startDate: e.target.value }) }
                                InputLabelProps={{
                                shrink: true,
                                }}
                                />
                                <TextField sx={{ m:2 }}
                                required
                                id="bid_end_time"
                                label="Bidding End at"
                                type="datetime-local"
                                variant="outlined" 
                                value = {this.state.endDate}
                                onChange={ (e) => this.setState({ endDate: e.target.value }) }
                                InputLabelProps={{
                                shrink: true,
                                }}
                                />
                            </div>
                            <div>
                                <TextField  sx={{ m:2 }}
                                required
                                id="car_description" 
                                rows={10} 
                                label="Description" 
                                value = {this.state.description} 
                                placeholder="Enter your description here..." 
                                multiline
                                onChange={ (e) => this.setState({description: e.target.value})}
                                />
                            </div>
                            <br/><br/>
                            <input name="images" type="file" multiple="multiple"/>
                            <input type="submit" value='Submit' className='submit_btn' onClick={this.togglePop}/>
                            {(this.state.seen && !this.state.empty) ? <SubmitPopUp toggle={this.togglePop} /> : null}
                        </div>
                    </form>
                    <br/><br/>
                </div>
            </div>
        )
    }
}
