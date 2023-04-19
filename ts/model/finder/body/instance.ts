import * as Entity from "../../entity.js";
import * as Filter from "./filter.js";

export class Instance extends Entity.Instance
{
    private filter: Filter.Instance;

    constructor()
    {
        super();

        this.filter = new Filter.Instance({});

        this.Add_Dependencies(
            [
                this.filter,
            ],
        );
    }

    Filter():
        Filter.Instance
    {
        return this.filter;
    }
}
