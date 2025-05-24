import { CreateBookingDTO } from "../dto/booking.dto";
import { confirmBooking, createBooking, createIdempotencyKey, getFinalizedIdempotencyKey, getIdempotencyKey } from "../repositories/booking.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotency";

export async function createBookingService(createBookingDTO: CreateBookingDTO){
    const booking = await createBooking({
      userId : createBookingDTO.userId,
      hotelId : createBookingDTO.hotelId,
      tatalGuest : createBookingDTO.totalGuest,
      bookingAmount : createBookingDTO.bookingAmount
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
   const ConfirmBooking = await confirmBooking(idempotencyKeyData.bookindId);
   await getFinalizedIdempotencyKey(idempotencyKey);

   return ConfirmBooking;

}