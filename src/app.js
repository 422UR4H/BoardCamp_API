import express, { json } from "express";
import cors from "cors";


const app = express();
app.use(json());
app.use(cors());

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));