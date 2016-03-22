'use strict';
const chai = require('chai');
const expect = chai.expect;
const user = require('../fixture/user_fixture').existingUser;
const user2 = require('../fixture/user_fixture').newuser;
const ServerIOFac = require('../helper/serverIO_helper');
const ClientIO = require('../helper/clientIO_helper');
const redisRoom = require('../../share/redis-client').redisRoom;

describe('#onRoomJoin', function () {
    let serverIO = null;
    let client_io = null;
    // beforeEach (function (done) {
    //     serverIO = ServerIOFac.getServerIO();
    //     console.log("beforeEach " + JSON.stringify(serverIO.getList()));
    //     serverIO.run(done);
    // });

    afterEach(function (done) {
        serverIO.stop( function () {
            serverIO = null;
            done();
        });
    });

    describe("#joinRoom for IN user", function () {
        before( function (done) {
            redisRoom.sadd('aroom', user.email, function (err, res){
                if (err)
                    done(err);
                serverIO = ServerIOFac.getServerIO();
                serverIO.run(done);
            });
        });

        after(function (done) {
            redisRoom.del("aroom", function (err, res) {
                if (err)
                    done(err);
                done();
            });
        });

        it('should NOT join a room if it is already in the room', function (done) {
            client_io = ClientIO.get();
            client_io.once('connect', function () {
                client_io.emit('joinRoom', {id: "aroom"});
                client_io.once('joinRoom', function(room) {
                    expect(room).to.have.property('error');
                    expect(room.error).to.equal('You are in it.');
                    client_io.disconnect();
                    done();
                });
            });
        });

    });

    describe("#joinRoom for occupied user", function () {

        before(function (done) {
            serverIO = ServerIOFac.getServerIO();
            serverIO.run(function () {
                try {
                    client_io = ClientIO.get();
                    client_io.once('connect',function () {
                        client_io.emit('newRoom');
                        done();
                    });
                }
                catch (err) {
                    done(err);
                }
            });

        });

        it('should NOT join a room if it is in another room', function (done) {
            client_io.emit('joinRoom', {id: 'broom'});
            client_io.once('joinRoom', function (room) {
                expect(room).to.have.property('error');
                expect(room.error).to.equal("please leave your current room at first");
                client_io.disconnect();
                done();
            })
        });
    });

    describe('#joinRoom for an available room', function () {
        let room = null;
        before (function (done) {
            serverIO = ServerIOFac.getServerIO();
            serverIO.run(function () {
                client_io = ClientIO.get();
                client_io.once('connect', () => {
                    client_io.emit('newRoom');
                    client_io.once('newRoom', aroom => {
                        try {
                            room = aroom.room;
                            done();
                        }
                        catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });

        after (function (done) {
            client_io.disconnect();
            done();
        });

        it('should join a room is not full', function (done) {
            let client_io2 = ClientIO.get();

            client_io2.once('connect', function () {
                client_io2.emit('joinRoom', {id: room});
                client_io2.once('joinRoom', function(room) {
                    expect(room).to.have.property('room');
                    client_io2.disconnect();
                    done();
                });
            });
        });
    });
});

