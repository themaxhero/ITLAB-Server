import { SelectQueryBuilder } from "typeorm";
declare module "typeorm" {
    class SelectQueryBuilder<Entity> {
        map(f: (qb: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>): 
            SelectQueryBuilder<Entity>;
    }
}

SelectQueryBuilder.prototype.map = function (f) {
    return f(this);
}