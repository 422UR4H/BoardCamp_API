import { Router } from "express";
import { rentalsSchema } from "../schemas/rentals.schemas.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
    createRental,
    deleteRental,
    finishRental,
    getAllRentals
} from "../controllers/rentals.controllers.js";


const router = Router();

router.post("/rentals", validateSchema(rentalsSchema), createRental);
router.get("/rentals", getAllRentals);
router.post("/rentals/:id/return", finishRental);
router.delete("/rentals/:id", deleteRental);

export default router;