'use strict'

const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const moment = require('moment');

//i need them to associate the value of the configurator to the meaning
const carCategoryArray = ["A","B","C","D","E"];
const driverAgeArray = ["Under 25", "25-65 years old", "Over 65"];
const kmPerDayArray = ["Less than 50km", "50-150km", "Unlimited"];

//DAO
const reservationDao = require('./dao/ReservationDao');
const userDao = require('./dao/UserDao');
const carDao = require('./dao/CarDao');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 900; //seconds, 15 minutes

// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

// Create application
const app = new express();
const PORT = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
        .then((user) => {

            if(user === undefined) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid username' }]
                });
            } else {
                if(!userDao.checkPassword(user, password)){
                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                    });
                } else {
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                    res.json({id: user.id, name: user.name});
                }
            }
        }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
    );
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

// Endpoints used for the public showroom page

//GET /cars
app.get('/api/cars', (req, res) => {
    carDao.getCars()
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});

//GET /brands
app.get('/api/brands', (req, res) => {
    carDao.getBrands()
        .then((brands) => {
            res.json(brands);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

// AUTHENTICATED REST API endpoints

//GET /user
app.get('/api/user', (req,res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({id: user.id, name: user.name});
        }).catch(
        (err) => {
            res.status(401).json(authErrorObj);
        }
    );
});

//GET /reservations
app.get('/api/reservations', (req, res) => {
    const user = req.user && req.user.user;
    reservationDao.getReservations(user)
        .then((reservations) => {
            res.json(reservations);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});

/*//POST /availableCars
app.post('/api/availableCars', (req, res) => {
    const reservation = req.body;
    if(!reservation){
        res.status(400).end();
    } else {
        carDao.getCarsForCategory(reservation.carCategory)
            .then((carsForCategory) => {
                reservationDao.getNonValidCars(reservation)
                    .then((nonValidCars) => {
                        res.json({"availableCars" : carsForCategory["COUNT(*)"] - nonValidCars["COUNT(*)"]});
                    })
                    .catch((err) => {
                        res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
                    })
            })
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});*/

/*//POST /carsForCategory
app.post('/api/carsForCategory', (req, res) => {
    const category = req.body;
    if(!category){
        res.status(400).end();
    } else {
        carDao.getCarsForCategory(category)
            .then((carsForCategory) => {
                res.json({"carForCategory" : carsForCategory["COUNT(*)"]});
            })
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});*/

//POST /price
app.post('/api/price', (req, res) => {
    const reservation = req.body;
    const reservationTranslated = {...reservation};
    reservationTranslated.carCategory = carCategoryArray[parseInt(reservation.carCategory)];
    console.log(reservation);
    if(!reservation){
        res.status(400).end();
    } else {
        carDao.getCarsForCategory(reservationTranslated.carCategory)
            .then((carsForCategory) => {
                reservationDao.getNonValidCars(reservationTranslated)
                    .then((nonValidCars) => {
                        const user = req.user && req.user.user;
                        console.log(user);
                        reservationDao.getReservations(user)
                            .then((userReservations) => {
                                console.log(carsForCategory);
                                console.log(nonValidCars);
                                console.log(userReservations);
                                const data = calculatePrice(reservation, carsForCategory["COUNT(*)"], nonValidCars["COUNT(*)"], userReservations)
                                console.log(data);
                                res.json(data);
                            })
                            .catch((err) => {
                                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
                            })
                    })
                    .catch((err) => {
                        res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
                    })
            })
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});

const calculatePrice = (reservation, carsForCategory, nonValidCars, userReservations) => {
    const priceTable = {
        category : [80, 70, 60, 50, 40],
        km : [-5/100, -0, +5/100],
        age : [+5/100, +0, +10/100],
        extraDrivers : +15/100,
        extraInsurance: +20/100,
        less10Vehicles : +10/100,
        frequentCustomer : -10/100
    }
    const duration = calculateDuration(reservation)
    const basePrice = priceTable.category[parseInt(reservation.carCategory)] * duration;
    console.log(basePrice);
    const kmFee = basePrice * priceTable.km[parseInt(reservation.kilometersPerDay)];
    const ageFee = basePrice * priceTable.age[parseInt(reservation.driverAge)];
    const extraDriversFee = basePrice * (reservation.extraDrivers === "0" ? 0 : priceTable.extraDrivers);
    const extraInsuranceFee = basePrice * (reservation.extraInsurance ? priceTable.extraInsurance : 0);
    const fewVehiclesFee = basePrice * ((carsForCategory * nonValidCars / 100) === 90 ? priceTable.less10Vehicles : 0);
    let frequentCustomerFee = 0;
    if (userReservations.length !== 0){
        const pastReservations = userReservations.filter((reservation) => {
            const today = moment();
            return moment(reservation.endingDay).isBefore(today);
        })
        if (pastReservations.length >= 3)
            frequentCustomerFee = basePrice * priceTable.frequentCustomer;
    }

    const totalPrice = basePrice + kmFee + ageFee + extraDriversFee + extraInsuranceFee + fewVehiclesFee + frequentCustomerFee;

    //will be used to show the detail of the totalPrice
    //converted into strings because i'm using only strings data as a standard
    return {
        duration : duration,
        numberOfAvailableCars: (carsForCategory - nonValidCars)+"",
        totalPrice : totalPrice+"",
        fees : {
            basePrice: basePrice+"",
            kmFee: kmFee+"",
            ageFee: ageFee+"",
            extraDriversFee: extraDriversFee+"",
            extraInsuranceFee: extraInsuranceFee+"",
            fewVehiclesFee : fewVehiclesFee+"",
            frequentCustomerFee : frequentCustomerFee+""
        }
    }
}

const calculateDuration = (reservation) => {
    const a = moment(reservation.startingDay);
    const b = moment(reservation.endingDay);
    //converted into strings because i'm using only strings data as a standard
    //+1 because commonly we say 1 day rental even if we return it on the same day and so on...
    return b.diff(a, 'days') + 1 + "";
}

//POST /reservations
app.post('/api/reservations', (req,res) => {
    const reservation = req.body;
    if(!reservation){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        reservation.user = user;
        reservationDao.createReservation(reservation)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});

//DELETE /reservations/<reservationId>
app.delete('/api/reservations/:reservationId', (req,res) => {
    reservationDao.deleteReservation(req.params.reservationId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
