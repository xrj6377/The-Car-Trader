import ENV from './../config.js'
const API_HOST = ENV.api_host

export const approvePost = (id, mode) => {
    const url = `${API_HOST}/api/${mode}/approvePost/${id}`;
    const request = new Request(url, {
        method: "post",
    });

    fetch(request)
    .then(function (res) {
        if (res.status === 200) {
            console.log("success")
        } else {
            console.log("fail")
        }
    })
    .catch(error => {
        console.log(error);
    });
}

export const declinePost = (id, mode) => {
    const url = `${API_HOST}/api/${mode}/declinePost/${id}`;
    const request = new Request(url, {
        method: "post",
    });

    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                console.log("success")
            } else {
                console.log("fail")
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const monitorAuction = (app) => {
    // monitor active auctions and update what's shown on auctionBuy page
    const activeUrl = `${API_HOST}/api/activeAuctions`
    fetch(activeUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json()
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

    // minotor newly expiredAuctions
    const expiredUrl = `${API_HOST}/api/expiredAuctions`
    fetch(expiredUrl)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        if (json && json.length > 0) {
            notifyAuctionResult(json, app)
            removeExpiredAuctions(json)
        }
    })
    .catch(error => {
        console.log(error)
    })
}

const notifyAuctionResult = (expiredAuctions) => {
    for (let i = 0; i < expiredAuctions.length; i++) {
        const auc = expiredAuctions[i]
        if (auc.participants.length === 0) {
            contactParticipant(localStorage.userID, auc.creator, `The auction of your ${auc.year} ${auc.make} ${auc.model} has ended with no participants.`)
        }
        else {
            const winner = auc.highestBidder
            contactParticipant(localStorage.userID, winner, `Congratulations! You have won the auction of the ${auc.year} ${auc.make} ${auc.model}!`)
            contactParticipant(winner, auc.creator, `Hi, I've won the auction of your amazing ${auc.year} ${auc.make} ${auc.model}, let's talk details!`)
            for (let j = 0; j < auc.participants.length; j++) {
                if (String(winner) !== String(auc.participants[j])) {
                    contactParticipant(localStorage.userID, auc.participants[j], `Sorry, you bid didn't win the auction of the ${auc.year} ${auc.make} ${auc.model}!`)
                }
            }
        }
    }
}

const contactParticipant = (fromId, toId, msg) => {
    const url = `${API_HOST}/api/inbox/${fromId}/${toId}`

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
    .catch(error => {
        console.log(error)
    })
}

const removeExpiredAuctions = (expiredAuctions) => {
    for (let i = 0; i < expiredAuctions.length; i++) {
        const url = `${API_HOST}/api/deleteAuction/${expiredAuctions[i]._id}/approved`

        const request = new Request(url, {
            method: "delete",
        })

        fetch(request)
        .catch(error => {
            console.log(error)
        })
    }
}