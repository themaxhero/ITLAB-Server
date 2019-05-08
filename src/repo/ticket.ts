import { Connection, Repository } from "typeorm"
import { BaseRepo } from "./base";
import { Ticket, CreationParams, UpdateParams } from "src/entity/ticket";

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

}