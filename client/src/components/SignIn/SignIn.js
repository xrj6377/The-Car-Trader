//Reference: react-checkmark - https://www.npmjs.com/package/react-checkmark
// material ui - https://mui.com/getting-started/usage/
import React from 'react';
import SignUp from "../SignUp/SignUp"
import './SignIn.css'
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Checkmark } from 'react-checkmark' /*add animation checkmark*/
import {loginHelper} from '../../actions/user'
class SignInPopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enteredName : "",
            enteredPassword : "",
            userPhoto : "",
            userID : "",
            userType: "",
            loggedIn : false,
            signUp:false,
            error : false,
            hidden: true,
        }
        this.handleLoginNameChanges = this.handleLoginNameChanges.bind(this);
        this.handleLoginVerifications = this.handleLoginVerifications.bind(this);
        this.toggleHiddenPswd = this.toggleHiddenPswd.bind(this);
        this.handleLoginRequest = this.handleLoginRequest.bind(this);
        this.handleSignUpRequest = this.handleSignUpRequest.bind(this);
    }

    closePopUp = () => {
        const {togglePopup} = this.props;
        togglePopup && togglePopup();
        window.location.reload();
    }

    handleLoginNameChanges = (e) => {
        this.setState({
            enteredName: e.target.value,
        })
    }

    handleLoginPasswordChanges = (e) => {
        this.setState({
            enteredPassword: e.target.value,
        })
    }

    handleLoginVerifications = () => {
        const {enteredName, enteredPassword} = this.state;
        let res = null;
        loginHelper(enteredName, enteredPassword).then(response => {
            if(response){
                console.log(response);
                this.setState({
                    loggedIn : true,
                    error : false,
                    userPhoto : response.profilePhoto,
                    userID : response._id,
                    userType : response.userType,
                })
                
                this.handleLoginRequest();
                
                setTimeout(() => {
                    this.closePopUp();
                },2000);
                return;
            }
            else{
                this.setState({
                loggedIn : false,
                error : true,
                })
            }
        })
    }

    handleLoginRequest = () =>{
        const {userPhoto, userID, userType} = this.state;
        localStorage.setItem("userType", userType);
        localStorage.setItem("userLoggedIn",true);
        localStorage.setItem("userAvatar", userPhoto);
        localStorage.setItem("userID", userID);
    }

    handleSignUpRequest = () =>{
        this.setState({signUp:true});
    }


    toggleHiddenPswd = () => {
        if (!this.state.hidden)
            this.setState({
                hidden: true,
            })
        else {
            this.setState({
                hidden: false,
            })
        }
    }

    render() {
        const {error,loggedIn,hidden,signUp} = this.state
        return (
            <div className="loginWrapper">
                <div className="mask" />
                {signUp ? (<SignUp closePopUp={() => this.closePopUp()}/>)
                :(
                    <div className="loginBox">
                        <div className = "closeBtn">
                                <IconButton onClick={() => this.closePopUp()}>
                                    <CancelIcon/>
                                </IconButton>
                        </div>
                        <div className ="content">
                            {loggedIn ? (
                                <Checkmark size="xLarge"/>
                            ):(
                                <div>
                                    Login
                                </div>
                            )}
                            <div>
                                {error?(
                                    <TextField error id="standard-error" inputProps={{ maxLength: 12 }} label="Invalid Username" variant="standard" onChange={this.handleLoginNameChanges}/>
                                ):(
                                    <TextField id="standard-basic_1" inputProps={{ maxLength: 12 }} label="Username" variant="standard" onChange={this.handleLoginNameChanges}/>
                                )}
                            </div>
                            <div>
                                {error?(
                                        <TextField error id="standard-error" type={hidden ? "password" : "text"} inputProps={{ maxLength: 12 }} label="Invalid Password" variant="standard" onChange={this.handleLoginPasswordChanges}/>
                                    ):(
                                        <TextField id="standard-basic_2" type={hidden ? "password" : "text"} inputProps={{ maxLength: 12 }} label="Password" variant="standard" onChange={this.handleLoginPasswordChanges}/>
                                    )}
                                <div className="revealBtn">
                                    <IconButton onClick={this.toggleHiddenPswd}>
                                        {hidden?(
                                            <VisibilityIcon/>
                                        ):(
                                            <VisibilityOffIcon/>
                                        )}       
                                    </IconButton>
                                </div>
                            </div>
                            <div>
                                <LoadingButton variant="contained" loading={loggedIn} loadingPosition="center" style={{margin:"20px"}} color="success" onClick={this.handleLoginVerifications}>
                                    Submit
                                </LoadingButton>
                            </div>  
                            <div>
                                <Button style={{color:"black", "textDecoration": "underline","fontWeight":"bold"}} onClick={this.handleSignUpRequest}>Create an account</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
} 

export default SignInPopUp


  