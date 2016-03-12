const cn = require('./db-config').development;
const pgp = require('pg-promise')({});
const db = pgp(cn);

module.exports = db;
