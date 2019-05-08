import { Request } from "express";
import { check, param, query, validationResult } from "express-validator/check";
import { Category } from "src/entity/ticket";

export default class TicketRequestValidator{
    public static destinyValidator(value: any, _: any){
        if (value.includes(";") || value.includes("*")){
            throw new Error("invalid_ticket_destiny");
        }
    }

    public static isDate(value: any, _: any){
        if (isNaN(Date.parse(value))){
            throw new Error("invalid_expiration_date");
        }
    }

    public static get(req: Request){
        param("id").isUUID(4).withMessage("invalid_ticket_id");
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { id } = req.params;
        return { id };
    }

    public static create(req: Request){
        check("destiny").isString().custom(TicketRequestValidator.destinyValidator);
        check("depDate").custom(TicketRequestValidator.isDate);
        check("backDate").custom(TicketRequestValidator.isDate);
        check("kind").isString();
        check("price").isNumeric();
        check("national").isBoolean();    
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }

        const {
            destiny,
            depDate,
            backDate,
            kind,
            price,
            national,
        } = req.body;

        return {
            destiny,
            departure: new Date(Date.parse(depDate)),
            back: new Date(Date.parse(backDate)),
            kind,
            price,
            national,
        };
    }

    public static update(req: Request){
        check("id").isUUID();
        check("destiny").isString().custom(TicketRequestValidator.destinyValidator);
        check("depDate").custom(TicketRequestValidator.isDate);
        check("backDate").custom(TicketRequestValidator.isDate);
        check("kind").isString();
        check("price").isNumeric();
        check("national").isBoolean();
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const {
            id,
            destiny,
            depDate,
            backDate,
            price,
            national,
            kind,
        } = req.body;

        const params = {
            id: id as string,
            destiny: destiny as string,
            departure: new Date(Date.parse(depDate)),
            back: new Date(Date.parse(backDate)),
            price: price as number,
            national: national as boolean,
            kind: kind as Category, 
        };
        return params;
    }


    public static remove(req: Request){
        check("id").isUUID();
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { id } = req.body;
        return { id: id as string };
    }

    public static search(req: Request){
        query("c").isString();
        query("q").isString();
        query("depDate").custom(TicketRequestValidator.isDate)
        query("backDate").custom(TicketRequestValidator.isDate)
        query("min").isNumeric();
        query("max").isNumeric();
        query("national").isBoolean();
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { c, q, depDate, backDate, min, max, national } = req.query;
        return { 
            kind: c as Category,
            destiny: q as string,
            departure: new Date(Date.parse(depDate)),
            back: new Date(Date.parse(backDate)),
            minPrice: min as number,
            maxPrice: max as number,
            national: national as boolean,
        };
    }
}