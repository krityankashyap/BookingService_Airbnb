import IORedis from 'ioredis'
import Redlock from 'redlock'
import  { serverConfig } from '.'

export const redisClient = new IORedis(serverConfig.REDIS_SERVER_URL); 

 export const redlock = new Redlock([redisClient], {

  // The expected clock drift;
  driftFactor: 0.01, // time in ms

  // The max number of times Redlock will attempt to lock a resource before erroring.
  retryCount: 10,

  // the time in ms between attempts
  retryDelay: 200,

  // the max time in ms randomly added to retries to improve performance under high contention
  retryJitter: 200

});



