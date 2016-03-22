'use strict';
const RoomFactory = require('../lib/room-factory');

const handler = function (socket, io) {
    // TODO
    // subscribe to the channel for publishing realtime rooms and players
    console.log(`io = ${Object.keys(io.clients().sockets)}`);
    socket.emit('welcome', {msg: 'successfully connected'});
    socket.on('newRoom', createRoom.bind(socket));
    socket.on('joinRoom', joinRoom.bind(socket));
    socket.on('leaveRoom', leaveRoom.bind(socket));
    socket.on('invite', function (user) {
        console.log(`user is ${user}`)
        invite.apply(socket, [user, io]);
    });
    socket.on('disconnect', disconnectAll.bind(socket));
    socket.on('start', startTheGame.bind(socket));
    socket.on('gameover', endTheGame);
    // TODO
    // socket.on('logout');
}

function createRoom() {
    console.log('newRoom');

    if (!this.email || Object.keys(this.rooms).length > 1) {
        this.emit('newRoom', {error: 'cannot create a room.'});
    }
    else {
        let roomId = RoomFactory.createRoom(this.email);
        this.join(roomId).emit('newRoom', {room: roomId});
    }
}

function joinRoom(room) {
    if (!this.email) {
        this.emit("joinRoom", {error: "not authenticated"});
    }
    else if (!room) {
        this.emit("joinRoom", {error: "Please give a valid room id"});
    }
    else if (Object.keys(this.rooms).length > 1) {
        this.emit("joinRoom", {error: "please leave your current room at first"});
    }
    else {
        let roomId = room.id;
        RoomFactory.joinRoom(roomId, this.email)
        .then(res => {
            this.join(res).emit("joinRoom", {room: res});
        })
        .catch(err => {
            this.emit("joinRoom", {error: err.message});
        });
    }
}

function disconnectAll() {
    if (this.rooms.length > 1) {
        return leaveRoom.apply(this, this.rooms);
    }
}

function invite(invitee, io) {
    console.log(`invite io : ${Object.keys(io)},
        invitee.id = ${invitee.id},
        this.email = ${this.email}`);
    io.to(invitee.id).emit('invited', {user: this.email, id: this.id});
}

function leaveRoom(room) {
    RoomFactory.leaveRoom(room.id, this.email)
    .then(res => {
        this.emit('leaveRoom', {status: res});
    })
    .catch(reason => {
        this.emit('leaveRoom', {status: 0});
    });
}

function startTheGame() {
    this.to(this.roomId).emit('prepare');
    setTimeout(function () {
        this.to(this.roomId).emit('go');
    }, 3000);
}

function endTheGame(msg) {
    this.broadcast.to(this.roomId).emit('GameOver', msg);
}

module.exports.handler = handler;
