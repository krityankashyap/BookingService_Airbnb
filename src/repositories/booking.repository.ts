import {  Prisma } from "@prisma/client";

import  prismaClient from "../prisma/client";

export async function createBooking(bookinginput: Prisma.BookingCreateInput){
   const booking = await prismaClient.booking.create({
    data: bookinginput
   });

   return booking;
}

export async function createIdempotencyKey(key: string , bookingId?: number){
   const idempotencyKey = await prismaClient.idempotencyKey.create({
      data : {
         key,
         booking: {
          connect : {
            id: bookingId,
          }
         },
      }
   })
   return idempotencyKey;
}

export async function getIdempotencyKey(key: string){
   const idempotencyKey = await prismaClient.idempotencyKey.findUnique({
      where : {
         key,
      }
   })
   return idempotencyKey
}

export async function getBookingId(bookingId: number){
   const booking = await prismaClient.booking.findUnique({
      where : {
         id: bookingId,
      }
   })

   return booking
}

export async function confirmBooking(bookingId : number ){
   const booking = await prismaClient.booking.update({
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

export async function getFinalizedIdempotencyKey(key: string){
   const idempotencyKey = await prismaClient.idempotencyKey.update({
      where:{
         key
      },
      data: {
         finalized: true
      }
   })
   return idempotencyKey
}