const app = require('express')();
const cn = require('./db-config')[app.get('env')];
console.log(cn);
const pgp = require('pg-promise')({});
const db = pgp(cn);

module.exports = db;
