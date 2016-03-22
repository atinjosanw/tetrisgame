'use strict';
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../server');
const users = require('../fixture/user_fixture');
const SocketStub = require('../helper/socketStub');

const socketAuth = require('../../middleware/auth').socketAuth;
const config = require('../../config');
const cookieParser = require('cookie-parser')(config.COOKIE_SECRET);
const clearTestDB = require('../helper/clearDB');

describe('test websocket connection', function () {
    let server = null;
    before(function (done) {
        clearTestDB(function (err) {
            if (err !== null)
                done(err);
            else {
                server = request(app);
                done();
            }
        });
    });
    after(function (done) {
        app.close();
        done();
    });

    describe('#socketAuth', function () {
        let socketStub = null;
        let cookie = null;
        before (function (done) {
            server
            .post('/login')
            .send(users.existingUser)
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                if (err !== null) {
                    console.log("before all error: " + err);
                    return done(err);
                }
                cookie = res.header['set-cookie'].pop();
                done();
            });
        });

        it('should not connect an unauthenticated user', function (done) {
            let un_socket = new SocketStub();
            socketAuth(un_socket, function (err) {
                expect(err).to.be.an('error');
                expect(un_socket.email).to.be.an('undefined');
                expect(un_socket.authenticated).to.not.be.true;
                expect(un_socket.disconnected).to.be.true;
                done();
            });
        });

        it('should connect an authenticated user', function (done) {
            let socket = new SocketStub(cookie);
            socketAuth(socket, function (err) {
                if (err) {
                    console.log(err);
                }
                expect(socket.sessionID).to.be.ok;
                expect(socket.email).to.equal(users.existingUser.email);
                expect(socket.authenticated).to.be.true;
                expect(socket.disconnected).to.be.false;
                done();
            });
        });
    });

});
