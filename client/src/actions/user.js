import ENV from './../config.js'
const API_HOST = ENV.api_host
const log = console.log

export function loginHelper(name,password){
    const url = `${API_HOST}/api/users/login`
    let if_login = false
    // The data we are going to send in our request
    let data = {
        userName: name,
        passWord: password
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'connection' : 'keep-alive',
            'Accept-Encoding': 'gzip, deflate, br',

        },
    });
    // Send the request with fetch()
    return fetch(request)
        .then(res => {
            if (res.status === 200) {
                if_login = true
                return res.json();
            }
        })
        .then(json=>{
            return json
        })
        .catch((error) => {
            log(error)
        })
}


export function checkSession(app) {
    if (localStorage.length !== 0) {
        app.setState({ userId: localStorage.userID })
    }
}

export function getMessages(userId, ibx, option) {
    const url = `${API_HOST}/api/inbox/${userId}/${option}`

    fetch(url)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json) {
            ibx.setState({ messages: json })
        }
    })
    .catch((error) => {
        log(error)
    })
}

export function getSenderName(senderId, messageComponent) {
    const url = `${API_HOST}/api/users/${senderId}`

    fetch(url)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        }
    })
    .then(json => {
        messageComponent.setState({ senderName: json.user.userName })
    })
    .catch((error) => {
        log(error)
    })
}

export function sendMessage(senderId, receiverId, msg, messageComponent) {
    const url = `${API_HOST}/api/inbox/${senderId}/${receiverId}`

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
    .then(res => {
        if (res.status === 200) {
            messageComponent.setState({ replyStatus: {
                type: 'good',
                body: 'Reply sent.'
            } })
        }
        else {
            messageComponent.setState({ replyStatus: {
                type: 'bad',
                body: 'Failed to send reply.'
            } })
        }
    })
    .catch((error) => {
        log(error)
    })
}

export function markMessageAsRead(ownerId, messgaeId, userInbox) {
    const url = `${API_HOST}/api/markAsRead/${ownerId}/${messgaeId}`

    const request = new Request(url, {
        method: "post"
    })

    fetch(request)
    .then(res => {
        if (res.status === 200) {
            getMessages(ownerId, userInbox, userInbox.state.displayOption)
        }
    })
    .catch((error) => {
        log(error)
    })
}

export function deleteMessage(ownerId, messgaeId, userInbox) {
    const url = `${API_HOST}/api/deleteMessage/${ownerId}/${messgaeId}`

    const request = new Request(url, {
        method: "delete"
    })

    fetch(request)
    .then(res => {
        if (res.status === 200) {
            getMessages(ownerId, userInbox, userInbox.state.displayOption)
        }
    })
    .catch((error) => {
        log(error)
    })
}