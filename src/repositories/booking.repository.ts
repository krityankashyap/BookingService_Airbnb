import {  Prisma , IdempotencyKey} from "@prisma/client";

import {validate as isValidUUID} from "uuid"
import  prismaClient from "../prisma/client";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";

export async function createBooking(bookinginput: Prisma.BookingCreateInput){
   const booking = await prismaClient.booking.create({
    data: bookinginput
   });

   return booking;
}

export async function createIdempotencyKey(key: string , bookingId?: number){
   const idempotencyKey = await prismaClient.idempotencyKey.create({
      data : {
         idemkey: key,
         booking: {
          connect : {
            id: bookingId,
          }
         },
      }
   })
   return idempotencyKey;
}

export async function getIdempotencyKeywithLock( tx: Prisma.TransactionClient , key: string){

   if(!isValidUUID(key)){
  
      throw new BadRequestError('Invalid idempotency key format');

   }
   console.log(`SELECT * from IdempotencyKey WHERE idemkey='${key}' FOR UPDATE;`);

   const idempotencyKey: Array<IdempotencyKey> = await tx.$queryRaw(Prisma.raw(`SELECT * from IdempotencyKey WHERE idemkey='${key}' FOR UPDATE;`));

   // SELECT * query is intended to give all records to we have to give a proper check

   if(!idempotencyKey || idempotencyKey.length == 0){
      throw new NotFoundError('Idempotency key not found');
   }
   return idempotencyKey[0];
}

export async function getBookingId(bookingId: number){
   const booking = await prismaClient.booking.findUnique({
      where : {
         id: bookingId,
      }
   })

   return booking
}

export async function confirmBooking( tx: Prisma.TransactionClient , bookingId : number ){
   const booking = await tx.booking.update({
      where : {
         id: bookingId,
      },
      data: {
         status: "CONFIRMED"  
      }

   })
   return booking

}
export async function cancellBooking(bookingId : number ){
   const booking = await prismaClient.booking.update({
      where : {
         id: bookingId,
      },
      data: {
         status: "CANCELLED"  
      }

   })
   return booking

}

export async function FinalizedIdempotencyKey(tx: Prisma.TransactionClient , key: string){
   const idempotencyKey = await tx.idempotencyKey.update({
      where:{
          idemkey: key
      },
      data: {
         finalized: true
      }
   })
   return idempotencyKey
}