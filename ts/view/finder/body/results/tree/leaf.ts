import * as Event from "../../../../../event.js";

import * as Model from "../../../../../model/finder/body/results/tree/leaf.js";

import * as Entity from "../../../../entity.js";
import * as Tree from "./instance.js";
import * as Leaves from "./leaves.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            parent,
            model,
        }: {
            parent: Leaves.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: parent,
                event_grid: parent.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [];
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Name();
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Leaf`);
        if (model.Is_Selected()) {
            classes.push(`Selected`);
        }

        return classes;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Tree():
        Tree.Instance
    {
        let parent: Entity.Instance = this.Parent();
        while (!(parent instanceof Tree.Instance)) {
            parent = parent.Parent();
        }

        return parent as Tree.Instance;
    }
}
