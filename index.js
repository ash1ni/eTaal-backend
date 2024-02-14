// app.js
import dotenv from "dotenv";
import express from "express";
import { execSync } from "node:child_process";
import { getTextToSql } from "./controllers/TextToSqlController.js";
import { getBargraph } from "./controllers/BarGraphController.js";
import { getSqlToText } from "./controllers/SqlToTextController.js";
import cors from 'cors'

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

app.use(express.json());

async function runDdlScripts() {
    const testFolder = "./db/";
    const stdout = execSync(`bash main.sh`, { encoding: "utf-8" });
  }
  
  runDdlScripts();

app.post("/text-to-sql", getTextToSql);
app.post('/bar-graph', getBargraph);
app.post('/sql-to-natural', getSqlToText);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
