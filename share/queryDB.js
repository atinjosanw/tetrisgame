'use strict';
const conString = require('./constants').PG_CONNECTION;
let pgp = require('pg-promise')();
const db = pgp(conString);


const findUser = function (query) {
    return
    Promise
    .resolve(db.one("SELECT * FROM users WHERE user_email=${email~}", query))
    .then(user => {
            return user;
    })
    .catch(error => {
        throw new Error(error);
    });
};

const insertUser = function (query) {
    return Promise
    .resolve(db.one("INSERT INTO users(user_email, user_password)" +
                    "VALUES (${email~}, ${password~})", query)
    .then(user => {
        return user;
    })
    .catch(error => {
        throw new Error(error);
    });
}


module.exports.findUser = findUser;
module.exports.insertUser = insertUser;

