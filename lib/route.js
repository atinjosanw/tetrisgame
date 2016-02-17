'use strict';

let express = require('express');
let route = express.Router();
let app = express();
let userModule = require('./userModule');


function isAuthenticated(req, res, next) {
    if (req.user === undefined || !req.user.authenticated) {
        res.statusCode = 401;
        console.log("error");
        return next(res.statusCode);
    }
    next();
}

route.use((req, res, next) => {
    console.log("A request is received.");
    next();
});

route.all('/rooms/*', isAuthenticated);

route.route('/users/*')
    .get((req, res) => {
        let email = req.param('email');
        let psw = req.param('psw');
        userModule.find(email, psw)
            .then(res => {res.json(user);})
            .catch(err => {res.send(err);});
    })
    .post((req, res) => {
        let email = req.param('email');
        let psw = req.param('psw');
        userModule.create(email, psw)
            .then(user => {res.json(user);})
            .catch(err => {res.send(err);});
    });

route.route('/rooms/*')
    .get((req, res) => {
        // Get (all/specific) active rooms
    })
    .post((req, res) => {
        // Create a new room
    });

module.exports = route;
