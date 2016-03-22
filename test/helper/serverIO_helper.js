'use strict';
const users = require('../fixture/user_fixture');
const app = require('express')();
const config = require('../../config')["test"];
const socketRouteHandler = require('../../routes/socketRoute');
const SERVER = require('http').Server(app);

function SvrIO(userList) {

    let self = {
        server: SERVER,
        port: config.SOCKETPORT,
        sio: null,
        socketRouteHandler: socketRouteHandler,
        userList: userList
    };

    this.makeInstance = function () {
        self.sio = null;
        self.sio = require('socket.io')(self.server).of('/lobby');
        // console.log('make instance ' + self.userList);
        self.sio.use((socket, next) => {
            socket.email = self.userList.shift().email;
            next();
        });
        self.sio.on('connect', function(socket){
            return self.socketRouteHandler.handler(socket, self.sio);
        });
    };

    this.run = function (callback) {
        this.makeInstance();
        self.server.listen(self.port, callback);
    };

    this.stop = function (callback) {
        self.sio.server.close();
        callback();
    };

    this.getClients = function () {
        let clients = self.sio.clients().sockets;
        return clients;
    };

    this.getList = function () {
        return self.userList;
    }
};

const ServerIOFactory = (function () {
    return {
        getServerIO: function () {
            let list = [users.existingUser, users.existingUser2];
            console.log("getServerIO " + list);
            return new SvrIO(list);
        }
    };
})();

module.exports = ServerIOFactory;


