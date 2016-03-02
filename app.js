'use strict';
let express = require('express');
let app = express();
let route = require('./lib/route');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let redis = require('redis');
let redisClient = redis.createClient();
let session = require('express-session');
let redisStore = require('connect-redis')(session);

let http = require('http').Server(app);
let io = require('socket.io')(http);

let roomFactory = require('./lib/room-factory');

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
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessOpt.cookies.secure = true;
}

app.use(session(sessOpt));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/*
 * REST routes
 */
app.post('/register', registerHandler);
app.post('/login', loginHandler);
app.get('/logout', restAuth, logoutHandler);

/*
 * WebSocket connection
 */
io.of('/lobby').use(socketAuth);
io.of('/lobby').on('connect', logHandle, function (socket) {
    let handshake = socket.hs,
        socketId = socket.id,
        socket.room = null;
    socket.on('newRoom', createARoom);
    socket.on('joinRoom', joinRoom);
    socket.on('invite', invitePlayer);
    socket.on('invited', processInvitation);
    socket.on('start', startTheGame);
    socket.on('gameover', endGame);
    socket.on('move', move);
    socket.on('quit', quit);
    socket.on('disconnected', disconnect);
    socket.on('pause', onpause);
});

server.listen(process.env.SOCKETPORT)
module.exports = app;



