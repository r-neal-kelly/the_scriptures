import * as Utils from "../../utils.js";
import * as Event from "../../event.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/instance.js";

import * as Selector from "./selector.js";
import * as Reader from "./reader.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

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
        super(
            {
                element: `div`,
                parent: root,
                event_grid: root.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Browser {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: auto auto;
                    justify-content: start;
                
                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    color: white;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Selector() ||
            !this.Has_Reader()
        ) {
            this.Abort_All_Children();

            new Selector.Instance(
                {
                    model: this.Model().Selector(),
                    browser: this,
                },
            );
            new Reader.Instance(
                {
                    model: this.Model().Reader(),
                    browser: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Browser`];
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Root():
        Entity.Instance
    {
        return this.Parent();
    }

    Has_Selector():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Selector.Instance
        );
    }

    Selector():
        Selector.Instance
    {
        Utils.Assert(
            this.Has_Selector(),
            `Does not have a selector.`,
        );

        return this.Child(0) as Selector.Instance;
    }

    Has_Reader():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Reader.Instance
        );
    }

    Reader():
        Reader.Instance
    {
        Utils.Assert(
            this.Has_Reader(),
            `Does not have a reader.`,
        );

        return this.Child(0) as Reader.Instance;
    }
}
