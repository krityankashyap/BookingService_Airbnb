import IORedis, { Redis } from 'ioredis'
import Redlock from 'redlock'
import  { serverConfig } from '.'

// export const redisClient = new IORedis(serverConfig.REDIS_SERVER_URL); 

// Singleton pattern to connect with Redis
function connectionToRedis(){

  try {
 
   let connection: Redis;
   
   return () => {
     if(!connection){
       connection = new IORedis(serverConfig.REDIS_SERVER_URL); 
       return connection;
     }
 
     return connection;
   }
 
  } catch (error) {
    console.log("Error connection to reddis: ",error);
    throw error;
  }
 }
 
 // Singleton Object :- it is an object that is actually created once in the lifetime of ur code running and whenever someone agains tries to get that object the same already created object will returned, u don't create a brand new object for the same singleton alltogether so here we gonna make this function as singleton so that we don't need to make connection object again and again
 
 export const getRedisConnectionObject = connectionToRedis();

 export const redlock = new Redlock([getRedisConnectionObject()], {

  // The expected clock drift;
  driftFactor: 0.01, // time in ms

  // The max number of times Redlock will attempt to lock a resource before erroring.
  retryCount: 10,

  // the time in ms between attempts
  retryDelay: 200,

  // the max time in ms randomly added to retries to improve performance under high contention
  retryJitter: 200

});



