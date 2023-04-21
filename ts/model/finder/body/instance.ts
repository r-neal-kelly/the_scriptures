import * as Entity from "../../entity.js";
import * as Selector from "../../selector.js";
import * as Finder from "../instance.js";
import * as Expression from "./expression.js";

export class Instance extends Entity.Instance
{
    private finder: Finder.Instance;
    private filter: Selector.Instance;
    private expression: Expression.Instance;

    constructor(
        {
            finder,
        }: {
            finder: Finder.Instance,
        },
    )
    {
        super();

        this.finder = finder;
        this.filter = new Selector.Instance(
            {
                does_smart_item_selection: false,
            },
        );
        this.expression = new Expression.Instance(
            {
                body: this,
            },
        );

        this.Add_Dependencies(
            [
                this.filter,
                this.expression,
            ],
        );
    }

    Finder():
        Finder.Instance
    {
        return this.finder;
    }

    Filter():
        Selector.Instance
    {
        return this.filter;
    }

    Expression():
        Expression.Instance
    {
        return this.expression;
    }
}
