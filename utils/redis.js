import redis from 'redis';
import { promisify } from 'util';


class RedisClient {
  constructor() {
    // Create a Redis client and handle errors
    this.client = redis.createClient();
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error}`);
    });
    // Promisify the Redis commands to use async/await
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Check if Redis is alive (i.e., connected successfully)
   * @return {boolean} True if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value of a key in Redis
   * @param {string} key
   * @return {Promise<string>} The value stored in Redis
   */
  async get(key) {
    return this.getAsync(key);
  }

  /**
   * Set a key-value pair in Redis with an expiration time
   * @param {string} key
   * @param {string | number} value
   * @param {number} duration - expiration time in seconds
   */
  async set(key, value, duration) {
    await this.setAsync(key, value, 'EX', duration);
  }

  /**
   * Delete a key from Redis
   * @param {string} key
   */
  async del(key) {
    await this.delAsync(key);
  }
}

// Exporting an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
