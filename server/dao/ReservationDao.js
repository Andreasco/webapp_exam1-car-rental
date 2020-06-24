'use strict';

const db = require('../db');
const Reservation = require('../entities/Reservation');

exports.getReservations = function (user) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT r.id, r.startingDay, r.endingDay, r.carCategory, r.driverAge, r.kmPerDay, r.extraDrivers, r.extraInsurance, r.price, u.name, u.username FROM reservations as r, users as u WHERE r.user = u.id AND r.user = ?"
        db.all(sql, [user], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0) { //shouldn't happen unless network problems
                resolve([]);
            }
            else{
                const reservations = rows.map((row) => new Reservation(row.id, row.startingDay, row.endingDay,
                    row.carCategory, row.driverAge, row.kmPerDay, row.extraDrivers, row.extraInsurance, row.price, row.username));
                resolve(reservations);
            }
        });
    });
};

exports.createReservation = function(reservation) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO reservations(startingDay, endingDay, carCategory, driverAge, kmPerDay, extraDrivers, extraInsurance, price, user) VALUES(?,?,?,?,?,?,?,?,?)';
        db.run(sql, [reservation.startingDay, reservation.endingDay, reservation.carCategory, reservation.driverAge, reservation.kmPerDay, reservation.extraDriver, reservation.extraInsurance, reservation.price, reservation.user], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
}

exports.deleteReservation = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM reservations WHERE id = ?';
        db.run(sql, [id], (err) => {
            if(err)
                reject(err);
            else
                resolve(null);
        })
    });
}

exports.getNonValidCars = function (reservation) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) FROM reservations as r WHERE r.carCategory = ? AND r.startingDay < ? OR r.endingDay > ?"
        db.get(sql, [reservation.carCategory, reservation.endingDay, reservation.startingDay], (err, row) => {
            if (err)
                reject(err);
            else if (row) {
                resolve(row["COUNT(*)"]);
            }
            else{
                resolve(undefined);
            }
        });
    });
};
