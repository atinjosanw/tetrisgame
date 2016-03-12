'use strict';
const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

const http = require('http').Server(app);
const io = require('socket.io')(http);

const restRoute = require('./routes/route');
const socketRoute = require('./routes/socketRoute');

const auth = require('./middleware/auth');
const logHandle = require('./middleware/logHandle');

const gameFactory = require('./share/game-factory');
const redisSessionClient = require('./share/redis-client').redisSessionClient;
const constant = require('./share/constants');


let redisOpt = {
    db: 0,
    host: 'localhost',
    port: '6379',
    client: redisSessionClient,
    ttl: 500
};

let sessOpt = {
    resave: false,
    saveUninitialized: true,
    secret: constant.SESS_SECRET,
    name: "sessionID",
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    store: new redisStore(redisOpt)
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessOpt.cookies.secure = true;
}

app.use(cookieParser(constant.COOKIE_SECRET));
app.use(session(sessOpt));
app.use(logger('tiny'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(auth.restAuth);
/*
 * REST routes
 */
app.route('/', restRoute);
// app.post('/register', registerHandler);
// app.post('/login', loginHandler);
// app.get('/logout', logoutHandler);

/*
 * WebSocket connection
 */
io.of('/lobby').use(auth.socketAuth);
io.of('/lobby').on('connect', logHandle, socketRoute);

server.listen(process.env.SOCKETPORT)
module.exports = app;



