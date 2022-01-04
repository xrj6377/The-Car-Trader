import React, { Component } from 'react'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import {MenuItem, TextField } from '@mui/material';
import { filterPost } from '../../actions/filter';
import './SearchBar.css'

export class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            make:'',
            model: '',
            startYear: '',
            endYear: '',
            startPrice: '',
            endPrice: '',
            maxMil: '',
            bodyColor: '',
        }        
    }

    filterPosts() {
        const make = this.state.make;
        const model = this.state.model;
        const bodyColor = this.state.bodyColor;
        const startYear = this.state.startYear;
        const endYear = this.state.endYear;
        const startPrice = this.state.startPrice;
        const endPrice = this.state.endPrice;
        const maxMil = this.state.maxMil;

        if(endYear < startYear && (endYear != '')) {
            alert("End year cannot be smaller than the start year");
        } else if (endPrice < startPrice && (endPrice != '')) {
            alert("End price cannot be smaller than the start price")
        } else {
            filterPost(make.toUpperCase(), model.toUpperCase(), bodyColor.toUpperCase(), startYear, endYear, startPrice, endPrice, maxMil, this.props.app)
        }
    }

    clearFilter() {
        this.setState ({
            make:'',
            model: '',
            startYear: '',
            endYear: '',
            startPrice: '',
            endPrice: '',
            maxMil: '',
            bodyColor: '',
        })
        filterPost("", "", "", "", "", "", "", "", this.props.app)
    }


    render() {
        return (
            <div className="selectFieldContainer">
                <div className="selectField">
                    <TextField sx={{ m:2 }}
                    id="car_make_select" 
                    label="Make" 
                    variant="outlined" 
                    value = {this.state.make}
                    onChange={ (e) => this.setState({ make: e.target.value }) }
                    helperText="Filter make"
                    />
                    <TextField sx={{ m:2 }}
                    id="car_model_select" 
                    label="Model" 
                    variant="outlined" 
                    value = {this.state.model}
                    onChange={ (e) => this.setState({ model: e.target.value }) }
                    helperText="Filter model"
                    />
                    <TextField sx={{ m:2 }}
                    id="car_color_select" 
                    label="Color" 
                    variant="outlined" 
                    value = {this.state.bodyColor}
                    onChange={ (e) => this.setState({ bodyColor: e.target.value }) }
                    helperText="Filter color"
                    />
                    <TextField sx={{ m:2 }}
                    id="car_start_year" 
                    label="Year Range" 
                    type ="number"
                    variant="outlined" 
                    value = {this.state.startYear}
                    onChange={ (e) => this.setState({ startYear: e.target.value }) }
                    helperText="Start year"
                    />
                    <TextField sx={{ m:2 }}
                    id="car_end_year" 
                    label="Year Range" 
                    type ="number"
                    variant="outlined" 
                    value = {this.state.endYear}
                    onChange={ (e) => this.setState({ endYear: e.target.value }) }
                    helperText="End year"
                    />
                    <TextField sx={{ m:2 }}
                    id="car_start_price" 
                    label="Price Range" 
                    type ="number"
                    variant="outlined" 
                    value = {this.state.startPrice}
                    onChange={ (e) => this.setState({ startPrice: e.target.value }) }
                    helperText="Start Price"
                    />
                    <TextField sx={{ m:2 }}
                    id="car_end_price" 
                    label="Price Range" 
                    type ="number"
                    variant="outlined" 
                    value = {this.state.endPrice}
                    onChange={ (e) => this.setState({ endPrice: e.target.value }) }
                    helperText="End Price"
                    />
                    <TextField sx={{ m:2 }}
                    id="car_max_mileage" 
                    label="Max Mileage" 
                    type ="number"
                    variant="outlined" 
                    value = {this.state.maxMil}
                    onChange={ (e) => this.setState({ maxMil: e.target.value }) }
                    helperText="Filter max mileage"
                    />

                    <IconButton className='searchButtonBot' size = "large" onClick={ (e) => this.filterPosts() }>
                        <SearchIcon />
                    </IconButton>
                    {/* <Button className="clearFilterBtn" variant="contained" onClick={ (e) => this.clearFilter() }>Clear Filter</Button> */}
                    <input type="submit" value='Clear Filter' className='clearFilterBtn' onClick={ (e) => this.clearFilter() }/>
                </div>
            </div>
        )
    }
}

export default SearchBar
