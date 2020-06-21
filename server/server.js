'use strict'

const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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

//GET /availableCars
app.get('/api/availableCars', (req, res) => {
    reservationDao.getAvailableCars()
        .then((availableCars) => {
            res.json(availableCars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});

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
