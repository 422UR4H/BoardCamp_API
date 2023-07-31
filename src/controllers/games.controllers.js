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
    let { offset, limit, order, desc } = req.query;
    try {
        let games;

        if (!offset) offset = 0;
        if (!limit) limit = null;
        if (!order) {
            order = "";
        } else {
            // validate with columns array
            order = "ORDER BY " + order;

            if (!desc) {
                order += " ASC";
            } else {
                order += " DESC";
            }
        }
        console.log(order)

        if (!name) {
            games = (await db.query(
                `SELECT * FROM games ${order} LIMIT $1 OFFSET $2`,
                [limit, offset]
            )).rows
        } else {
            games = (await db.query(
                `SELECT * FROM games ${order} WHERE name LIKE $1 LIMIT $2 OFFSET $3`,
                [`${name}%`, limit, offset]
            )).rows;
        }
        res.send(games);
    } catch (err) {
        res.status(500).send(err);
    }
}