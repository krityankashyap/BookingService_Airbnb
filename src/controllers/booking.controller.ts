import { Request , Response } from "express"
import { createBookingService, finalizeBookingService } from "../services/booking.services"

export const createBookingHandler = async (req: Request , res: Response) => {
        const booking = await createBookingService(req.body);

         res.status(201).json({
          bookingId: booking.bookingId,
          idempotencyKey: booking.idempotencyKey
         });
};

export const finalizedBookingHandler = async (req: Request , res: Response) => {
     const booking = await finalizeBookingService(req.params.idempotencyKey);

     res.status(201).json({
      bookingId: booking.id,
      idempotencyKey: booking.status
     });
};