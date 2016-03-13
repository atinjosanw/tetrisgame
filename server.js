'use strict';
let app = require('./app');

app.set('port', process.env.PORT_BACKEND || 8080);

let server = app.listen(app.get('port'), function() {
    console.log("Server is listening on port " + server.address().port + ' ... ');
});

module.exports = server;
