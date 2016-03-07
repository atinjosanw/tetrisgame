const COOKIE_SECRET = 'cookiesecret';
const SESS_SECRET = '123456789ABC';
const PG_CONNECTION = {
    host: 'localhost',
    port: 5432,
    database: tetris,
    user: 'tetris',
    password: 'tetris'
};

module.exports.COOKIE_SECRET = COOKIE_SECRET;
module.exports.SESS_SECRET = SESS_SECRET;
module.exports.PG_CONNECTION = PG_CONNECTION;
