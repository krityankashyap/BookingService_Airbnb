import { Prisma } from "@prisma/client";

import  prismaClient from "../prisma/client";

export async function createBooking(bookinginput: Prisma.BookingCreateInput){
   const booking = await prismaClient.booking.create({
    data: bookinginput
   });

   return booking;
}