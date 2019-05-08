import { Connection, Repository, SelectQueryBuilder, QueryBuilder } from "typeorm"
import { BaseRepo } from "./base";
import { Ticket, CreationParams, UpdateParams, SearchParams, Category } from "src/entity/ticket";

type searchable = string | Date | number | boolean | Category | undefined;

export class TicketRepo extends BaseRepo {

    private ormRepo: Repository<Ticket>;

    constructor(dbconn: Connection){
        super(dbconn);
        this.ormRepo = dbconn.getRepository(Ticket);
    }

    public async get(id: string){
        return await this.ormRepo
            .createQueryBuilder("product")
            .where("product.id = :id", { id })
            .getOne();
    }

    public async create(params: CreationParams){
        const newTicket = new Ticket(params);
        return await newTicket.save();
    }

    public async update(params: UpdateParams){
        const { id, ...updatingFields } = params;
        this.dbconn
            .createQueryBuilder()
            .update(Ticket)
            .set({... updatingFields})
            .where("id = :id", { id })
            .execute();
        return this.get(id);
    }

    public async remove(id: string){
        await this.dbconn
            .createQueryBuilder()
            .delete()
            .from(Ticket)
            .where("id = :id", { id })
            .execute();
        const deleted = await this.get(id);
        return (deleted === undefined);
    }

    searchIfDefined(
        value: any,
        fallback: SelectQueryBuilder<Ticket>,
        searchCallback: (v: any) => SelectQueryBuilder<Ticket>){
        if (value === undefined){
            return fallback;
        }
        return searchCallback(value);
    }

    public async search(params: SearchParams){
        const { 
            destiny,
            departure,
            back,
            minPrice,
            maxPrice,
            national,
            kind,
        } = params;

        const mapDestiny = (qb: SelectQueryBuilder<Ticket>) => {
            return this.searchIfDefined(destiny, qb, (v: string) => {
                return qb.andWhere("ticket.destiny = :destiny", { destiny: v });
            });
        }

        const mapDep = (qb: SelectQueryBuilder<Ticket>) => {
            return this.searchIfDefined(departure, qb, (v: string) => {
                return qb.andWhere("ticket.departure = :departure", { departure: v });
            });
        }

        const mapBack = (qb: SelectQueryBuilder<Ticket>) => {
            return this.searchIfDefined(back, qb, (v: string) => {
                return qb.andWhere("ticket.back = :back", { back: v });
            });
        }
        
        const mapMin = (qb: SelectQueryBuilder<Ticket>) =>{
            return this.searchIfDefined(minPrice, qb, (v: string) => {
                return qb.andWhere("ticket.price >= :min", { min: v });
            });
        }
        
        const mapMax = (qb: SelectQueryBuilder<Ticket>) =>{
            return this.searchIfDefined(maxPrice, qb, (v: string) => {
                return qb.andWhere("ticket.price <= :max", { max: v });
            });
        }
        
        const mapKind = (qb: SelectQueryBuilder<Ticket>) =>{
            return this.searchIfDefined(kind, qb, (v: string) => {
                return qb.andWhere("ticket.category = :category", { category: v });
            });
        }
        
        const mapNational = (qb: SelectQueryBuilder<Ticket>) =>{
            return this.searchIfDefined(national, qb, (v: string) => {
                return qb.andWhere("ticket.national = :national", { national: v });
            });
        }

        return this.ormRepo.createQueryBuilder("ticket")
            .map(mapDestiny)
            .map(mapDep)
            .map(mapBack)
            .map(mapMin)
            .map(mapMax)
            .map(mapKind)
            .map(mapNational)
            .orderBy("ticket.name", "ASC")
            .getMany();
    }

}