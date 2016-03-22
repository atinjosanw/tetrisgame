const config = {

    "test": {
        PORT_BACKEND: process.env.PORT_BACKEND || 8080,
        PORT_FRONTEND: process.env.PORT_BACKEND || 3000,
        SOCKETPORT: process.env.SOCKETPORT || 3030,
        COOKIE_SECRET: process.env.COOKIE_SECRET || 'cookiesecret',
        SESS_SECRET: process.env.SESS_SECRET || '123456789ABC',
        SESS_COOKIE_KEY: "sessionID"
    },

    "development": {
       PORT_BACKEND: process.env.PORT_BACKEND || 8080,
       PORT_FRONTEND: process.env.PORT_BACKEND || 3000,
       SOCKETPORT: process.env.SOCKETPORT || 3030,
       COOKIE_SECRET: process.env.COOKIE_SECRET || 'cookiesecret',
       SESS_SECRET: process.env.SESS_SECRET || '123456789ABC',
       SESS_COOKIE_KEY: "sessionID"
   }

};

module.exports = config;

