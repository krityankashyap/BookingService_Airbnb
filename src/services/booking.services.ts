import { confirmBooking, confirmBookingSatus, createBooking, createIdempotencyKey, getFinalizedIdempotencyKey, getIdempotencyKey } from "../repositories/booking.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotency";

export async function createBookingService(
  userId : number,
  hotelId : number,
  totalGuest : number,
  bookingAmount: number
){
    const booking = await createBooking({
      userId,
      hotelId,
      tatalGuest : totalGuest,
      bookingAmount : bookingAmount
    });

    const idempotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idempotencyKey , booking.id);

    return {
      idempotencyKey: idempotencyKey,
      booking: booking.id
    };
};

export async function finalizeBookingService(idempotencyKey: string){
   const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);

   if(!idempotencyKeyData){
    throw new NotFoundError("Idempotency key not found");  // no idempotency key found while query
   }

   if(idempotencyKeyData.finalized){
    throw new BadRequestError("Idempotency key already finalized"); // can't create same key when it's finalized i.e no another booking for same idempotency key
   }

   // now if idempotency key isn't finalized now this is the point to create finalizedBooking
   const booking = await confirmBooking(idempotencyKeyData.bookindId);
   await getFinalizedIdempotencyKey(idempotencyKey);

   return booking;

}