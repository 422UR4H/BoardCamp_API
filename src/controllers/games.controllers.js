import { db } from "../database/database.js";

export async function createGame(req, res) {
    // const { name, image, stockTotal, pricePerDay } = res.locals.body;
    // if (!name || !image || !stockTotal || !pricePerDay) return console.log(res.locals.body)
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const result = await db.query(
            `SELECT name FROM games WHERE name = $1`,
            [name]
        );
        console.log("RESULT.ROWS.LENGTH")
        console.log(result?.rows?.length)
        console.log("RESULT.ROW_COUNT")
        console.log(result.rowCount)
        if (result.rows.lengh > 0 || result.rowCount > 0) return res.sendStatus(409);

        const { rowCount } = await db.query(
            `INSERT INTO games
            (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,
            [name, image, stockTotal, pricePerDay]
        );
        if (rowCount <= 0) return res.sendStatus(500);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getGames(req, res) {
    const { name } = req.query;
    try {
        console.log("NAME")
        console.log(name)
        let games;
        if (!name) {
            games = (await db.query(`SELECT * FROM games`)).rows
        } else {
            games = (await db.query("SELECT * FROM games WHERE name LIKE $1", [`${name}%`])).rows;
        }
        console.log("GAMES")
        console.log(games)

        res.send(games);
    } catch (err) {
        res.status(500).send(err);
    }
}