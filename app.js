'use strict';
let express = require('express');
let app = express();
let logger = require('morgan');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let redisStore = require('connect-redis')(session);

let auth = require('./middleware/auth');
let http = require('http').Server(app);
let io = require('socket.io')(http);

let gameFactory = require('./lib/game-factory');
let redisSessionClient = require('./share/redis-client').redisSessionClient;
let restRoute = require('./lib/route');
let socketRoute = require('./lib/socketRoute');

let constant = require('./share/constants');


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



