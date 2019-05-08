import express, { Request, Response } from "express";
import cors from "cors";
import bodyParse from "body-parser";
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import TicketController from "./controller/ticket";
import { TicketRepo } from "./repo/ticket";
import Repo from "./repo";

createConnection().then(async (dbconn: Connection) => {
    const app = express();
    const port = 4600;

    app.use(cors());
    app.use(bodyParse.json());

    const repo: Repo = {
        ticket: new TicketRepo(dbconn),
    } 

    // Defining routes
    
    app.get("/api/ticket/:id", (req: Request, res: Response) =>  TicketController.get(req, res, repo));
    
    app.post("/api/create", (req: Request, res: Response) => TicketController.create(req, res, repo));
    
    app.post("/api/remove", (req: Request, res: Response) => TicketController.remove(req, res, repo));
    
    app.post("/api/update", (req: Request, res: Response) => TicketController.update(req, res, repo));
    
    app.get("/api/search", (req: Request, res: Response) => TicketController.search(req, res, repo));

    const welcomeCallback = () => console.log(`listening at http://localhost:${port}/`)
    app.listen(port, welcomeCallback);
});