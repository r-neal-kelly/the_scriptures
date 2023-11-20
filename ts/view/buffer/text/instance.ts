import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model from "../../../model/buffer/text.js";
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
                .Text {
                    display: grid;
                    justify-items: center;
                    align-items: center;
                    justify-content: center;
                    align-content: center;

                    width: 100%;
                    padding: 12px 4px 36px 4px;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Line {
                    display: grid;
                    column-gap: 3%;
                    row-gap: 0;
                    justify-items: stretch;
                    align-items: stretch; /* maybe center, but it's harder to read? */
                    justify-content: stretch;
                    align-content: stretch;

                    width: 100%;

                    margin: 0.35em 0;
                    padding: 0 0;

                    color: inherit;
                }

                .Multi_Column_Line {
                    margin: 0 10%;
                    padding: 0.35em;

                    border-bottom: solid 1px rgba(255, 255, 255, 0.3);
                    border-left: solid 1px rgba(255, 255, 255, 0.3);
                    border-right: solid 1px rgba(255, 255, 255, 0.3);
                }

                .First_Multi_Column_Line {
                    border-top: solid 1px rgba(255, 255, 255, 0.3);
                }
                
                .Column {
                    display: grid;
                    column-gap: 0;
                    row-gap: 3%;
                    justify-items: stretch;
                    align-items: stretch;
                    justify-content: stretch;
                    align-content: stretch;

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

                .Blank {
                    display: none;

                    color: transparent;
                }

                .Image {
                    max-width: 100%;
                    max-height: 90vh;

                    vertical-align: middle;
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
                    text: this,
                    model: () => this.Model().Line_At(idx),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = [];

        classes.push(`Text`);
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
        return this.Model().Default_Font_Styles();
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
