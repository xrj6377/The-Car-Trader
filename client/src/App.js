import './App.css';
import Home from './components/Home/Home.js'
// import SignInPopUp from "./components/SignIn/SignIn.js"
import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import CarInfo from './components/CarInfo/CarInfo';
import CarSelling from './components/CarSelling/CarSelling'
import { UserProfile } from './components/UserProfile/UserProfile';
import { UserInbox } from './components/UserInbox/UserInbox'
import AdminHome from './components/AdminHome/AdminHome';
import AuctionBuy from './components/AuctionBuy/AuctionBuy';
import MyPostings from './components/MyPostings/MyPostings';
import { getCarListing } from './actions/listing';
import { getAuctionListing } from './actions/auction';
import { monitorAuction } from './actions/admin';
import { checkSession } from './actions/user';
import AuctionSell from './components/AuctionSell/AuctionSell';


class App extends React.Component {
    componentDidMount() {
      // Getting all car listings, approved and unapproved.
      getCarListing(this)
      getAuctionListing(this)
      checkSession(this)
      if (localStorage.userType === 'admin') {
        const itv = setInterval(() => {
          monitorAuction(this)
        }, 10000)
        this.setState({ interval: itv })
      }
    }

    componentWillUnmount() {
      if (this.state.interval !== null) {
        clearInterval(this.state.interval)
      }
    }

    state = {
      // sellerName, sellerEmial, make, year, model, bodyColor, milage, listingPrice, pictures, description
      carList: [],
      unapprovedCarList: [],
      // sellerName, sellerEmail, make, year, model, bodyColor, milage, bidStartPrice, highestBid, pictures, description, startDate, endDate
      auctionList: [],
      // sellerName, sellerEmail, make, year, model, bodyColor, milage, bidStartPrice, pictures, description, startDate, endDate
      unapprovedAuctionList: [],
      expiredAuctions: [],
      interval: null,
      userId: null
    }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch> { /* Similar to a switch statement - shows the component depending on the URL path */ }
            { /* Each Route below shows a different component depending on the exact path in the URL  */ }
            <Route exact path='/' render={(props) => 
                            (<Home {...props} carList={this.state.carList} app={this}/>)}/>
            
            <Route exact path='/carInfo/:mode/:id' render={(props) => (
                          <div>
                            {!localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <CarInfo {...props} app={ this }/> }
                          </div>
            )}/>

            <Route exact path='/sell' render={(props) => 
                            (<div>
                              {!localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <CarSelling carList={this.state.unapprovedCarList} app={this}/> }
                            </div>)}/>

            <Route exact path='/userProfile' render={(props) => 
                            (<div>
                              {!localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <UserProfile {...props} appState={this.state}/> }
                            </div>)}/>

            <Route exact path='/userInbox' render={(props) => 
                            (<div>
                                {!localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <UserInbox {...props} app={this} />}
                              </div>
                            )}/>

            <Route exact path='/adminHome' render={(props) => 
                            (<div>
                            { !localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <AdminHome appState={this.state} app={ this }/> }
                            </div>)}/>

            <Route exact path='/auction' render={(props) => 
                            (<div>
                            { !localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <AuctionBuy carList={this.state.auctionList}/> }
                            </div>)}/>
            
            <Route exact path='/sellAtAuction' render={(props) => 
                            (<div>
                            { !localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <AuctionSell carList={this.state.unapprovedAuctionList} app = {this}/> }
                            </div>)}/>

            <Route exact path='/myPostings' render={(props) => 
                            (<div>
                              { !localStorage.userID ? <Home {...props} carList={this.state.carList} app={this}/> : <MyPostings app={ this } />}
                            </div>)}/>                

            <Route render={() => <div>404 Not found</div>} />
          </Switch>
        </BrowserRouter>
      </div>
    );  
  }
}

export default App;
