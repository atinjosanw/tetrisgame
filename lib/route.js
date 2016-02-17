'use strict';

let express = require('express');
let route = express.Router();
let app = express();
let userModule = require('./userModule');
let databaseErrorHandler = require('./databaseErrorHandler');


function isAuthenticated(req, res, next) {
    let email = req.session.key;
    if (!email) {
        console.error("the user is not authenticated yet.");
        res.statusCode = 401;
        next(res.statusCode);
    }
    next();
}

route.use((req, res, next) => {
    console.log("A request is received.");
    next();
});

route.all('/rooms/*', isAuthenticated);

route.post('/register', (req, res) => {
    const email = req.body.email;
    const psw = req.body.password;
    console.log(req.session);
    if (req.session.key === email) {
        console.log("exist in cache.");
        res.status(401).json({error: "user exists."});
        return;
    }
    userModule.create(email, psw)
    .then(user => {
        req.session.key = user.user_email;
        req.session.user_id = user.user_id;
        console.log("created a new account");
        req.session.save();
        res.status(201).json(user);
    })
    .catch(err => {
        console.log(err.stack);
        res.status(401).json({error: "not created."});
    });

});

route.route('/')
.get((req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err)
                console.log(err);
            else {
                res.json({msg: "Logout successfully"});
            }
        });
        console.log(req.session);
    }
    else {
        throw new Error("Error when logout");
        res.json({msg: "You are not login yet."});
    }
})
.post((req, res) => {
    const email = req.body.email;
    const psw = req.body.password;
    console.log(`email is ${email}, psw is ${psw}`);
    if (req.session.key === email) {
        console.log("cached.");
        res.status(201).json({user_id: req.session.id, user_email: req.session.key});
    }
    else {
        userModule.find(email, psw)
        .then(user => {
            req.session.key = user.user_email;
            req.session.user_id = user.user_id;
            console.log("look to database.");
            req.session.save();
            res.status(201).json(user);
        })
        .catch(err => {
            console.log("err caught");
            res.status(401).json({error: "not found."});
        });
    }
});

route.get('/rooms', (req, res) => {

});

route.route('/rooms/:room_id')
.get((req, res) => {
        // Get (all/specific) active rooms
    })
.post((req, res) => {
        // Create a new room
    });

module.exports = route;
