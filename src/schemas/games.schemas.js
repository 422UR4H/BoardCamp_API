// import { stripHtml } from "string-strip-html";
// import Joi from "@hapi/joi";
import Joi from "joi";

export const gamesSchema = Joi.object({
    // name: Joi.string().custom(value => stripHtml(value)).trim().required(), // .min(3).max(30)
    // image: Joi.string().custom(value => stripHtml(value)).uri().required(),
    name: Joi.string().trim().required(),
    image: Joi.string().uri().trim().required(),
    stockTotal: Joi.number().integer().greater(0).required(),
    pricePerDay: Joi.number().integer().greater(0).required()
});