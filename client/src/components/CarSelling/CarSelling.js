import React, { Component } from 'react'
import NavBar from '../NavBar/NavBar'
import {TextField } from '@mui/material';
import SignInPopUp from "../SignIn/SignIn";
import SubmitPopUp from '../SubmitPopUp/SubmitPopUp';
import { addListing } from '../../actions/listing';
import './CarSelling.css';

export class CarSelling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            make:'',
            year:'',
            model:'',
            bodyColor:'',
            milage:'',
            listingPrice:'',
            description:'',
            isOpen: false,
            seen: false,
            empty: true
        }
        this.togglePopup = this.togglePopup.bind(this); 
    }

    togglePop = () => {
        for(var key in this.state){
            if(this.state[key] === ''){
                this.setState({
                    empty: true
                })
                break;
            }else{
                this.setState({
                    empty: false
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
            <div className = 'page'>
                {isOpen && <SignInPopUp togglePopup={() => this.togglePopup()}/>}
                <NavBar togglePopup={() => this.togglePopup()}/>
                <div className = 'selling_form'>
                    <br/><br/>
                    <h2 id ='selling_form_header'>Create a listing</h2>
                    
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const f = new FormData(e.target)
                        for( const key in form_json){
                            f.append(key,form_json[key])
                        }
                        f.append('userID',userID)
                        addListing(f, this.props.app)
                        
                    }}>
                        <br/><br/>
                        <div className = "seller_car_info">
                            <h3 id = "car_section">Car Info</h3>
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
                                type ="number"
                                variant="outlined" 
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
                                id="car_price" 
                                label="Listing Price" 
                                variant="outlined" 
                                type = "number"
                                value = {this.state.listingPrice}
                                onChange={ (e) => this.setState({ listingPrice: e.target.value }) }
                                helperText="Please enter the price"
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
                            <input type="file" name="images" multiple="multiple" />
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

export default CarSelling