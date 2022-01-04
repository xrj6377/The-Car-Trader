import { resolveOnChange } from 'antd/lib/input/Input'
import ColumnGroup from 'rc-table/lib/sugar/ColumnGroup'
import ENV from './../config.js'
const API_HOST = ENV.api_host
const log = console.log
export function signUpHelper(name,password,email,photo,postcode,usertype){
    const url = `${API_HOST}/api/users`
    let if_login = false
    // The data we are going to send in our request
    let data = {
        userName: name,
        passWord: password,
        email: email,
        postCode: postcode,
        profilePhoto: photo,
        userType: usertype
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

export function createUserInbox(userId){
    const url = `${API_HOST}/api/inbox/${userId}`
    // The data we are going to send in our request
    let data = {
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