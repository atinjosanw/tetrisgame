'use strict';
const crypto = require('crypto');
const redisRoom = require('../share/redis-client').redisRoom;
const RoomFactory = (function () {

    return {
        createRoom: function (email) {
            let roomId = crypto.createHash('md5')
            .update(email + new Date().toString()).digest('hex');
            redisRoom.sadd('room:'+roomId+':player', email, function (err, res) {
                if (err)
                    roomId = false;
                console.log(res);
            });
            return 'room:'+roomId+':player';
        },

        joinRoom: function (room, email) {
            return new Promise(function (resolve, reject) {
                redisRoom.exists(room, function (err, res) {
                    if (err) {
                        console.log(err);
                        return reject(new Error(err));
                    }
                    if (!res) {
                        return reject(new Error('no such a room'));
                    }

                    redisRoom.scard(room, function (err, res) {
                        if (res >= 2) {
                            reject(new Error('the room is full'));
                        }
                        else {
                            redisRoom.sadd(room, email, function (err, res) {
                                if (res) {
                                    resolve(room);
                                }
                                else
                                    reject(new Error('You are in it.'));
                            });
                        }
                    });
                });
                setTimeout(() => {
                    reject(new Error('Internal Server Error.'));
                }, 2000);
            });
        },

        leaveRoom: function (roomId, email) {
            return new Promise(function (resolve, reject) {
                redisRoom.srem(roomId, email, function (err, res) {
                    if (err)
                        console.log(err);
                    console.log("leaveroom " + res);
                    return resolve(res);
                });
                setTimeout(() => {
                    reject(new Error('Internal Server Error.'));
                }, 2000);
            });
        }
    }
})();

module.exports = RoomFactory;
