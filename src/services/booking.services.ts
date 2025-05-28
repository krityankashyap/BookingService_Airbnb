import { CreateBookingDTO } from "../dto/booking.dto";
import { confirmBooking, createBooking, createIdempotencyKey, FinalizedIdempotencyKey,  getIdempotencyKeywithLock } from "../repositories/booking.repository";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotency";

import  prismaClient  from "../prisma/client";
import { redlock } from "../config/redis.config";

export async function createBookingService(createBookingDTO: CreateBookingDTO){

 // In the booking service we need to ensure is that when we try to create a booking before we should try to lock the booking

  const ttl = 5000 * 60; // airbnb is booked for 5 min in pending state and nobody can book that airbnb if we don't book bnb before 5 min then it will be gone to cancelled state
  
  const bookingResource = `hotel:${createBookingDTO.hotelId}`; // this is the string on which we gonna take a lock and it gonna define that which hotelId is locked by some user 

  console.log(`Acquriing lock for resource: ${bookingResource} with ttl: ${ttl}`);

  let lock;

  try {
    lock =  await redlock.acquire([bookingResource] , ttl);
    console.log(`Lock acquired for resource: ${bookingResource}` , lock);
    const booking = await createBooking({
      userId : createBookingDTO.userId,
      hotelId : createBookingDTO.hotelId,
      totalGuest : createBookingDTO.totalGuest,
      bookingAmount : createBookingDTO.bookingAmount
    });

    const idempotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idempotencyKey , booking.id);

    return {
      idempotencyKey: idempotencyKey,
      bookingId: booking.id
    };

  } catch (error) {
    throw new InternalServerError('failed to acquire lock for booking resource');
  }
  

  // return await redlock.using([bookingResource] , ttl , async ()=>{
     
   
  //   const booking = await createBooking({
  //     userId : createBookingDTO.userId,
  //     hotelId : createBookingDTO.hotelId,
  //     totalGuest : createBookingDTO.totalGuest,
  //     bookingAmount : createBookingDTO.bookingAmount
  //   });

  //   const idempotencyKey = generateIdempotencyKey();

  //   await createIdempotencyKey(idempotencyKey , booking.id);

  //   return {
  //     idempotencyKey: idempotencyKey,
  //     bookingId: booking.id
  //   };

  // });
};

export async function confirmBookingService(idempotencyKey: string){

  //Prisma gives couples of functions where we can wrap a single transaction

   return await prismaClient.$transaction(async (tx)=>{ // this tx object going to uniquely identify the transaction

    const idempotencyKeyData = await getIdempotencyKeywithLock(tx , idempotencyKey);

   if(!idempotencyKeyData){
    throw new NotFoundError("Idempotency key not found");  // if no idempotency key found while query
   }

   if(idempotencyKeyData.finalized){
    throw new BadRequestError("Idempotency key already finalized"); // can't create same key when it's finalized i.e no another booking for same idempotency key
   }

   // now if idempotency key isn't finalized now this is the point to create finalizedBooking
   const ConfirmBooking = await confirmBooking(tx , idempotencyKeyData.bookindId);
   await FinalizedIdempotencyKey(tx , idempotencyKey);

   return ConfirmBooking;

   })
   

}