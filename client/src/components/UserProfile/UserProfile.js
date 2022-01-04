import React, { Component } from 'react'
import NavBar from '../NavBar/NavBar'
import Button from '@mui/material/Button';
import 'antd/dist/antd.css';
import { Avatar } from 'antd';
import { FormControl, MenuItem, Select, TextField } from '@mui/material';
import SignInPopUp from "../SignIn/SignIn";
import './UserProfile.css'
import ChangePhoto from './ChangePhoto';
import {getUserInfo} from '../../actions/userinfo'
import {updateHelper} from '../../actions/userinfoupdate'

export class UserProfile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            postCode: '',
            profilePhoto: '',
            userID: '',
            isOpen: false,
        }
        this.togglePopup = this.togglePopup.bind(this);
        this.handleUserInfoUpdate = this.handleUserInfoUpdate.bind(this);
        this.handlePhotoChange = this.handlePhotoChange.bind(this);
    }
    handleUserInfoUpdate = () => {
        updateHelper(this);
        window.location.reload();
    }

    handlePhotoChange = (photo) => {
        localStorage.setItem("userAvatar",photo); //temp
        this.setState({
            profilePhoto : photo
        })
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
    
    componentDidMount(){
        const avatar = localStorage.getItem("userAvatar");
        const userID = localStorage.getItem('userID');
        this.setState({profilePhoto:avatar, userID:userID},
            ()=> getUserInfo(this),)
    }

    render() {
        const {isOpen, username, email, postCode} = this.state;
        return(
            <div>
                {isOpen && <SignInPopUp togglePopup={() => this.togglePopup()}/>}
                <NavBar togglePopup={() => this.togglePopup()}/>
                <div id = 'profileWrapper'>
                    <h2 className = 'title'> Profile </h2>

                    <div className = 'avatar'>
                        <Avatar size= {108} src = {this.state.profilePhoto}/>
                        <ChangePhoto handlePhotoChange = { this.handlePhotoChange } photo1 = "UserPhotos/user.png" photo2 = "UserPhotos/user2.png" photo3 = "UserPhotos/kiwi.png" photo4 = "UserPhotos/user3.png" photo5 = "UserPhotos/user4.png"/>
                    </div>

                    <div className = 'infoWrapper'>
                        <label className = 'label'> Username: </label> <br/>
                        <TextField id="outlined-basic" label={username} variant="outlined" onChange = { (e) => this.setState({ username: e.target.value})} />
                    </div>

                    <div className = 'infoWrapper'>
                        <label className = 'label'> Password: </label> <br/>
                        <TextField id="outlined-basic" label="*********" variant="outlined" onChange = { (e) => this.setState({ password: e.target.value})}/>
                    </div>

                    <div className = 'infoWrapper'>
                        <label className = 'label'> Email: </label> <br/>
                        <TextField id="outlined-basic" label={email} variant="outlined" onChange = { (e) => this.setState({ email: e.target.value})}/>
                    </div>

                    <div className = 'infoWrapper'>
                        <label className = 'label'> Postcode: </label> <br/>
                        <TextField id="outlined-basic" label={postCode} variant="outlined" onChange = { (e) => this.setState({ postCode: e.target.value})}/>
                    </div>

                    <div className = 'infoWrapper'>
                        <label className = 'label'> I am ...</label> <br/>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select>
                                <MenuItem value={'Selling a Car'}>Selling a Car</MenuItem>
                                <MenuItem value={'Looking for a Car'}>Looking for a Car</MenuItem>
                                <MenuItem value={'Both'}>Both</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="updateButton">
                        <Button variant="contained" onClick={this.handleUserInfoUpdate}>Update</Button>
                    </div>
                    
                </div>
            </div>
        )
    }
}
export default UserProfile