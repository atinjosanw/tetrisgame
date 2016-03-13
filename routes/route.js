'use strict';

const express = require('express');
const route = express.Router();
const queryDB = require('../share/queryDB');
const userDB = require('../share/pg-db');

route.post('/register', registerHandler);
route.post('/login', loginHandler);
route.get('/logout', logoutHandler);

function registerHandler (req, res) {
    const email = req.body.email;
    const psw = req.body.password;
    queryDB.insertUser({email: email, password: psw}, userDB)
    .then(user => {
        req.session.email = user.user_email;
        req.session.password = user.user_password;
        console.log("created a new account");
        req.session.save();
        res.status(200).json(user);
    })
    .catch(err => {
        console.log(err.stack);
        res.status(401).json({error: "not created."});
    });
}

function loginHandler (req, res) {
    if (req.session && req.session.email) {
        res.status(200).json({msg: 'login successfully'});
    }
    else {
        const email = req.body.email;
        const password = req.body.password;
        queryDB.findUser({email: email, password: password}, userDB)
        .then(user => {
            if (user && user.user_password == password) {
                req.session.email = user.user_email;
                req.session.password = user.user_password;
                res.status(200).json({msg: 'login successfully'});
            }
            else {
                res.status(401).json({error: 'Wrong password'});
            }
        })
        .catch(err => {
            console.log(`${err}`);
            res.status(401).json({error: 'Authentication failed'});
        });
    }
}

function logoutHandler (req, res) {
    req.session.destroy( function (err) {
        if (err !== null) {
            res.status(401).json({error: 'The user is not authenticated.'});
        }
        else {
            res.status(200).json({msg: "logout successfully"});
        }
    });
}

module.exports = route;
