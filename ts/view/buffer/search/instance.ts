import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model from "../../../model/buffer/search/instance.js";
import * as Model_Language from "../../../model/language.js";

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
        const model: Model.Instance = this.Model();

        this.Add_CSS(
            `
                .Left_To_Right {
                    direction: ltr;
                }

                .Right_To_Left {
                    direction: rtl;
                }
            `,
        );

        this.Add_This_CSS(
            `
                .Search {
                    width: 100%;
                    padding: 12px 4px 36px 4px;

                    overflow-x: auto;
                    overflow-y: auto;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Line {
                    display: block;

                    margin: 0.35em 0;
                    padding: 0 0;

                    border-bottom: solid 1px rgba(255, 255, 255, 0.5);

                    color: inherit;
                }

                .Column {
                    display: block;

                    margin: 0;
                    padding: 0;
                }

                .Row {
                    display: block;

                    margin: 0;
                    padding: 0;
                }

                .Centered_Row {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;

                    text-align: center;
                }

                .Padded_Row {
                    padding: 0 1em;
                    
                    border-style: solid;
                    border-width: 0 0 0 0;
                    border-color: rgba(255, 255, 255, 0.4);
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
                    width: ${model.Indent_EM()}em;
                }

                .Division {
                    display: inline-block;
                }

                .Highlighted_Division {
                    min-width: 3px;
                    
                    background-color: white;

                    color: black;
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

                .Argument {
                    
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
                    search: this,
                    model: () => this.Model().Line_At(idx),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = [];

        classes.push(`Search`);
        if (this.Model().Default_Text_Direction() === Model_Language.Direction.LEFT_TO_RIGHT) {
            classes.push(`Left_To_Right`);
        } else {
            classes.push(`Right_To_Left`);
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        return this.Model().Default_Text_Styles();
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
