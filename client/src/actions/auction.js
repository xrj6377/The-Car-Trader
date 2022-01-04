import ENV from './../config.js'
const API_HOST = ENV.api_host

export const postNewAuction = (form_data, app) => {
    // the URL for the request
    const url = `${API_HOST}/api/TBAauctionListings`
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: form_data,
    });
    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If image was added successfully, tell the user.
                console.log("Successfully send auction")
                return res.json()
            } else {
                // If server couldn't add the image, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("Failed to send auction")
            }
        })
        .then((json) => {
            if(json){
                const unapprovedauctionListing = app.state.unapprovedAuctionList;
                unapprovedauctionListing.push(json)
                app.setState({unapprovedAuctionList: unapprovedauctionListing})
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const getAuctionById = (carId, carInfoPage) => {
    const url = `${API_HOST}/api/approvedAuctionListing/${carId}`

    fetch(url)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        carInfoPage.setState({ car: json })
    })
}

// Get one TBA auction by id
export const getTBAauctionById = (carId, carInfoPage) => {
    const url = `${API_HOST}/api/TBAauctionListing/${carId}`;

    fetch(url)
    .then((res) => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then((json) => {
        if (json) {
            carInfoPage.setState({ car: json })
        }
    })
}

// Get all auction listing, approved and TBA
export const getAuctionListing = (app) => {
    const approvedUrl = `${API_HOST}/api/activeAuctions`
    fetch(approvedUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json) {
            app.setState({ auctionList: json })
        }
    })
    .catch(error => {
        console.log(error)
    })

    const TBAUrl = `${API_HOST}/api/TBAauctionListings`
    fetch(TBAUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        if (json) {
            app.setState({ unapprovedAuctionList: json })
        }
    })
}

export const placeBid = (userId, newBid, carId, infoPage, panel, app) => {
    const url = `${API_HOST}/api/placeBid/${carId}`

    const request = new Request(url, {
        method: "post",
        body: JSON.stringify({
            bid: newBid,
            bidder: userId
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        }
    });

    fetch(request)
    .then(res => {
        if (res.status === 200) {
            panel.setState({ message: {
                type: 'good',
                body: 'Successfully placed bid of ' + newBid + '.' 
            } })
            return res.json()
        }
        else {
            panel.setState({ message: {
                type: 'bad',
                body: 'Failed to place bid.' 
            } })
            if (res.status === 400) {
                return res.json()
            }
        }
    })
    .then(json => {
        if (json) {
            infoPage.setState({ car: json })
            getAuctionListing(app)
        }
    })
    .catch(error => {
        console.log(error);
    });
}

// Get auction by userId
export const getMyAuctions = (myId, myPostingsPage) => {
    const approvedUrl = `${API_HOST}/api/myAuctions/${myId}/approved`

    fetch(approvedUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        if (json) {
            myPostingsPage.setState({ myAuction: json })
        }
    })
    .catch(error => {
        console.log(error);
    });

    const TBAurl = `${API_HOST}/api/myAuctions/${myId}/TBA`
    fetch(TBAurl)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        if (json) {
            myPostingsPage.setState({ myTBAauction: json })
        }
    })
    .catch(error => {
        console.log(error);
    });
}


export const deleteMyAuction = (carId, myId, type, myPostingsPage) => {
    const url = `${API_HOST}/api/deleteAuction/${carId}/${type}`

    const request = new Request(url, {
        method: "delete"
    })

    fetch(request)
    .then(res => {
        if (res.status === 200) {
            getMyAuctions(myId, myPostingsPage)
        }
    })
    .catch(error => {
        console.log(error)
    })
}