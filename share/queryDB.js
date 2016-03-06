'use strict';
let pg = require('pg');
const conString = require('./constants').PG_CONNECTION;

const findUser = function (query, callback) {
    const email = query.email;
    const password = query.password;
    // TODO
}


module.exports.findUser = findUser;

