'use strict';
const port_backend = require('./config')[process.env].PORT_BACKEND;
const app = require('./app');

app.set('port', port_backend);

const server = app.listen(app.get('port'), function() {
    console.log("Server is listening on port " + server.address().port + ' ... ');
});

module.exports = server;
