import { Count } from "../../../../types.js";

import * as Event from "../../../../event.js";
import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file.js";

import * as Reader from "../instance.js";
import * as Line from "./line.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            reader,
        }: {
            model: () => Model.Instance,
            reader: Reader.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: reader,
                event_grid: reader.Event_Grid()
            },
        );

        this.model = model;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_Children_CSS(
            `
                /* Lines */
                .Line {
                    display: block;

                    color: inherit;
                }

                .Blank_Line {
                    display: none;

                    color: transparent;
                }

                .New_Line {
                    color: transparent;
                }

                .Centered_Line {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                /* Segments */
                .Segment {
                    display: inline-block;

                    color: inherit;
                }

                .Blank_Segment {
                    display: none;

                    color: transparent;
                }

                /* Parts */
                .Part {
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

                .Blank_Part {
                    display: none;
                }
                
                .Indented_Part {
                    width: 3em;
                }

                .Italic_Part {
                    font-style: italic;
                }

                .Bold_Part {
                    font-weight: bold;
                }

                .Underline_Part {
                    text-decoration: underline;
                }

                .Small_Caps_Part {
                    font-variant: small-caps;
                }

                .Error_Part {
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
                    model: () => this.Model().Line_At(idx),
                    file: this,
                },
            );
        }
    }

    override On_Restyle():
        string
    {
        return `
            width: 100%;
            padding: 0 4px;
        `;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }
}
