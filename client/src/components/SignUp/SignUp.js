import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Avatar } from 'antd';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import './SignUp.css'
import {signUpHelper,createUserInbox} from '../../actions/signup'
import ChangePhoto from './ChangePhoto';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePhoto:"UserPhotos/user.png",
            signingUp: false,
            enteredName: "",
            enteredPassword: "",
            enteredEmail: "",
            enteredPostCode: ""
        }
        this.signUpHandeler = this.signUpHandeler.bind(this);
        this.handleSignUpUserNameChanges = this.handleSignUpUserNameChanges.bind(this);
        this.handleSignUpPasswordChanges = this.handleSignUpPasswordChanges.bind(this);
        this.handleSignUpEmailChanges = this.handleSignUpEmailChanges.bind(this);
        this.handlePostCodeChanges = this.handlePostCodeChanges.bind(this);
        this.closePopUp = this.closePopUp.bind(this);

    }

    signUpHandeler = () => {
        const {enteredName, enteredPassword,enteredEmail,profilePhoto,enteredPostCode} = this.state;
        const usertype = "user";
        signUpHelper(enteredName,enteredPassword,enteredEmail,profilePhoto,enteredPostCode,usertype).then(response => {
            if(response){
                createUserInbox(response._id);
                this.setState({signingUp:true});
                setTimeout(() => {
                    const userTypes = ["admin","user"];
                    localStorage.setItem("userType", userTypes[1]); 
                    localStorage.setItem("userLoggedIn",true);
                    localStorage.setItem("userAvatar", profilePhoto);
                    localStorage.setItem("userID", response._id);
                    this.props.closePopUp();
                },1000);
            }
        })
    }

    handleSignUpUserNameChanges = (e) => {
        this.setState({
            enteredName: e.target.value,
        })
    }

    handleSignUpPasswordChanges = (e) => {
        this.setState({
            enteredPassword: e.target.value,
        })
    }

    handleSignUpEmailChanges = (e) => {
        this.setState({
            enteredEmail: e.target.value,
        })
    }

    handlePostCodeChanges = (e) => {
        this.setState({
            enteredPostCode: e.target.value,
        })
    }

    handlePhotoChange = (photo) => {
        localStorage.setItem("userAvatar",photo);
        this.setState({
            profilePhoto : photo
        })
    }

    closePopUp = () => {
        const {togglePopup} = this.props;
        togglePopup && togglePopup();
    }

    render() {
        const {profilePhoto, signingUp} = this.state;
        return (
            <div className="signUpBox">
                <div className = "closeBtn">
                    <IconButton onClick={() => this.props.closePopUp()}>
                        <CancelIcon/>
                    </IconButton>
                </div>
                <div className ="SignUpContent">
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >   
                        <div><Avatar size= {80} src = {profilePhoto} /></div>
                        <ChangePhoto handlePhotoChange = { this.handlePhotoChange } photo1 = "UserPhotos/user.png" photo2 = "UserPhotos/user2.png" photo3 = "UserPhotos/kiwi.png" photo4 = "UserPhotos/user3.png" photo5 = "UserPhotos/user4.png"/>
                        <div><TextField id="standard-basic_4" inputProps={{ maxLength: 15 }} label="Username" variant="standard" onChange={this.handleSignUpUserNameChanges}></TextField></div>
                        <div><TextField id="standard-basic_5" type={"password"} inputProps={{ maxLength: 30 }} label="Password" variant="standard" onChange={this.handleSignUpPasswordChanges}></TextField></div>
                        <div><TextField id="standard-basic_6" type={"password"} inputProps={{ maxLength: 30 }} label="Confirmed Password" variant="standard"></TextField></div>
                        <div><TextField id="standard-basic_7" inputProps={{ maxLength: 30 }} label="E-mail" variant="standard" onChange={this.handleSignUpEmailChanges}></TextField></div>
                        <div><TextField id="standard-basic_7" inputProps={{ maxLength: 7 }} label="Post Code" variant="standard" onChange={this.handlePostCodeChanges}></TextField></div>
                        <LoadingButton variant="contained" loading={signingUp} loadingPosition="center" style={{margin:"20px"}} color="success" onClick={this.signUpHandeler}>
                                    Sign Up and Log In
                        </LoadingButton>
                    </Stack>
                </div>
            </div>
        )
    }
}

export default SignUp;