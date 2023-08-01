import { Router } from "express";
import { gamesSchema } from "../schemas/games.schemas.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
    createGame,
    getGames
} from "../controllers/games.controllers.js";


const router = Router();

router.post("/games", validateSchema(gamesSchema), createGame);
router.get("/games", getGames);

export default router;