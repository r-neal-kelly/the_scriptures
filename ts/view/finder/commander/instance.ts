import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/finder.js";

import * as Entity from "../../entity.js";
import * as Filter_Visibility from "./filter_visibility.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            parent,
        }: {
            model: () => Model.Instance,
            parent: Entity.Instance,
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
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Commander {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    justify-items: center;
                    align-content: space-around;
                    align-items: center;

                    padding: 4px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 0 1px 0;

                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Filter_Visibility()
        ) {
            this.Abort_All_Children();

            new Filter_Visibility.Instance(
                {
                    model: () => this.Model(),
                    parent: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Commander`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Has_Filter_Visibility():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Filter_Visibility.Instance
        );
    }

    Filter_Visibility():
        Filter_Visibility.Instance
    {
        Utils.Assert(
            this.Has_Filter_Visibility(),
            `Does not have Filter_Visibility.`,
        );

        return this.Child(0) as Filter_Visibility.Instance;
    }
}
