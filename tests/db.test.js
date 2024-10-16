import chai from 'chai';
import dbClient from '../utils/db';

const { expect } = chai;

describe('dbClient', () => {
  it('should confirm MongoDB is alive', () => {
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('should return the correct number of users and files', async () => {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();

    expect(users).to.be.a('number');
    expect(files).to.be.a('number');
  });
});
