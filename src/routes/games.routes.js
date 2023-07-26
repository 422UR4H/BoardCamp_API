import { Router } from "express";
import {
    createGame,
    getGames
} from "../controllers/games.controllers.js";


const router = Router();

router.post("/games", createGame);
router.get("/games", getGames);

export default router;