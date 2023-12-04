import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/finder/body/instance.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Finder from "../instance.js";
import * as Filter from "../../selector.js";
import * as Expression from "./expression.js";
import * as Info from "./info.js";
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
                    grid-template-rows: auto auto auto 1fr;
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

                    height: 100%;

                    background-color: hsl(0, 0%, 0%, 0.7);

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Expression {
                    display: grid;
                    grid-template-rows: 1fr auto;
                    grid-template-columns: 1fr;

                    width: 100%;
                    height: 100%;
                    padding: 2px;

                    position: relative;

                    border-style: solid;
                    border-width: 0 0 1px 0;
                    border-color: white;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Expression_Placeholder {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: -1;

                    width: 100%;
                    height: 100%;

                    color: hsl(255, 100%, 100%, 0.8);
                    text-align: center;
                }

                .Expression_Input {
                    width: 100%;
                    height: 100%;

                    background-color: transparent;

                    text-align: center;
                }

                .Expression_Help {
                    width: 100%;
                    height: 100%;

                    color: #ffcbcb;
                    text-align: center;
                }

                .Info {
                    width: 100%;
                    height: 100%;
                    padding: 2px;

                    border-style: solid;
                    border-width: 0 0 1px 0;
                    border-color: white;

                    color: white;
                    text-align: center;
                    font-size: 0.8em;
                }

                .Results {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: auto 1fr;
                    justify-content: start;

                    position: relative;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Tree {
                    overflow-x: auto;
                    overflow-y: auto;
                }

                .List {
                    overflow-x: auto;
                    overflow-y: auto;
                }

                .Invisible {
                    display: none;
                }
            `,
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.SELECTOR_TOGGLE,
                        this.Finder().ID(),
                    ),
                    event_handler: this.After_Selector_Toggle,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_EXPRESSION_ENTER,
                        this.Finder().ID(),
                    ),
                    event_handler: this.On_Finder_Body_Expression_Enter,
                    event_priority: 10,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_TREE_LEAF_SELECT,
                        this.Finder().ID(),
                    ),
                    event_handler: this.On_Finder_Body_Tree_Leaf_Select,
                    event_priority: 10,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Filter() ||
            !this.Has_Expression() ||
            !this.Has_Info() ||
            !this.Has_Results()
        ) {
            this.Abort_All_Children();

            new Filter.Instance(
                {
                    parent: this,
                    model: () => this.Model().Filter(),
                    event_grid_hook: () => this.Finder().ID(),
                    is_visible: () => this.Model().Finder().Commander().Filter_Visibility().Is_Toggled(),
                },
            );
            new Expression.Instance(
                {
                    body: this,
                    model: () => this.Model().Expression(),
                },
            );
            new Info.Instance(
                {
                    body: this,
                    model: () => this.Model(),
                },
            );
            new Results.Instance(
                {
                    body: this,
                    model: () => this.Model().Results(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Body`];
    }

    private async After_Selector_Toggle():
        Promise<void>
    {
        this.Filter().Refresh();
    }

    private async On_Finder_Body_Expression_Enter():
        Promise<void>
    {
        this.Model().Set_Is_Info_Waiting(true);

        await this.Send(
            new Event.Info(
                {
                    affix: Events.FINDER_BODY_BEFORE_SEARCH,
                    suffixes: [
                        this.Finder().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );

        await this.Model().Search();

        this.Model().Set_Is_Info_Waiting(false);

        await this.Send(
            new Event.Info(
                {
                    affix: Events.FINDER_BODY_AFTER_SEARCH,
                    suffixes: [
                        this.Finder().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );

        this.Refresh();
    }

    private async On_Finder_Body_Tree_Leaf_Select():
        Promise<void>
    {
        this.Refresh();
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
            this.Child(0) instanceof Filter.Instance
        );
    }

    Filter():
        Filter.Instance
    {
        Utils.Assert(
            this.Has_Filter(),
            `Does not have Filter.`,
        );

        return this.Child(0) as Filter.Instance;
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

    Has_Info():
        boolean
    {
        return (
            this.Has_Child(2) &&
            this.Child(2) instanceof Info.Instance
        );
    }

    Info():
        Info.Instance
    {
        Utils.Assert(
            this.Has_Info(),
            `Does not have Info.`,
        );

        return this.Child(2) as Info.Instance;
    }

    Has_Results():
        boolean
    {
        return (
            this.Has_Child(3) &&
            this.Child(3) instanceof Results.Instance
        );
    }

    Results():
        Results.Instance
    {
        Utils.Assert(
            this.Has_Results(),
            `Does not have Results.`,
        );

        return this.Child(3) as Results.Instance;
    }
}
