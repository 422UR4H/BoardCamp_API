import Joi from "@hapi/joi";

export const gamesSchema = Joi.object({
    customerId: Joi.number().integer().required(),
    gameId: Joi.number().integer().required(),
    daysRented: Joi.number().integer().greater(0).required()
});