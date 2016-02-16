'use strict';
let express = require('express');
let app = express();
let path = require('path');
let route = require('./lib/route');
let bodyParser = require('body-parser');
let redis = require('redis');
let redisClient = redis.createClient();
let session = require('express-session');
let RedisStore = require('connect-redis')(session);

app.use(session({
    store: new RedisStore({
        host: 'localhost',
        port: 6379,
        db: 2,
        client: redisClient
    }),
    resave: false,
    saveUninitialized: true,
    secret: '123456789ABC',
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use('/', route);

module.exports = app;


