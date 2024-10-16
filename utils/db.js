import { MongoClient } from 'mongodb';


class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    // Connect to MongoDB and assign the client instance
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
      })
      .catch((err) => {
        console.error(`MongoDB connection error: ${err}`);
      });
  }

  /**
   * Check if MongoDB is alive (i.e., connected)
   * @return {boolean} True if connected, false otherwise
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Get the number of users in the 'users' collection
   * @return {Promise<number>} Number of users
   */
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  /**
   * Get the number of files in the 'files' collection
   * @return {Promise<number>} Number of files
   */
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

// Exporting an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
