import { db } from "../database/database.js";
import dayjs from "dayjs";
import hasUpperCase from "../scripts/hasUpperCase.js";


export async function createRental(req, res) {
    // const { customerId, gameId, daysRented } = res.locals.body;
    // if (!customerId || !gameId || !daysRented) return console.log(res.locals.body)
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = (await db.query(
            `SELECT name
            FROM customers
            WHERE id = $1`,
            [customerId]
        )).rows[0];
        if (!customer) return res.status(400).send("Este Cliente não existe!");

        const { pricePerDay, stockTotal } = (await db.query(
            `SELECT "pricePerDay", "stockTotal"
            FROM games
            WHERE id = $1`,
            [gameId]
        )).rows[0];
        if (!stockTotal) return res.status(400).send("Este jogo não existe!");

        const rentals = (await db.query(
            `SELECT id
            FROM rentals
            WHERE "gameId" = $1 AND "returnDate" IS NULL`,
            [gameId]
        )).rows;
        if (rentals.length >= stockTotal) return res.status(400).send("Este jogo está indisponível!");

        const originalPrice = pricePerDay * daysRented;
        const rentDate = dayjs().format("YYYY-MM-DD");
        const { rowCount } = await db.query(
            `INSERT INTO rentals
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getAllRentals(req, res) {
    const { customerId, gameId } = req.query;
    let { offset, limit, order, desc } = req.query;
    try {
        let rentals;
        let orderBy;

        if (!offset) offset = 0;
        if (!limit) limit = null;
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

        if (customerId) {
            rentals = (await db.query(`
                SELECT rentals.*,
                    customers.name AS "customerName",
                    games.name AS "gameName"
                FROM rentals
                JOIN customers ON customers.id = rentals."customerId"
                JOIN games ON games.id = rentals."gameId"
                WHERE "customerId" = $1
                ${orderBy}
                LIMIT $2 OFFSET $3
            `, [customerId, limit, offset])).rows;
        } else if (gameId) {
            rentals = (await db.query(`
                SELECT rentals.*,
                    customers.name AS "customerName",
                    games.name AS "gameName"
                FROM rentals
                JOIN customers ON customers.id = rentals."customerId"
                JOIN games ON games.id = rentals."gameId"
                WHERE "gameId" = $1
                ${orderBy}
                LIMIT $2 OFFSET $3
            `, [gameId, limit, offset])).rows;
        } else {
            rentals = (await db.query(`
                SELECT rentals.*,
                    customers.name AS "customerName",
                    games.name AS "gameName"
                FROM rentals
                JOIN customers ON customers.id = rentals."customerId"
                JOIN games ON games.id = rentals."gameId"
                ${orderBy}
                LIMIT $1 OFFSET $2
            `, [limit, offset])).rows;
        }

        rentals.map(r => {
            r.rentDate = dayjs(r.rentDate).format("YYYY-MM-DD");
            if (r.returnDate) r.returnDate = dayjs(r.returnDate).format("YYYY-MM-DD");

            r.customer = { id: r.customerId, name: r.customerName };
            r.game = { id: r.gameId, name: r.gameName };
        });

        res.send(rentals);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res) {
    const { id } = req.params;
    try {
        const rental = (await db.query(
            `SELECT rentals.*, games."pricePerDay"
            FROM rentals
            JOIN games ON games.id = rentals."gameId"
            WHERE rentals.id = $1`,
            [id]
        )).rows[0];
        if (!rental) {
            return res.status(404).send({ message: "Este aluguel não existe!" });
        }

        const { rentDate, daysRented, pricePerDay } = rental;
        let { returnDate } = rental;
        if (returnDate) {
            return res.status(400).send({ message: "Aluguel já finalizado!" });
        }

        returnDate = dayjs();
        let delayFee = returnDate.diff(dayjs(rentDate), "day");

        if (delayFee > daysRented) {
            delayFee -= daysRented;
            delayFee *= pricePerDay;
        } else {
            delayFee = 0;
        }

        const { rowCount } = await db.query(
            `UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3`,
            [returnDate.format("YYYY-MM-DD"), delayFee, id]
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        const rentals = (await db.query(
            `SELECT "returnDate" FROM rentals WHERE id = $1`,
            [id]
        )).rows[0];
        if (!rentals) {
            return res.status(404).send({ message: "Este aluguel não existe!" });
        }

        if (!rentals.returnDate) {
            return res.status(400).send({ message: "Aluguel não finalizado!" });
        }

        const { rowCount } = await db.query(
            `DELETE FROM rentals WHERE id = $1`,
            [id]
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}