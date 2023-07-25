import { Router } from "express";

const router = Router();

router.post("/rentals", createRental);
router.get("/rentals", getAllRentals);
router.post("/rentals/:id/return", finishRental);
router.delete("/rentals/:id", deleteRental);

export default router;