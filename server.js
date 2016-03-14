'use strict';
let port_backend = require('./config').PORT_BACKEND;
let app = require('./app');

app.set('port', port_backend);

let server = app.listen(app.get('port'), function() {
    console.log("Server is listening on port " + server.address().port + ' ... ');
});

module.exports = server;
