import { db } from "../database/database.js";

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = res.locals.body;
    try {
        // rustic method to verify UNIQUE cpf
        const result = (await db.query(
            `SELECT cpf FROM customers WHERE cpf = $1`,
            [cpf]
        )).rows;

        if (result.length !== 0) return res.sendStatus(409);

        await db.query(
            `INSERT INTO customers
            (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getAllCustomers(req, res) {

}

export async function getCustomer(req, res) {

}