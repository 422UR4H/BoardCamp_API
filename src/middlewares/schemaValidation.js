export default function schemaValidation(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) return res.status(400).send(error.details.map(d => d.message));
        res.locals.body = value;
        next();
    };
}