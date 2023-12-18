import * as Event from "../../../event.js";

import * as Model from "../../../model/finder/body.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Body from "./instance.js";

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

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_DURING_SEARCH,
                        this.Body().Finder().ID(),
                    ),
                    event_handler: this.On_Finder_Body_During_Search,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_AFTER_SEARCH,
                        this.Body().Finder().ID(),
                    ),
                    event_handler: this.On_Finder_Body_After_Search,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Is_Waiting()) {
            this.Element().textContent = model.Waiting_Message();
        } else {
            if (model.Has_Empty_Results()) {
                if (model.Expression().Value() === ``) {
                    this.Element().textContent = null;
                } else {
                    this.Element().textContent = model.Results().Counts_As_String();
                }
            } else {
                this.Element().textContent = model.Results().Counts_As_String();
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Info`);
        if (
            !model.Is_Waiting() &&
            model.Has_Empty_Results() &&
            model.Expression().Value() === ``
        ) {
            classes.push(`Invisible`);
        }

        return classes;
    }

    private async On_Finder_Body_During_Search():
        Promise<void>
    {
        this.Refresh();
    }

    private async On_Finder_Body_After_Search():
        Promise<void>
    {
        this.Refresh();
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
}
