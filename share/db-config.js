const dbConfig = {
    "development": {
        host: 'localhost',
        port: 5432,
        database: "tetris",
        user: 'tetris',
        password: 'tetris'
        },

    "test": {
        host: 'localhost',
        port: 5432,
        database: "tetris_testdb",
        user: 'tetris_testdb',
        password: 'tetris_testdb'
    }
}

module.exports = dbConfig;

