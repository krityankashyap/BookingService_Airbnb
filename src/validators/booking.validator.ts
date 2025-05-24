import { z } from 'zod';

const createBookingSchema = z.object({
  userId : z.number({message: "UserId must be present"}),
  hotelId : z.number({message: "HotelId must be present"}),
  totalGuests : z.number().min(1 , {message: " TotalGuests should be atleast 1"}),
  bookingAmount : z.number().min(1000 , {message: "Booking amount is atleast 1000"}),
});

export default createBookingSchema;