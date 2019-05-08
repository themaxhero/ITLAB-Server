import express, { Request, Response } from "express";
import cors from "cors";
import bodyParse from "body-parser";
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";

createConnection().then(async (dbconn: Connection) => {
    const app = express();
    const port = 4600;

    app.use(cors());
    app.use(bodyParse.json());

    // Defining routes

    const welcomeCallback = () => console.log(`listening at http://localhost:${port}/`)
    app.listen(port, welcomeCallback);
});