import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const customersSchema = Joi.object({
    name: Joi.string().custom(value => stripHtml(value)).trim().min(3).max(30).required(),
    phone: Joi.string().custom(value => stripHtml(value)).trim().number().min(10).max(11).required(),
    cpf: Joi.string().custom(value => stripHtml(value)).trim().number().length(11).required(),
    birthday: Joi.date().format("YYYY-MM-DD").required()
});