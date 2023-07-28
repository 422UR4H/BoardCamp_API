import { db } from "../database/database.js";
import dayjs from "dayjs";


export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = res.locals.body;
    if (!customerId || !gameId || !daysRented) return console.log(res.locals.body)

    try {
        const customer = (await db.query(
            `SELECT name FROM customers
            WHERE id = $1`,
            [customerId]
        )).rows[0];
        if (customer === undefined) return res.status(400).send("Este Cliente não existe!");

        const { pricePerDay, stockTotal } = (await db.query(
            `SELECT pricePerDay, stockTotal FROM games
            WHERE id = $1`,
            [gameId]
        )).rows[0];
        if (pricePerDay === undefined) return res.status(400).send("Este jogo não existe!");

        const rentals = (await db.query(
            `SELECT id FROM rentals
            WHERE gameId = $1`,
            [gameId]
        )).rows;
        if (rows.length >= stockTotal) return res.status(400).send("Este jogo está indisponível!");

        const originalPrice = pricePerDay * daysRented;
        const rentDate = dayjs().locale("pt-br").format("YYYY-MM-DD");
        const { rowCount } = await db.query(
            `INSERT INTO rentals
            (customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
        );
        if (rowCount <= 0) return res.sendStatus(500);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getAllRentals(req, res) {
    try {

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res) {
    try {

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    try {

    } catch (err) {
        res.status(500).send(err.message);
    }
}