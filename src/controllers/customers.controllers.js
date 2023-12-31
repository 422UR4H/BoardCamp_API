import { db } from "../database/database.js";
import dayjs from "dayjs";
import hasUpperCase from "../scripts/hasUpperCase.js";


export async function createCustomer(req, res) {
    // const { name, phone, cpf, birthday } = res.locals.body;
    const { name, phone, cpf, birthday } = req.body;
    try {
        // rustic method to verify UNIQUE cpf
        const result = await db.query(
            `SELECT cpf FROM customers WHERE cpf = $1`,
            [cpf]
        );
        if (result.rows.length > 0 || result.rowCount > 0) {
            return res.status(409).send({ message: "Esse CPF já foi cadastrado!" });
        }

        const { rowCount } = await db.query(
            `INSERT INTO customers
                (name, phone, cpf, birthday)
            VALUES
                ($1, $2, $3, $4)`,
            [name, phone, cpf, dayjs(birthday).format("YYYY-MM-DD")] // delete format when validated by Joi
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getAllCustomers(req, res) {
    const { cpf } = req.query;
    let { limit, offset, order, desc } = req.query;

    try {
        let customers;
        let orderBy;

        if (!limit) limit = null;
        if (!offset) offset = 0;
        if (!order) {
            orderBy = "";
        } else {
            if (hasUpperCase(order)) order = `\"${order}\"`;
            orderBy = `ORDER BY ${order}`;

            if (!desc) {
                orderBy += " ASC";
            } else {
                orderBy += " DESC";
            }
        }

        if (!cpf) {
            customers = (await db.query(
                `SELECT * FROM customers ${orderBy} LIMIT $1 OFFSET $2`,
                [limit, offset]
            )).rows;
        } else {
            customers = (await db.query(
                `SELECT * FROM customers ${orderBy} WHERE cpf LIKE $1 LIMIT $2 OFFSET $3`,
                [`${cpf}%`, limit, offset]
            )).rows;
        }
        customers.map(c => c.birthday = dayjs(c.birthday).format("YYYY-MM-DD"));
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

        if (!customer) return res.status(404).send({ message: "Cliente não encontrado!" });

        customer.birthday = dayjs(customer.birthday).format("YYYY-MM-DD");
        res.send({ ...customer, birthday: dayjs(customer.birthday).format("YYYY-MM-DD") });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomer(req, res) {
    // const { name, phone, cpf, birthday } = res.locals.body;
    const { name, phone, cpf, birthday } = req.body;
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
            [name, phone, cpf, dayjs(birthday).format("YYYY-MM-DD"), id]
        );
        if (rowCount <= 0) {
            return res
                .status(409)
                .send("Não foi possível atualizar. O Cliente pode estar aberto ou sendo utilizado!");
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}