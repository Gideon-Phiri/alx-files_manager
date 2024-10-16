import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { userQueue } from '../worker';  // Import userQueue from worker.js

class UsersController {
  /**
   * POST /users
   * Create a new user and queue a "Welcome email"
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Already exist' });

    const hashedPassword = sha1(password);
    const newUser = { email, password: hashedPassword };

    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Add a job to the "userQueue" to send a welcome email
    const userId = result.insertedId;
    await userQueue.add({ userId: userId.toString() });

    return res.status(201).json({ id: userId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
