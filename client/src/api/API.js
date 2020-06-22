import Car from "../entities/Car";
import Reservation from "../entities/Reservation";

const baseURL = "/api";

async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson; //user object
    } else {
        throw {status: response.status, errObj:userJson};  // An object with the error coming from the server
    }
}

async function getCars() {
    let url = "/cars";
    const response = await fetch(baseURL + url);
    const carsJson = await response.json();
    if(response.ok){
        return carsJson.map((c) => new Car(c.model, c.brand, c.category));
    } else {
        throw {status: response.status, errObj:carsJson};  // An object with the error coming from the server
    }
}

async function getBrands() {
    let url = "/brands";
    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
    if(response.ok){
        const brandsArray = [];
        for (const couple of brandsJson) {
            brandsArray.push(couple["brand"]);
        }
        return brandsArray; //string array
    } else {
        throw {status: response.status, errObj:brandsJson};  // An object with the error coming from the server
    }
}

async function getReservations() {
    let url = "/reservations";
    const response = await fetch(baseURL + url);
    const reservationsJson = await response.json();
    if(response.ok){
        if (reservationsJson === {}) //probabilmente qua non andrà bene
            return reservationsJson;
        else
            return reservationsJson.map((r) => new Reservation(r.id, r.startingDay, r.endingDay, r.carCategory, r.driverAge,
                r.kmPerDay, r.extraDrivers, r.extraInsurance, r.price, r.user));
    } else {
        throw {status: response.status, errObj:reservationsJson};  // An object with the error coming from the server
    }
}

async function getPriceData(reservation) {
    let url = "/price";
    const response = await fetch(baseURL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
    });
    const priceDataJson = await response.json();
    if(response.ok) {
        return priceDataJson;
    }else {
        throw {status: response.status, errObj:priceDataJson};  // An object with the error coming from the server
    }
}

/*async function getAvailableCars(reservation) {
    let url = "/availableCars";
    const response = await fetch(baseURL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
    });
    const availableCarsJson = await response.json();
    if(response.ok){
        return availableCarsJson["availableCars"]; // a string rappresenting a number
    } else {
        throw {status: response.status, errObj:availableCarsJson};  // An object with the error coming from the server
    }
}*/

/*async function getNumberOfCarsForCategory(category) {
    let url = "/carsForCategory";
    const response = await fetch(baseURL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    });
    const numberOfCarsJson = await response.json();
    if(response.ok){
        return numberOfCarsJson["carForCategory"]; // a string rappresenting a number
    } else {
        throw {status: response.status, errObj:numberOfCarsJson};  // An object with the error coming from the server
    }
}*/

async function addReservation(reservation) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/reservations", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservation),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then( (obj) => {reject(obj);} ) // error msg in the response body
                    .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteReservation(reservationId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/reservations/" + reservationId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then( (obj) => {reject(obj);} ) // error msg in the response body
                    .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

const API = { isAuthenticated, getCars, getBrands, getReservations, getPriceData,
    addReservation,deleteReservation, userLogin, userLogout} ;
export default API;
