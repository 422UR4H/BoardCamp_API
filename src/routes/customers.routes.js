import { Router } from "express";

const router = Router();

router.post("/customers", createCustomer);
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomer);

export default router;