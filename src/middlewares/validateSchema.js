export default function validateSchema(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) return res.status(400).send(error.details.map(d => d.message));
        console.log("ERRIR ")
        console.log(error)
        console.log("VALUE ")
        console.log(value)
        res.locals.body = value;
        next();
    };
}