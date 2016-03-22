'use strict';
const config = require('../config')[process.env];
const cookieParser = require('cookie-parser')(config.SESS_SECRET);
module.exports = cookieParser;
