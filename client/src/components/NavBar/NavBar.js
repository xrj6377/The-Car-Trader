import React, { Component } from 'react'
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { Link,NavLink  } from 'react-router-dom';

import "./NavBar.css"

export class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen : false,
            loggedIn : false,
            userType: "",
            avatar : "",
            showMenu: false,
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    handleLogout = () => {
        localStorage.setItem("userLoggedIn",false);
        this.setState({loggedIn:false, showMenu:false});
        localStorage.clear();
        window.location.reload();
    }


    toggleMenu = () => {
        if (this.state.showMenu)
            this.setState({
                showMenu: false,
            })
        else {
            this.setState({
                showMenu: true,
            })
        }
    }


    render() {
        const avatar = localStorage.getItem("userAvatar");
        const loggedIn = localStorage.getItem("userLoggedIn");
        const {showMenu} = this.state;
        return (
  
            <div className="topnav">
                <Link to={{ pathname: '/'}} underline='none'>
                    <Button>Home</Button>
                </Link>

                { (loggedIn && localStorage.userType === 'user') &&  <Link to={{ pathname: '/sell' }} underline='none'>
                                                                            <Button>Sell A Car</Button>
                                                                     </Link> }
                { loggedIn &&  <Link to={{ pathname: '/auction' }} underline='none'>
                            <Button>Car Auctions</Button>
                        </Link> }
                
                { (loggedIn && localStorage.userType === 'user') &&  <Link to={{ pathname: '/sellAtauction' }} underline='none'>
                            <Button>Sell Your Car At Auction</Button>
                        </Link>}
                <div className="userSection">
                    {loggedIn ? (
                        <div className = "userMenu">
                            <Avatar className="user" src={avatar}/>
                            <div>
                                <IconButton onClick={() => this.toggleMenu()}>
                                    <MenuIcon/>
                                </IconButton>
                            </div>
                            {showMenu && 
                                <div className="menuListOuter">
                                    <div className="menuListInner">
                                        <MenuList id="composition-menu" aria-labelledby="composition-button">
                                            <MenuItem>
                                                <NavLink  to={{ pathname: '/userprofile'}}>
                                                Profile
                                                </NavLink >
                                            </MenuItem>
                                            { localStorage.getItem('userType') === 'admin' && (
                                                <MenuItem>
                                                    <Link to={{ pathname: '/adminHome'}}>
                                                        AdminHome
                                                    </Link>
                                                </MenuItem>
                                            )}
                                            { localStorage.userType === 'user' && (<MenuItem>
                                                <Link  to={{ pathname: '/myPostings'}}>
                                                My Postings
                                                </Link >
                                            </MenuItem>)}
                                            <MenuItem>
                                                <Link  to={{ pathname: '/userInbox'}}>
                                                Inbox
                                                </Link >
                                            </MenuItem>
                                            <MenuItem onClick={() => this.handleLogout()}>
                                                <Link to={{ pathname: '/'}}>
                                                    Logout
                                                </Link>
                                            </MenuItem>
                                        </MenuList>
                                    </div>
                                </div>
                            }
                            
                        </div>
                    ) : (
                        <Button className="sign-in" variant="contained" onClick={() => this.props.togglePopup()}>Sign in/Up</Button>
                    )}
                </div>
            </div>
        )
    }
}

export default NavBar
