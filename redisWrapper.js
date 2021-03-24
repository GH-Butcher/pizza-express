const redis = require('redis');

class RedisWrapper {
  get client() {
    if (!this._client) {
      return new Error('[ERROR] Cannot access Redis client before connecting!');
    }
    return this._client;
  }
  connect(redisHost, redisPort) {
    this._client = redis.createClient({
      host: redisHost,
      port: redisPort,
      retry_strategy: () => 1000,
    });
  }
}

module.exports = {
  redisWrapper: new RedisWrapper(),
};
