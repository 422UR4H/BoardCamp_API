import { db } from "../database/database.js";
import dayjs from "dayjs";


export async function createRental(req, res) {
    // const { customerId, gameId, daysRented } = res.locals.body;
    // if (!customerId || !gameId || !daysRented) return console.log(res.locals.body)
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = (await db.query(
            `SELECT name FROM customers
            WHERE id = $1`,
            [customerId]
        )).rows[0];
        if (!customer) return res.status(400).send("Este Cliente não existe!");

        const { pricePerDay, stockTotal } = (await db.query(
            `SELECT "pricePerDay", "stockTotal" FROM games
            WHERE id = $1`,
            [gameId]
        )).rows[0];
        if (!pricePerDay) return res.status(400).send("Este jogo não existe!");

        const rentals = (await db.query(
            `SELECT id FROM rentals
            WHERE "gameId" = $1`,
            [gameId]
        )).rows;
        if (rentals.length >= stockTotal) return res.status(400).send("Este jogo está indisponível!");

        const originalPrice = pricePerDay * daysRented;
        const rentDate = dayjs().locale("pt-br").format("YYYY-MM-DD");
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
    try {
        const result = (await db.query(`
            SELECT rentals.*,
                customers.id AS "customerId",
                customers.name AS "customerName",
                games.id AS "gameId",
                games.name AS "gameName"
            FROM rentals
            JOIN customers ON customers.id = rentals."customerId"
            JOIN games ON games.id = rentals."gameId"
        `)).rows;

        result.map(r => {
            r.rentDate = dayjs(r.rentDate).format("YYYY-MM-DD");
            if (r.returnDate) r.returnDate = dayjs(r.returnDate).format("YYYY-MM-DD");
        });

        const {
            id,
            customerId,
            gameId,
            rentDate,
            daysRented,
            returnDate,
            originalPrice,
            delayFee,
            customerName,
            gameName
        } = result;

        const rentals = {
            id,
            customerId,
            gameId,
            rentDate,
            daysRented,
            returnDate,
            originalPrice,
            delayFee,
            customer: {
                id: customerId,
                name: customerName
            },
            game: {
                id: gameId,
                name: gameName
            }
        }
        // read the console and organize before send to client
        console.log(rentals);

        res.send(rentals);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res) {
    const { id } = req.params;
    try {
        const rental = (await db.query(
            `SELECT * FROM rentals WHERE id = $1`,
            [id]
        )).rows[0];
        if (!rental) return res.sendStatus(404);

        const { returnDate, rentalDate, delayFee } = rental;
        if (rental.returnDate) return res.status(400).send("Aluguel já finalizado!");

        returnDate = dayjs.locale("pt-br").format("YYYY-MM-DD");
        delayFee = returnDate.diff(rentalDate, "day");
        delayFee *= originalPrice;

        const { rowCount } = await db.query(
            `UPDATE rentals
            SET "returnDate"=$1, "delayFee"=$2,
            WHERE id=$3`,
            [returnDate, delayFee, id]
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params.id;
    try {
        const rentals = (await db.query(
            `SELECT id, "returnDate" FROM rentals WHERE id = $1`,
            [id]
        )).rows[0];
        if (!rentals) return res.sendStatus(404);

        if (!rentals.returnDate) return res.status(400).send("Aluguel não finalizado!");

        const { rowCount } = await db.query(
            `DELETE FROM rentals
            WHERE id = $1`,
            [id]
        );
        if (rowCount <= 0) return res.sendStatus(409);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}