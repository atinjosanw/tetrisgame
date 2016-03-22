const config = require('../../config')["test"];
const client_socket = require('socket.io-client');
const socket_url = `http://localhost:${config.SOCKETPORT}/lobby`;
const socketOptions = {
    transports: ['websocket'],
    'forceNew': true
};

const ClientIO = {
    get: function() {
        return client_socket.connect(socket_url, socketOptions);
    }
};

module.exports = ClientIO;

