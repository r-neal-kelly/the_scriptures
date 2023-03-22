import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/instance.js";

import * as Selector from "./selector.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private root: Entity.Instance;
    private selector: Selector.Instance | null;

    constructor(
        {
            model,
            root,
        }: {
            model: Model.Instance,
            root: Entity.Instance,
        },
    )
    {
        super(`div`, root.Event_Grid());

        this.model = model;
        this.root = root;
        this.selector = null;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return ({
            "display": `grid`,

            "width": `100%`,
            "height": `100%`,

            "overflow-x": `hidden`,
            "overflow-y": `hidden`,

            "color": `white`,
        });
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.selector = new Selector.Instance(
            {
                model: this.Model().Selector(),
                browser: this,
            },
        );
        this.Add_Child(this.selector);
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Root():
        Entity.Instance
    {
        return this.root;
    }

    Selector():
        Selector.Instance
    {
        Utils.Assert(
            this.selector != null,
            `Does not have selector.`,
        );

        return this.selector as Selector.Instance;
    }
}
