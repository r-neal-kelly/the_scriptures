import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model from "../../../model/buffer/search/instance.js";

import * as Entity from "../../entity.js";
import * as Text_Base from "../text_base.js";
import * as Line from "./line.js";

export class Instance extends Text_Base.Instance<
    Model.Instance
>
{
    constructor(
        {
            parent,
            model,
            event_grid_hook,
        }: {
            parent: Entity.Instance,
            model: () => Model.Instance,
            event_grid_hook: () => ID,
        },
    )
    {
        super(
            {
                parent: parent,
                model: model,
                event_grid_hook: event_grid_hook,
            },
        );

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        const event_listener_infos: Array<Event.Listener_Info> = super.On_Life();

        this.Add_This_CSS(
            `
                .Search_Text {
                    overflow-x: auto;
                    overflow-y: auto;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Search_Line {
                    border-bottom: solid 1px rgba(255, 255, 255, 0.5);
                }

                .Division {
                    display: inline-block;
                }

                .Highlighted_Division {
                    min-width: 3px;
                    
                    background-color: white;

                    color: black;
                }

                .Blank_Division {
                    display: none;

                    color: transparent;
                }
            `,
        );

        return event_listener_infos;
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = super.On_Reclass();

        classes.push(`Search_Text`);

        return classes;
    }

    Add_Line(
        line_index: Index,
    ):
        void
    {
        new Line.Instance(
            {
                buffer: this,
                model: () => this.Model().Line_At(line_index),
                index: line_index,
            },
        );
    }
}
