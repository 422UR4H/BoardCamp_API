import { Router } from "express";
import schemaValidation from "../middlewares/schemaValidation.js";
import { gamesSchema } from "../schemas/games.schemas.js";
import {
    createGame,
    getGames
} from "../controllers/games.controllers.js";


const router = Router();

router.post("/games", schemaValidation(gamesSchema), createGame);
router.get("/games", getGames);

export default router;