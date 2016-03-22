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
const RoomFactory = require('../../lib/room-factory');

describe('#onRoomJoin', function () {

    describe("#leaveRoom for IN user", function () {
        let roomId = null;
        before(function (done) {
            roomId = RoomFactory.createRoom(user.email);
            done();
        });

        it('should leave the room', function (done) {
            console.log(roomId);
            RoomFactory.leaveRoom(roomId, user.email)
            .then(res => {
                console.log("res res " + res);
                expect(res).to.equal(1);
                done();
            })
            .catch(err => {
                done(err);
            });
        });

    });

    describe('#leaveRoom for socket', function () {
        let server = null;
        let server_io = null;
        let client_io = null;
        let roomId = null;

        before(done => {
            server = require('http').Server(app);
            server_io = require('socket.io')(server).of('/lobby');
            server_io.use(function (socket, next) {
                socket.email = user.email;
                socket.leave(socket.rooms);
                next();
            });
            server_io.on('connect', function (socket) {
                return socketRouteHandler.handler(socket, server_io);
            });
            server.listen(3030);
            client_io = client_socket(socket_url, socketOptions);
            client_io.once('connect', function (socket) {
                client_io.emit('newRoom');
                client_io.once('newRoom', function (roomIdX) {
                    expect(roomIdX.room).to.be.a('string');
                    roomId = roomIdX.room;
                    console.log("room id is " + JSON.stringify(roomId));
                    done();
                });
            });
        });

        after(done => {
            server.close(function () {
                server_io.server.close();
                done();
            });
        });

        it('should leave the room', function (done) {
            client_io.emit('leaveRoom', {id: roomId});
            client_io.once('leaveRoom', function (res) {
                expect(res.status).to.equal(1);
                client_io.disconnect();
                done();
            });

        });
    });
});
