// import { stripHtml } from "string-strip-html";
// import Joi from "@hapi/joi";
import Joi from "joi";

export const customersSchema = Joi.object({
    // name: Joi.string().custom(value => stripHtml(value)).trim().min(3).max(30).required(),
    // phone: Joi.string().custom(value => stripHtml(value)).trim().pattern(/^[0-9]+$/).min(10).max(11).required(),
    name: Joi.string().trim().required(), // .min(3).max(30)
    phone: Joi.string().trim().pattern(/^[0-9]+$/).min(10).max(11).required(),
    cpf: Joi.string().trim().pattern(/^[0-9]+$/).length(11).required(),
    birthday: Joi.date().iso().max('now').raw().required()
});