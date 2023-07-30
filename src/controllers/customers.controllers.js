import { db } from "../database/database.js";

export async function createCustomer(req, res) {
    // const { name, phone, cpf, birthday } = res.locals.body;
    const { name, phone, cpf, birthday } = req.body;
    try {
        // rustic method to verify UNIQUE cpf
        const { rows } = await db.query(
            `SELECT cpf FROM customers WHERE cpf = $1`,
            [cpf]
        );
        if (rows.length > 0) return res.sendStatus(409);

        const { rowCount } = await db.query(
            `INSERT INTO customers
            (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getAllCustomers(req, res) {
    try {
        const customers = (await db.query(`SELECT * FROM customers`)).rows;
        res.send(customers);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomer(req, res) {
    try {
        const customer = (await db.query(
            `SELECT * FROM customers WHERE id = $1`,
            [req.params.id]
        )).rows[0];

        if (!customer) return res.sendStatus(404);

        res.send(customer);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf, birthday } = res.locals.body;
    const { id } = req.params;

    try {
        // rustic method to verify UNIQUE cpf by id
        const { rows } = await db.query(
            `SELECT cpf FROM customers
            WHERE cpf = $1 AND id <> $2`,
            [cpf, id]
        );
        if (rows.length > 0) return res.sendStatus(409);

        const { rowCount } = await db.query(
            `UPDATE customers
            SET name = $1, phone = $2, cpf = $3, birthday = $4
            WHERE id = $5`,
            [name, phone, cpf, birthday, id]
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}