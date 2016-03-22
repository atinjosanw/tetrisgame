'use strict';
const exec = require('child_process').exec;

const clearDb = function (next) {
    exec('psql -d tetris_testdb -f ./test/helper/clearTable.sql', function (err, stdout, stderr) {
        if (err !== null)
            console.log(`error: ${err}`);
        next(err);
    });
};

module.exports = clearDb;
