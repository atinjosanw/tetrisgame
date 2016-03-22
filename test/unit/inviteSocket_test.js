'use strict';
const chai = require('chai');
const expect = chai.expect;
const users = require('../fixture/user_fixture');

const ServerIOFac = require('../helper/serverIO_helper');
const ClientIO = require('../helper/clientIO_helper');

describe('#inviteAnotherPlayer', function () {
    let client_io1 = null;
    let client_io2 = null;
    let socketIds = null;
    let ServerIO = ServerIOFac.getServerIO();
    let id1, id2;

    describe('#invite', function () {
        before(done => {
            ServerIO.run( () => {
                client_io1 = ClientIO.get();
                client_io2 = ClientIO.get();
                client_io2.once('connect', () => {
                    socketIds = Object.keys(ServerIO.getClients());
                    id2 = client_io2.nsp+'#'+client_io2.id;
                    id1 = socketIds.filter(id => (id !== id2))[0];
                    done();
                });
            });
        });
        after(done => {
            client_io2.disconnect();
            ServerIO.stop(done);
        });

        it('should be able to invite another player', done => {
            client_io2.emit('invite', {id: id1});
            client_io1.once('invited', user => {
                expect(user).to.have.all.keys('user', 'id');
                client_io1.disconnect();
                done();
            });
        });
    });
});

