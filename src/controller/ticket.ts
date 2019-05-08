import { Request, Response } from "express";
import TicketRequestValidator from "../validator/ticket";
import Repos from "../repo";
import { CreationParams } from "../entity/ticket";

export default class TicketController{

    private static undefinedGuard(params: any){
        const { 
            c,
            q,
            depDate,
            backDate,
            min,
            max,
            national,
        } = params;
        return (c === undefined
                && q === undefined
                && depDate === undefined
                && backDate === undefined
                && min === undefined
                && max === undefined
                && national === undefined
        );
    }

    public static async get(req: Request, res: Response, repo: Repos){
        try {
            const params = TicketRequestValidator.get(req);
            const ticket = await repo.ticket.get(params.id);
            if (!ticket){
                throw new Error("ticket_not_found");
            }
            const renderedTicket = JSON.stringify(ticket);
            return res.status(200).json(renderedTicket);
        } catch(err) {
            res.status(400).json({ error: err.toString() });
        }
    }

    public static async create(req: Request, res: Response, repo: Repos){
        try {
            const params: CreationParams = TicketRequestValidator.create(req);
            const ticket = await repo.ticket.create(...params);
            if (!ticket){
                throw new Error("ticket_not_found");
            }
            const renderedTicket = JSON.stringify(ticket);
            return res.status(201).json(renderedTicket);
        } catch(err){
            return res.status(400).json({ error: err.toString() });
        }
    }

    public static async update(req: Request, res: Response, repo: Repos){
        try {
            const params = TicketRequestValidator.update(req);
            const ticket = await repo.ticket.update(params);
            if (!ticket){
                throw new Error("ticket_not_found");
            }
            const renderedTicket = JSON.stringify(ticket);
            return res.status(200).json(renderedTicket);
        } catch(err){
            res.status(400).json({ error: err.toString() });
        }
    }

    public static async remove(req: Request, res: Response, repo: Repos){
        try {
            const params = TicketRequestValidator.remove(req);
            const deleted = await repo.ticket.remove(params.id);
            if (!deleted){
                res.status(500).json();
                throw new Error("ticket_not_deleted");
            }
            return res.status(200).json();
        } catch(err){
            if (err !== new Error("ticket_not_deleted")) {
                return res.status(400).json({ error: err.toString() });
            }
        }
    }

    public static async search(req: Request, res: Response, repo: Repos){
        try {
            const params = TicketRequestValidator.search(req);
            if (TicketController.undefinedGuard(params)){
                return res.status(200).json({ tickets: [] });
            }
            const tickets =  await repo.ticket.search(params);
            if (!tickets){
                throw new Error();
            }
            const renderedTickets = JSON.stringify({ tickets });
            return res.status(200).send(renderedTickets);

        } catch(err){
            res.status(400).json({ error: err });
        }
    }
}