const redis = require('redis');

class RedisWrapper {
  get client() {
    if (!this._client) {
      throw new Error('[ERROR] Cannot access Redis client before connecting!');
    }
    return this._client;
  }
  connect(redisHost, redisPort) {
    if (redisHost !== 'localhost') {
      this._client = redis.createClient({
        host: redisHost,
        port: redisPort,
        retry_strategy: () => 1000,
      });
    } else {
      return `[Testing Mode] Not using Redis server!`;
    }
  }
}

module.exports = {
  redisWrapper: new RedisWrapper(),
};
