'use strict'

const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Custom files
const utility = require('./utility');
const translationArrays = require('./translationArrays');

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
app.use(function (err, req, res) {
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

//POST /price
app.post('/api/price', (req, res) => {
    const reservation = req.body;
    const reservationTranslated = {...reservation};
    reservationTranslated.carCategory = translationArrays.carCategoryArray[parseInt(reservation.carCategory)];
    if(!reservation){
        res.status(400).end();
    } else {
        carDao.getCarsForCategory(reservationTranslated.carCategory)
            .then((carsForCategory) => {
                reservationDao.getNonValidCars(reservationTranslated)
                    .then((nonValidCars) => {
                        const user = req.user && req.user.user;
                        reservationDao.getReservations(user)
                            .then((userReservations) => {
                                const serverPriceData = utility.calculatePrice(reservation, carsForCategory, nonValidCars, userReservations)
                                res.json(serverPriceData);
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

//POST /payment
app.post('/bank/payment', (req, res) => {
    // copy and past from price API, the simplest way to avoid a server-server call
    // this calcutates the price as in price API and then check if the price of the request is correct for the reservation sent
    const data = req.body;
    const paymentData = data["paymentData"];
    const reservation = data["reservation"];
    const reservationTranslated = {...reservation};
    reservationTranslated.carCategory = translationArrays.carCategoryArray[parseInt(reservation.carCategory)];
    if(!data){
        res.status(400).end();
    } else {
        carDao.getCarsForCategory(reservationTranslated.carCategory)
            .then((carsForCategory) => {
                reservationDao.getNonValidCars(reservationTranslated)
                    .then((nonValidCars) => {
                        const user = req.user && req.user.user;
                        console.log(`User: ${user}`);
                        reservationDao.getReservations(user)
                            .then((userReservations) => {
                                const serverPriceData = utility.calculatePrice(reservation, carsForCategory, nonValidCars, userReservations)
                                if (utility.checkPaymentData(paymentData, reservation, serverPriceData))
                                    res.status(200).end();
                                else
                                    res.status(400).json({errors: [{'param': 'Client', 'msg': "There are errors in payment data"}],})
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

//POST /reservations
app.post('/api/reservations', (req,res) => {
    const reservation = req.body;
    if(!reservation){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;

        // I need to "translate" the reservation because some fields are numbers and i need the string meaning
        const reservationTranslated = {...reservation};
        reservationTranslated.carCategory = translationArrays.carCategoryArray[parseInt(reservation.carCategory)];
        reservationTranslated.driverAge = translationArrays.driverAgeArray[parseInt(reservation.driverAge)];
        reservationTranslated.kmPerDay = translationArrays.kmPerDayArray[parseInt(reservation.kmPerDay)];

        reservationTranslated.user = user;
        if (utility.checkReservationData(reservationTranslated))
            reservationDao.createReservation(reservationTranslated)
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
