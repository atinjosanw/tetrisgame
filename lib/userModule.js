'use strict';
let db = require('./db');

let userModule = {};
userModule.create = function (email, password) {
    let queryString = `INSERT INTO users (user_email, user_password) VALUES ('${email}', '${password}')`;
    return db(queryString)
        .then(function (res) {
            console.log("created.");
            return userModule.find(email, password);
        }, function (err) {
            throw err;
        });
};

userModule.find = function (email, password) {
    let queryString = `SELECT user_id, user_email FROM users WHERE user_email='${email}' AND user_password='${password}'`;
    return db(queryString)
        .then(res => {
            if (res.rowCount === 0) {
                throw new Error('not found');
            }
            console.log("found record.");
            console.log(res.rows[0]);
            return Promise.resolve(res.rows[0]);
        }, err => {throw err;})
        .catch(err => {console.log("err found in find."); throw err;});
}

module.exports = userModule;

