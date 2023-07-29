import express, { json } from "express";
import cors from "cors";
import router from "./routers/index.routes.js";
import dotenv from "dotenv";


const app = express();
app.use(json());
app.use(cors());
app.use(router);
dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));