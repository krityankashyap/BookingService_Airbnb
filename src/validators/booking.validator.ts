import { z } from 'zod';

const createBookingSchema = z.object({
  userId : z.number({message: "UserId must be present"}),
  hotelId : z.number({message: "HotelId must be present"}),
  totalGuest : z.number({message: " TotalGuests should be atleast 1"}).min(1 , {message: " TotalGuests should be atleast 1"}),
  bookingAmount : z.number({message: "Booking amount is atleast 1000"}).min(1 , {message: "Booking amount is atleast 1000"}),
});

export default createBookingSchema;