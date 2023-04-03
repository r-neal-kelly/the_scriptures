import * as Utils from "../../../../../utils.js";
import * as Entity from "../../../../../entity.js";

import * as Model from "../../../../../model/browser/body/selector/slot/instance.js";

import * as Slots from "../slots.js";
import * as Title from "./title.js";
import * as Items from "./items.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            slots,
        }: {
            model: () => Model.Instance,
            slots: Slots.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: slots,
                event_grid: slots.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (
            !this.Has_Title() ||
            !this.Has_Items()
        ) {
            this.Abort_All_Children();

            new Title.Instance(
                {
                    model: () => this.Model().Title(),
                    slot: this,
                },
            );
            new Items.Instance(
                {
                    model: () => this.Model().Items(),
                    slot: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Slot`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Slots():
        Slots.Instance
    {
        return this.Parent() as Slots.Instance;
    }

    Has_Title():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Title.Instance
        );
    }

    Title():
        Title.Instance
    {
        Utils.Assert(
            this.Has_Title(),
            `Does not have title.`,
        );

        return this.Child(0) as Title.Instance;
    }

    Has_Items():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Items.Instance
        );
    }

    Items():
        Items.Instance
    {
        Utils.Assert(
            this.Has_Items(),
            `Does not have items.`,
        );

        return this.Child(1) as Items.Instance;
    }
}
