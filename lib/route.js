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
    .get(isAuthenticated, (req, res) => {
         res.statusCode = 200;
         res.json({user: "user"});
    })
    .post((req, res) => {
        let email = req.user.email;
        let psw = req.user.psw;
        userModule.create(email, psw, (err, user) {
            if (err) {
                res.send(err);
            }
            res.json({user: user});
        });
    });

route.route('/rooms/*')
    .get((req, res) => {
        // Get (all/specific) active rooms
    })
    .post((req, res) => {
        // Create a new room
    });

module.exports = route;
