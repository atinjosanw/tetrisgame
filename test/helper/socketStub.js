'use strict';
module.exports = SocketStub;

function SocketStub (cookie, authenticated) {
    cookie = null || cookie;
    authenticated = false || authenticated;
    this.request = {headers: {cookie: cookie}};
    this.authenticated = authenticated;
    this.err = null;
    this.disconnected = false;
};

SocketStub.prototype.disconnect = function () {
    this.disconnected = true;
};

SocketStub.prototype.error = function(str) {
    this.err = str;
};

