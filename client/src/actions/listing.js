import ENV from './../config.js'
const API_HOST = ENV.api_host

export const getCarListing = (app) => {
    const approvedUrl = `${API_HOST}/api/approvedListings`
    fetch(approvedUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json) {
            app.setState({ carList: json })
        }
    })
    .catch(error => {
        console.log(error)
    })

    const TBAUrl = `${API_HOST}/api/TBAListings`
    fetch(TBAUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json) {
            app.setState({ unapprovedCarList: json })
        }
    })
    .catch(error => {
        console.log(error)
    })
};

export const addListing = (form_data, app) => {
    // the URL for the request
    const url = "/api/TBAListings";
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: form_data
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If image was added successfully, tell the user.
                console.log("Successfully send listing")
                return res.json()
            } else {
                // If server couldn't add the image, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("Failed to send listing")
            }
        })
        .then((json) => {
            if (json) {
                const unapprovedListing = app.state.unapprovedCarList;
                unapprovedListing.push(json);
                app.setState({ unapprovedCarList: unapprovedListing })
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const getListingById = (carId, carInfoPage) => {
    const url = `${API_HOST}/api/approvedListing/${carId}`;

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
    .catch(error => {
        console.log(error);
    });
}

export const getTBAlistingById = (carId, carInfoPage) => {
    const url = `${API_HOST}/api/TBAListing/${carId}`;

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

export const contactSeller = (postCreatorId, myId, msg, contactPanel) => {
    const url = `${API_HOST}/api/inbox/${myId}/${postCreatorId}`

    const request = new Request(url, {
        method: "post",
        body: JSON.stringify({
            message: msg
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        }
    })

    fetch(request)
    .then((res) => {
        if (res.status === 200) {
            if (contactPanel) {
                contactPanel.setState({ messageResponse: {
                    type: 'good',
                    body: 'Successfully sent message to the seller.'
                } })
            }
        }
        else {
            if (contactPanel) {
                contactPanel.setState({ messageResponse: {
                    type: 'bad',
                    body: 'Failed to send message to the seller.'
                } })
            }
        }
    })
    .catch(error => {
        console.log(error);
    });
}

export const getMyListings = (myId, myPostingsPage) => {
    const approvedUrl = `${API_HOST}/api/myListings/${myId}/approved`

    fetch(approvedUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        if (json) {
            myPostingsPage.setState({ myListing: json })
        }
    })
    .catch(error => {
        console.log(error);
    });

    const TBAurl = `${API_HOST}/api/myListings/${myId}/TBA`
    fetch(TBAurl)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        if (json) {
            myPostingsPage.setState({ myTBAlisting: json })
        }
    })
    .catch(error => {
        console.log(error);
    });
}


export const deleteMyListing = (carId, myId, type, myPostingsPage) => {
    const url = `${API_HOST}/api/deleteListing/${carId}/${type}`

    const request = new Request(url, {
        method: "delete"
    })

    fetch(request)
    .then(res => {
        if (res.status === 200) {
            getMyListings(myId, myPostingsPage)
        }
    })
    .catch(error => {
        console.log(error)
    })
}