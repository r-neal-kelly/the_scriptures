import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model from "../../../model/buffer/text/instance.js";

import * as Entity from "../../entity.js";
import * as Line from "./line.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private event_grid_id: () => ID;

    constructor(
        {
            parent,
            model,
            event_grid_id,
        }: {
            parent: Entity.Instance,
            model: () => Model.Instance,
            event_grid_id: () => ID,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: parent,
                event_grid: parent.Event_Grid()
            },
        );

        this.model = model;
        this.event_grid_id = event_grid_id;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Text {
                    width: 100%;
                    padding: 12px 4px 36px 4px;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Line {
                    display: block;

                    color: inherit;
                }

                .Centered_Line {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;

                    text-align: center;
                }

                .Segment {
                    display: inline-block;

                    color: inherit;
                }

                .Item {
                    display: inline-block;

                    width: auto;

                    border-style: solid;
                    border-width: 0 0 2px 0;
                    border-color: transparent;

                    color: inherit;
                    font-style: normal;
                    font-weight: normal;
                    font-variant: normal;
                    text-decoration: none;
                }
                
                .Indented_Item {
                    width: 3em;
                }

                .Blank {
                    display: none;

                    color: transparent;
                }

                .Transparent {
                    color: transparent;
                }

                .Italic {
                    font-style: italic;
                }

                .Bold {
                    font-weight: bold;
                }

                .Underline {
                    text-decoration: underline;
                }

                .Small_Caps {
                    font-variant: small-caps;
                }

                .Error {
                    border-color: #ffcbcb;

                    color: #ffcbcb;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = Math.max(Model.Instance.Min_Line_Count(), model.Line_Count());
        const count: Count = this.Child_Count();

        for (let idx = count, end = target; idx < end; idx += 1) {
            new Line.Instance(
                {
                    text: this,
                    model: () => this.Model().Line_At(idx),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Text`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_ID():
        ID
    {
        return this.event_grid_id();
    }
}