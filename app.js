'use strict';
let express = require('express');
let app = express();
let path = require('path');
let route = require('./lib/route');
let bodyParser = require('body-parser');
let redis = require('redis');
let redisClient = redis.createClient();
let session = require('express-session');
let redisStore = require('connect-redis')(session);

let redisOpt = {
    db: 0,
    host: 'localhost',
    port: '6379',
    client: redisClient,
    ttl: 500
};

let sessOpt = {
    resave: false,
    saveUninitialized: true,
    secret: '123456789ABC',
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    store: new redisStore(redisOpt)
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessOpt.cookies.secure = true;
}
app.use(session(sessOpt));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', route);

module.exports = app;


