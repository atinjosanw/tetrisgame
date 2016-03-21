'use strict';
const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

const server = require('http').Server(app);
const io = require('socket.io')(server);

const restRoute = require('./routes/route');
const socketRoute = require('./routes/socketRoute');

const auth = require('./middleware/auth');
const cookieParser = require('./middleware/cookiePsr');
// const logHandle = require('./middleware/logHandle');

// const gameFactory = require('./share/game-factory');
const redisOpt = require('./share/redis-client').redisOpt;
const config = require('./config');

const sessOpt = {
    resave: true,
    saveUninitialized: true,
    secret: config.SESS_SECRET,
    name: config.SESS_COOKIE_KEY,
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    store: new redisStore(redisOpt)
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessOpt.cookies.secure = true;
}

app.use(cookieParser);
app.use(session(sessOpt));
app.use(logger('tiny'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(auth.restAuth);

//REST routes
app.use(restRoute);

// WebSocket connection
let nsp = io.of('/lobby');
nsp.use(auth.socketAuth);
nsp.on('connect', function (socket) {
    return socketRoute.handler(socket, nsp);
});

server.listen(config.SOCKETPORT);
module.exports = app;
// module.exports.io = io;
module.exports.cookieParser = cookieParser;



