import ENV from './../config.js'
const API_HOST = ENV.api_host

export const filterPost = (make, model, bodyColor, startYear, endYear, startPrice, endPrice, maxMil, app) => {
    const url = `${API_HOST}/api/filter`;

    let data = {
        make: make,
        model: model,
        bodyColor: bodyColor,
        startYear: startYear,
        endYear: endYear,
        startPrice: startPrice,
        endPrice: endPrice,
        maxMil: maxMil
    }

    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        }
    });

    fetch(request)
    .then(function (res) {
        if (res.status === 200) {
            console.log("success")
            return res.json();
        } else {
            console.log("fail")
        }
    })
    .then(json => {
        if (json) {
            app.setState({ carList: json })
        }
    })
    .catch(error => {
        console.log(error);
    });
}