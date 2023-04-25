import * as Utils from "../../../utils.js";
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
                        Events.FINDER_BODY_BEFORE_SEARCH,
                        this.Body().Finder().ID(),
                    ),
                    event_handler: this.On_Finder_Body_Before_Search,
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
        if (this.Model().Has_Empty_Results()) {
            if (this.Model().Expression().Value() === ``) {
                this.Element().textContent = null;
            } else {
                this.Element().textContent = this.Model().Results().Counts_As_String();
            }
        } else {
            this.Element().textContent = this.Model().Results().Counts_As_String();
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Info`);
        if (
            this.Model().Has_Empty_Results() &&
            this.Model().Expression().Value() === ``
        ) {
            classes.push(`Invisible`);
        }

        return classes;
    }

    private async On_Finder_Body_Before_Search():
        Promise<void>
    {
        (
            async function (
                this: Instance,
            ):
                Promise<void>
            {
                while (this.Is_Alive() && this.Model().Is_Info_Waiting()) {
                    const element: HTMLElement = this.Element();
                    if (element.textContent === `Searching.`) {
                        element.textContent = `Searching..`;
                    } else if (element.textContent === `Searching..`) {
                        element.textContent = `Searching...`;
                    } else {
                        element.textContent = `Searching.`;
                    }

                    await Utils.Wait_Milliseconds(200);
                }
            }.bind(this)
        )();
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
