import * as Utils from "../../../../utils.js";

import * as Model from "../../../../model/finder/body/expression.js";

import * as Entity from "../../../entity.js";
import * as Body from "../instance.js";
import * as Placeholder from "./placeholder.js";
import * as Input from "./input.js";
import * as Help from "./help.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            body,
            model,
        }: {
            body: Body.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: body,
                event_grid: body.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Placeholder() ||
            !this.Has_Input() ||
            !this.Has_Help()
        ) {
            this.Abort_All_Children();

            new Placeholder.Instance(
                {
                    expression: this,
                    model: () => this.Model(),
                },
            );
            new Input.Instance(
                {
                    expression: this,
                    model: () => this.Model(),
                },
            );
            new Help.Instance(
                {
                    expression: this,
                    model: () => this.Model(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Expression`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Body():
        Body.Instance
    {
        return this.Parent() as Body.Instance;
    }

    Has_Placeholder():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Placeholder.Instance
        );
    }

    Placeholder():
        Placeholder.Instance
    {
        Utils.Assert(
            this.Has_Placeholder(),
            `Does not have Placeholder.`,
        );

        return this.Child(0) as Placeholder.Instance;
    }

    Has_Input():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Input.Instance
        );
    }

    Input():
        Input.Instance
    {
        Utils.Assert(
            this.Has_Input(),
            `Does not have Input.`,
        );

        return this.Child(1) as Input.Instance;
    }

    Has_Help():
        boolean
    {
        return (
            this.Has_Child(2) &&
            this.Child(2) instanceof Help.Instance
        );
    }

    Help():
        Help.Instance
    {
        Utils.Assert(
            this.Has_Help(),
            `Does not have Help.`,
        );

        return this.Child(2) as Help.Instance;
    }
}
