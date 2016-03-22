'use strict';
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../server');
const io_client = require('socket.io-client');
const config = require('../../config');
const socketURL = 'http://localhost:' + config.SOCKETPORT + '/lobby';
const socketOptions = {
    transports: ['websocket'],
    'forceNew': true
};


describe('test websocket connection', function () {
    let socket_client = null;

    after(function (done) {
        app.close();
        done();
    });

    describe('#socketAuth', function () {
        afterEach(function (done) {
            socket_client.disconnect();
            done();
        })

        it('should not connect an unauthenticated user', function (done) {
            socket_client = io_client.connect(socketURL, socketOptions);

            socket_client.on('error', function (err) {
                expect(err).to.equal('unauthenticated');
            });
            socket_client.on('disconnect', function () {
                expect(socket_client.disconnected).to.be.true;
            });
            done();
        });
    });
});
