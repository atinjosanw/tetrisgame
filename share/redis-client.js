'use strict';
const redis = require('redis');
const redisSessionClient = redis.createClient();

const redisOpt = {
    db: 0,
    host: 'localhost',
    port: '6379',
    client: redisSessionClient,
    ttl: 500
};

module.exports.redisClient = redisSessionClient;
module.exports.redisOpt = redisOpt;
