import Bull from 'bull';
import imageThumbnail from 'image-thumbnail';
import { ObjectId } from 'mongodb';
import dbClient from './utils/db';
import fs from 'fs';
import path from 'path';

// Create the queues
export const fileQueue = new Bull('fileQueue');
export const userQueue = new Bull('userQueue');

// Process the fileQueue to generate thumbnails
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId || !userId) {
    throw new Error('Missing fileId or userId');
  }

  // Retrieve the file from MongoDB
  const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });
  if (!file || file.type !== 'image') {
    throw new Error('File not found or not an image');
  }

  const filePath = file.localPath;
  const sizes = [500, 250, 100];

  // Generate thumbnails for the image
  for (const size of sizes) {
    const thumbnail = await imageThumbnail(filePath, { width: size });
    const thumbnailPath = `${filePath}_${size}`;
    fs.writeFileSync(thumbnailPath, thumbnail);
    console.log(`Generated thumbnail for ${file.name} of size ${size}px`);
  }
});

// Process the userQueue to send a "Welcome email"
userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  // Retrieve the user from MongoDB
  const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error('User not found');
  }

  // Simulate sending a welcome email (console log)
  console.log(`Welcome ${user.email}!`);
});
