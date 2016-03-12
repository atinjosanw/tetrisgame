const development = {
    host: 'localhost',
    port: 5432,
    database: "tetris",
    user: 'tetris',
    password: 'tetris'
};

const test = {
    host: 'localhost',
    port: 5432,
    database: "tetris_testdb",
    user: 'tetris_testdb',
    password: 'tetris_testdb'
};

module.exports.development = development;
module.exports.test = test;
