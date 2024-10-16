import redisClient from '../utils/redis';
import dbClient from '../utils/db';


class AppController {
  /**
   * GET /status
   * Check if Redis and MongoDB are alive
   */
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    return res.status(200).json(status);
  }

  /**
   * GET /stats
   * Return number of users and files in the DB
   */
  static async getStats(req, res) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    return res.status(200).json(stats);
  }
}

export default AppController;
