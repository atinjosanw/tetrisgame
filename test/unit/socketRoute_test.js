'use strict';
const chai = require('chai');
const expect = chai.expect;
const user = require('../fixture/user_fixture').existingUser;
const user2 = require('../fixture/user_fixture').newuser;
const socketRouteHandler = require('../../routes/socketRoute');

const app = require('express')();
const client_socket = require('socket.io-client');
const socket_url = 'http://localhost:3030/lobby';
const socketOptions = {
    transports: ['websocket'],
    'forceNew': true
};
const redisRoom = require('../../share/redis-client').redisRoom;

describe('#socketRoute', function () {
    let client_io = null;
    let server_io = null;
    let server = null;

    describe('#onconnected', function () {
        before(function (done) {
            server = require('http').Server(app);
            server_io = require('socket.io')(server);
            server_io.of('/lobby').use(function (socket, next) {
                if (socket.email) {
                    delete socket.email;
                }
                if (Object.keys(socket.rooms).length > 1) {
                    socket.leave(socket.rooms);
                }
                next();
            });
            server_io.of('/lobby').on('connect', function (socket) {
                return socketRouteHandler.handler(socket, server_io);
            });
            server.listen(3030, function () {done();});
        });

        after(function (done) {
            server_io.httpServer.close(done);
        });

        it('should receive a welcome message', function (done) {
            client_io = client_socket(socket_url, socketOptions);
            client_io.once('connect', function () {
                client_io.once('welcome', function (msg) {
                    expect(msg.msg).to.equal('successfully connected');
                    client_io.disconnect();
                    done();
                });
            });
        });

        it('should NOT response a new room', function (done) {
            client_io = client_socket(socket_url, socketOptions);

            client_io.once('connect', function (socket) {
                client_io.emit('newRoom');
                client_io.once('newRoom', function(room) {
                    expect(room).to.have.property('error');
                    expect(room.error).to.equal('cannot create a room.');
                    client_io.disconnect();
                    done();
                });
            });
        });

    });

    describe('#createRoom for authenticated user', function () {
        before(function (done) {
            server = require('http').Server(app);
            server_io = require('socket.io')(server).of('/lobby');
            server_io.use(function (socket, next) {
                socket.email = user.email;
                if (Object.keys(socket.rooms).length > 0) {
                    for (let room in Object.keys(socket.rooms)) {
                        socket.leave(room);
                    }
                }
                next();
            });
            server_io.on('connect', function (socket) {
                return socketRouteHandler.handler(socket, server_io);
            });
            server.listen(3030, function () {done();});
        });

        after(function (done) {
            server.close(function () {
                server_io.server.close();
                done();
            });
        });

        it('should create a new room', function (done) {
            client_io = client_socket(socket_url, socketOptions);

            client_io.once('connect', function (socket) {
                client_io.emit('newRoom');
                client_io.once('newRoom', function(room) {
                    try {
                        expect(room).to.have.property('room');
                        client_io.disconnect();
                        done();
                    }
                    catch (err) {
                        client_io.disconnect(done);
                        done(err);
                    }
                });
            });
        });
    });


    describe('#createRoom if the user has a room', function() {
        before(function (done) {
            server = require('http').Server(app);
            server_io = require('socket.io')(server).of('/lobby');
            server_io.use(function (socket, next) {
                socket.email = user.email;
                socket.join('aroom');
                next();
            });
            server_io.on('connect', function (socket) {
                return socketRouteHandler.handler(socket, server_io);
            });
            server.listen(3030, function () {done();});
        });

        after(function (done) {
            server.close(function () {
                server_io.server.close();
                done();
            });
        });

        it('should not create a new room if the user has a room', function (done) {
            client_io = client_socket(socket_url, socketOptions);

            client_io.once('connect', function (socket) {
                client_io.emit('newRoom');
                client_io.once('newRoom', function(room) {
                    expect(room).to.have.property('error');
                    expect(room.error).to.equal('cannot create a room.');
                    client_io.disconnect();
                    done();
                });
            });
        });

    });

    describe('onRoomCreate', function () {
        before (function (done) {
            server = require('http').Server(app);
            server_io = require('socket.io')(server).of('/lobby');
            server_io.use(function (socket, next) {
                socket.email = user.email;
                socket.join('aroom');
                next();
            });
            server_io.on('connect', function (socket) {
                return socketRouteHandler.handler(socket, server_io);
            });
            server.listen(3030, function () {done();});
        });
        after (function (done) {
            server.close(function () {
                server_io.server.close();
                done();
            });
        });

        it('should response a new room', function (done) {
            client_io = client_socket(socket_url, socketOptions);

            client_io.once('connect', function (socket) {
                client_io.emit('newRoom');
                client_io.once('newRoom', function(room) {
                    expect(room).to.have.property('error');
                    client_io.disconnect();
                    done();
                });
            });
        });
    });

});
