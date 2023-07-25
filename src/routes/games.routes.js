import { Router } from "express";

const router = Router();

router.post("/games", createGame);
router.get("/games", getGames);

export default router;