'use strict';
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../server');
const clearTestDB = require('../helper/clearDB');
const users = require('../fixture/user_fixture');


describe('#/restRoute', function () {
    let server = null;
    let cookie = null;

    beforeEach(function (done) {
        clearTestDB(function (err) {
            if (err !== null)
                done(err);
            else {
                server = request(app);
                done();
            }
        });
    });

    afterEach(function (done) {
        app.close();
        done();
    });

    describe('#/register', function () {
        it('should POST a new users for register', function (done) {
            server
            .post('/register')
            .send(users.newuser)
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                if (err)
                    return done(err);
                done();
            });
        });

        it('should NOT create a new user for existing users', function (done) {
            server
            .post('/register')
            .send(users.existingUser)
            .end(function (err, res) {
                expect(res.status).to.equal(401, {
                    error: "not created."
                });
                done();
            });
        });

    });

    describe('#/loginAnd#/logout', function () {

        it('should login an legitimate user', function (done) {
            server
            .post('/login')
            .send(users.existingUser)
            .end(function (err, res) {
                cookie = res.headers['set-cookie'];
                if (err) {
                    console.log(err);
                    return done(err);
                }
                expect(res.status).to.equal(200);
                done();
            })
        });

        it('should have session info stored for next login', function (done) {
            server
            .post('/login')
            .set('cookie', cookie)
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
        });

        it('should NOT login an illegal user in wrong password', function (done) {
            server
            .post('/login')
            .send(users.illegalUser)
            .end(function (err, res) {
                expect(res.status).to.equal(401, {
                    error: 'Authentication failed'
                });
                done();
            });
        });

        it('should NOT login an illegal user with nonexisting email', function (done) {
            server
            .post('/login')
            .send(users.nonexistingUser)
            .end(function (err, res) {
                expect(res.status).to.equal(401, {
                    error: 'Authentication failed'
                });
                done();
            });
        });

        it('should logout the user', function (done) {
            server
            .get('/logout')
            .set('cookie', cookie)
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
        });
    });

});
