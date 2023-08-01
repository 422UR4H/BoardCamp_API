import { Router } from "express";
import { customersSchema } from "../schemas/customers.schemas.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
    createCustomer,
    getAllCustomers,
    getCustomer,
    updateCustomer
} from "../controllers/customers.controllers.js";


const router = Router();

router.post("/customers", validateSchema(customersSchema), createCustomer);
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomer);
router.put("/customers/:id", validateSchema(customersSchema), updateCustomer);

export default router;