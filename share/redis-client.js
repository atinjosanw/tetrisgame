'use strict';
const redis = require('redis');
const redisSessionClient = redis.createClient();

module.exports.redisClient = redisSessionClient;
