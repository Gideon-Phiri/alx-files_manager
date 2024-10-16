import chai from 'chai';
import redisClient from '../utils/redis';

const { expect } = chai;

describe('redisClient', () => {
  it('should confirm Redis is alive', () => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('should set, get and delete a key in Redis', async () => {
    await redisClient.set('testKey', 'value', 10);
    const value = await redisClient.get('testKey');
    expect(value).to.equal('value');

    await redisClient.del('testKey');
    const deletedValue = await redisClient.get('testKey');
    expect(deletedValue).to.be.null;
  });
});
