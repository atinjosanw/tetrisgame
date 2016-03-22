'use strict';
const exec = require('child_process').exec;
const cn = require('../../share/db-config')['test'];
const pgp = require('pg-promise')({});


const initdb = function (next) {
    exec('psql -d tetris -f ./test/helper/dropdb.sql', function (err, stdout, stderr) {
        // console.log(`stdout: ${stdout}`);
        if (err !== null)
            console.log(`error: ${err}`);
        exec('psql -d tetris_testdb -f ./test/helper/tetris_testdb.sql', function (err, stdout, stderr) {
            if (err !== null) {
                console.log(`error: ${err}`);
            }
            // console.log(`stdout: ${stdout}`);
            const db = pgp(cn);
            // console.log(`db: ${db.query}`);
            next(err, db);
        });
    });
};

// const removeUser = function (user) {
//     exec('psql -d tetris_testdb ./test/helper/remove.sql', function (err, stdout, stderr) {
//         console.log(`stdout: ${stdout}`);
//     });
// }

module.exports = initdb;
