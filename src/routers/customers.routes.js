import { Router } from "express";
import {
    createCustomer,
    getAllCustomers,
    getCustomer
} from "../controllers/customers.controllers.js";


const router = Router();

router.post("/customers", createCustomer);
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomer);

export default router;