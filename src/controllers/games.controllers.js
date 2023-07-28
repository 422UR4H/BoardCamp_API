import { db } from "../database/database.js";

export async function createGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = res.locals.body;
    if (!name || !image || !stockTotal || !pricePerDay) return console.log(res.locals.body)

    try {
        const { rows } = await db.query(
            `SELECT name FROM games WHERE name = $1`,
            [name]
        );
        if (rows.lengh > 0) return res.sendStatus(409);

        const { rowCount } = await db.query(
            `INSERT INTO games
            (name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4)`,
            [name, image, stockTotal, pricePerDay]
        );
        if (rowCount <= 0) return res.sendStatus(500);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getGames(req, res) {
    try {
        const games = (await db.query(`SELECT * FROM games`)).rows;
        res.send(games);
    } catch (err) {
        res.status(500).send(err);
    }
}