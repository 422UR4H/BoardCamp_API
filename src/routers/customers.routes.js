import { Router } from "express";
import { customersSchema } from "../schemas/customers.schemas.js";
import schemaValidation from "../middlewares/schemaValidation.js";
import {
    createCustomer,
    getAllCustomers,
    getCustomer,
    updateCustomer
} from "../controllers/customers.controllers.js";


const router = Router();

router.post("/customers", schemaValidation(customersSchema), createCustomer);
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomer);
router.put("/customers/:id", schemaValidation(customersSchema), updateCustomer);

export default router;