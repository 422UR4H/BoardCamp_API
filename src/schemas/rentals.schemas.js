// import Joi from "@hapi/joi";
import Joi from "joi";

export const rentalsSchema = Joi.object({
    customerId: Joi.number().integer().required(),
    gameId: Joi.number().integer().required(),
    daysRented: Joi.number().integer().greater(0).required()
});