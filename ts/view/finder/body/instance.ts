import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/finder.js";

import * as Entity from "../../entity.js";
import * as Finder from "../instance.js";
import * as Selector from "../../selector.js";
import * as Expression from "./expression.js";
import * as Results from "./results.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            finder,
            model,
        }: {
            finder: Finder.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: finder,
                event_grid: finder.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Body {
                    display: grid;
                    grid-template-rows: auto 1fr 5fr;
                    grid-template-columns: 1fr;
                    justify-content: start;

                    position: relative;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Filter {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;

                    width: 100%;
                    height: 100%;

                    background-color: hsl(0, 0%, 0%, 0.7);

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Expression {
                    width: 100%;
                    height: 100%;
                    padding: 2px;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Results {

                }

                .Invisible {
                    display: none;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Filter() ||
            !this.Has_Expression() ||
            !this.Has_Results()
        ) {
            this.Abort_All_Children();

            new Selector.Instance(
                {
                    parent: this,
                    model: () => this.Model().Body().Filter(),
                    event_grid_id: () => this.Finder().ID(),
                    is_visible: () => this.model().Commander().Filter_Visibility().Is_Toggled(),
                },
            );
            new Expression.Instance(
                {
                    body: this,
                    model: () => this.Model(),
                },
            );
            new Results.Instance(
                {
                    body: this,
                    model: () => this.Model(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Body`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Finder():
        Finder.Instance
    {
        return this.Parent() as Finder.Instance;
    }

    Has_Filter():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Selector.Instance
        );
    }

    Filter():
        Selector.Instance
    {
        Utils.Assert(
            this.Has_Filter(),
            `Does not have Filter.`,
        );

        return this.Child(0) as Selector.Instance;
    }

    Has_Expression():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Expression.Instance
        );
    }

    Expression():
        Expression.Instance
    {
        Utils.Assert(
            this.Has_Expression(),
            `Does not have Expression.`,
        );

        return this.Child(1) as Expression.Instance;
    }

    Has_Results():
        boolean
    {
        return (
            this.Has_Child(2) &&
            this.Child(2) instanceof Results.Instance
        );
    }

    Results():
        Results.Instance
    {
        Utils.Assert(
            this.Has_Results(),
            `Does not have Results.`,
        );

        return this.Child(2) as Results.Instance;
    }
}
