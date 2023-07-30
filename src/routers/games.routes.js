import { Router } from "express";
import { gamesSchema } from "../schemas/games.schemas.js";
import schemaValidation from "../middlewares/schemaValidation.js";
import {
    createGame,
    getGames
} from "../controllers/games.controllers.js";


const router = Router();

router.post("/games", schemaValidation(gamesSchema), createGame);
router.get("/games", getGames);

export default router;