'use strict';
let chai = require('chai');
// let http = require('http');
let expect = chai.expect;
let querydb = require('../../share/queryDB');
let initdb = require('../helper/initdb');
let users = require('../fixture/user_fixture');
// let removeUser = require('./helper/initdb').removeUser;

describe('db', function () {
    var db = null;
    beforeEach (function (done) {
        initdb(function (err, dbs) {
            if (err !== null) {
                console.log(err);
                done(err);
            }
            db = dbs;
            done();
        });
    });

    describe("#findUser()", function () {

        function finduserX (email) {
            return querydb.findUser(email, db);
        };

        it('should be able to find the user if user is in database', function (done) {
            let finduser = finduserX({email: users.existingUser.email});

            return finduser.then(function (user) {
                expect(finduser).to.be.a('promise');
                expect(user).to.have.all.keys('user_email', 'user_password');
                expect(user).to.have.property('user_email').and.equal(users.existingUser.email);
                done();
            });
        });

        it('should report error if the user is not in database', function (done) {
            let finduser = finduserX({email: users.nonexistingUser.email});

            return finduser.catch(error => {
                expect(error).to.be.an('error');
                done();
            });
        });
    });

    describe('#insertUser()', function () {
        function insertuserX (user) {
            return querydb.insertUser(user, db);
        };

        it('should not insert an existing user', function (done) {
            let user = users.illegalUser;
            let insertuser = insertuserX(user, db);
            return insertuser.catch(error => {
                expect(error).to.be.an('error');
                done();
            })
        });

        it('should insert a new user', function (done) {
            let user = users.newuser;
            let insertuser = insertuserX(user, db);
            let numRecord_before = 0;

            return insertuser.then(user => {
                expect(user).to.have.all.keys('user_email', 'user_password');
                done();
            });
        });
    });


    describe('#deleteUser()', function (done) {
        function deleteUserX(user) {
            return querydb.deleteUser(user, db);
        }

        it('should not delete a user not in database', function (done){
            let userNotExists = users.nonexistingUser;
            return deleteUserX(userNotExists)
                .then(count => {
                    expect(count).to.equal(0);
                    done();
                });
        });

        it('should not delete a user with wrong password', function (done) {
            let userWrong = users.illegalUser;
            return deleteUserX(userWrong)
            .then(count => {
                expect(count).to.equal(0);
                done();
            });
        });

        it('should delete an existing user with correct password', function (done) {
            let userExists = users.existingUser;
            return deleteUserX(userExists).then(count => {
                expect(count).to.equal(1);
                done();
            });
        });
    });

});
