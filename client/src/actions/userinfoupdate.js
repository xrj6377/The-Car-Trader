import ENV from './../config.js'
const API_HOST = ENV.api_host
const log = console.log
export function updateHelper(app){
    const url = `${API_HOST}/api/users/${app.state.userID}`
    // The data we are going to send in our request
    let data = {
        userName : app.state.username,
        passWord : app.state.password,
        email : app.state.email,
        postCode: app.state.postCode,
        profilePhoto: app.state.profilePhoto
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'put', 
        body: JSON.stringify(data),
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'connection' : 'keep-alive',
            'Accept-Encoding': 'gzip, deflate, br',
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE"

        },
    });
    // Send the request with fetch()
    return fetch(request)
        .then(res => {
            if (res.status === 200) {
                log("Update success")
            }
        })
        .catch((error) => {
            log(error)
        })
}