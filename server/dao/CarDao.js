'use strict';

const db = require('../db');
const Car = require('../entities/Car');

exports.getCars = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM cars"
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0) //shouldn't happen unless network problems
                resolve(undefined);
            else{
                const cars = rows.map((row) => new Car(row.model, row.brand, row.category));
                resolve(cars);
            }
        });
    });
};

exports.getBrands = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT brand FROM cars"
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0) //shouldn't happen unless network problems
                resolve(undefined);
            else{
                resolve(rows); //string array
            }
        });
    });
};

exports.getCarsForCategory = function (category) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) FROM cars as c WHERE c.category = ?"
        db.get(sql, [category], (err, row) => {
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

