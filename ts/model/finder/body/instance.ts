import * as Entity from "../../entity.js";
import * as Selector from "../../selector.js";

export class Instance extends Entity.Instance
{
    private filter: Selector.Instance;

    constructor()
    {
        super();

        this.filter = new Selector.Instance(
            {
                does_smart_item_selection: false,
            },
        );

        this.Add_Dependencies(
            [
                this.filter,
            ],
        );
    }

    Filter():
        Selector.Instance
    {
        return this.filter;
    }
}
