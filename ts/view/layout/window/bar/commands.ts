import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";
import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/layout/window/bar/commands.js";

import * as Bar from "./instance.js";
import * as Minimize from "./minimize.js";
import * as Maximize from "./maximize.js";
import * as Close from "./close.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            bar,
        }: {
            model: () => Model.Instance;
            bar: Bar.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: bar,
                event_grid: bar.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Minimize() ||
            !this.Has_Maximize() ||
            !this.Has_Close()
        ) {
            this.Abort_All_Children();

            new Minimize.Instance(
                {
                    model: () => this.Model().Minimize(),
                    commands: this,
                },
            );
            new Maximize.Instance(
                {
                    model: () => this.Model().Maximize(),
                    commands: this,
                },
            );
            new Close.Instance(
                {
                    model: () => this.Model().Close(),
                    commands: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Commands`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Bar():
        Bar.Instance
    {
        return this.Parent() as Bar.Instance;
    }

    Has_Minimize():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Minimize.Instance
        );
    }

    Minimize():
        Minimize.Instance
    {
        Utils.Assert(
            this.Has_Minimize(),
            `Does not have a minimize.`,
        );

        return this.Child(0) as Minimize.Instance;
    }

    Has_Maximize():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Maximize.Instance
        );
    }

    Maximize():
        Maximize.Instance
    {
        Utils.Assert(
            this.Has_Maximize(),
            `Does not have a maximize.`,
        );

        return this.Child(1) as Maximize.Instance;
    }

    Has_Close():
        boolean
    {
        return (
            this.Has_Child(2) &&
            this.Child(2) instanceof Close.Instance
        );
    }

    Close():
        Close.Instance
    {
        Utils.Assert(
            this.Has_Close(),
            `Does not have a close.`,
        );

        return this.Child(2) as Close.Instance;
    }
}
