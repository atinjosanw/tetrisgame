'use strict';
const config = require('../config');
const cookieParser = require('cookie-parser')(config.SESS_SECRET);
module.exports = cookieParser;
