import { BaseEntity, Column, PrimaryGeneratedColumn, Entity } from "typeorm";

export enum Category {
    ADULT = "ADULT",
    KID = "KID",
}

export interface CreationParams {
    destiny: string;
    departure: Date;
    back: Date;
    price: number;
    national: boolean;
    kind: Category;
}

export interface UpdateParams {
    id: string;
    destiny: string;
    departure: Date;
    back: Date;
    price: number;
    national: boolean;
    kind: Category;
}

export interface SearchParams{
    destiny?: string;
    departure?: Date;
    back?: Date;
    minPrice?: number;
    maxPrice?: number;
    national?: boolean;
    kind?: Category;
}

@Entity()
export class Ticket extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", { length: 255 })
    public destiny: string;

    @Column("timestamptz", { nullable: false })
    public departure: Date;

    @Column("timestamptz", { nullable: false })
    public back: Date;

    @Column("numeric")
    public price: number;

    @Column("boolean", { nullable: false })
    public national: boolean;

    @Column("varchar", { length: 5 })
    public kind: Category;

    constructor(destiny: string,
                departure: Date,
                back: Date,
                price: number,
                national: boolean,
                kind: Category,
        ){
        super();
        this.destiny = destiny;
        this.departure = departure;
        this.back = back;
        this.price = price;
        this.national = national;
        this.kind = kind;
    }
}