'use strict';

const db = require('../db');
const User = require('../entities/User');
const bcrypt = require('bcrypt');

exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?"
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err);
            else if (row) {
                const user = new User(row.id, row.username, row.hash, row.name);
                resolve(user);
            }
            else
                resolve(undefined);
        });
    });
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE id = ?"
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row) {
                const user = new User(row.id, row.username, row.hash, row.name);
                resolve(user);
            }
            else
                resolve(undefined);
        });
    });
};

exports.checkPassword = function(user, password){
    console.log("Hash of: " + password);
    let hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    console.log("DONE");

    return bcrypt.compareSync(password, user.hash);
}
