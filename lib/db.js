'use strict';
let pg = require('pg');
const conString = 'postgres://tetris:tetris@localhost:5432/tetris';

let pgQuery = function (query) {
    return new Promise(function (resolve, reject) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                console.error('error fetching client from pool');
                reject(err);
            }
            else {
                client.query(query, (err, res) => {
                    done();
                    if (err) {
                        console.error('error running query');
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            }

        });
    });
}


module.exports = pgQuery;

