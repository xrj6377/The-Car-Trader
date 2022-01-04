import ENV from './../config.js'
const API_HOST = ENV.api_host

export const getUserInfo = (app) => {
    const url = `${API_HOST}/api/users/${app.state.userID}`
    fetch(url)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json) {
            app.setState({ email: json.user.email, username: json.user.userName, postCode: json.user.postCode })
        }
    })
    .catch(error => {
        console.log(error)
    })
};