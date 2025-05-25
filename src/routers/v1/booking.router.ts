import express from "express";
import { validateRequestBody } from "../../validators";
import createBookingSchema from "../../validators/booking.validator";
import { createBookingHandler, finalizedBookingHandler } from "../../controllers/booking.controller";

const bookingRouter = express.Router();

bookingRouter.post('/' , validateRequestBody(createBookingSchema) , createBookingHandler);

bookingRouter.post('/confirm/:idempotencyKey' , finalizedBookingHandler);

export default bookingRouter;