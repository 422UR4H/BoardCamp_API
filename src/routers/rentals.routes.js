import { Router } from "express";
import { rentalsSchema } from "../schemas/rentals.schemas.js";
import schemaValidation from "../middlewares/schemaValidation.js";
import {
    createRental,
    deleteRental,
    finishRental,
    getAllRentals
} from "../controllers/rentals.controllers.js";


const router = Router();

router.post("/rentals", schemaValidation(rentalsSchema), createRental);
router.get("/rentals", getAllRentals);
router.post("/rentals/:id/return", finishRental);
router.delete("/rentals/:id", deleteRental);

export default router;