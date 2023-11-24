import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model_Language from "../../../model/language.js";

import * as Entity from "../../entity.js";

export interface Model_Instance_i
{
    Min_Line_Count(): Count;
    Line_Count(): Count;
    Line_At(line_index: Index): any;

    Default_Text_Direction(): Model_Language.Direction;
    Default_Font_Styles(): { [css_property: string]: string };

    Indent_EM(): Count;
}

export interface Line_Class_i
{
    new(
        {
            buffer,
            model,
        }: {
            buffer: any,
            model: () => any,
        },
    ): any;
}

export class Instance<
    Model_Instance extends Model_Instance_i,
> extends Entity.Instance
{
    private model: () => Model_Instance;
    private event_grid_id: () => ID;
    private line_class: Line_Class_i;

    constructor(
        {
            parent,
            model,
            event_grid_id,
            line_class,
        }: {
            parent: Entity.Instance,
            model: () => Model_Instance,
            event_grid_id: () => ID,
            line_class: Line_Class_i,
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
        this.line_class = line_class;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        const model: Model_Instance = this.Model();

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
                    justify-items: stretch;
                    align-items: stretch;
                    justify-content: stretch;
                    align-content: stretch;

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
                    align-items: stretch;
                    justify-content: stretch;
                    align-content: stretch;

                    width: 100%;

                    margin: 0.35em 0;
                    padding: 0 0;

                    color: inherit;
                }

                .Tabular_Line {
                    justify-self: center;
                    align-self: center;

                    margin: 0 10%;
                    padding: 0.35em;

                    border-bottom: solid 1px rgba(255, 255, 255, 0.3);
                    border-left: solid 1px rgba(255, 255, 255, 0.3);
                    border-right: solid 1px rgba(255, 255, 255, 0.3);
                }

                .First_Tabular_Line {
                    border-top: solid 1px rgba(255, 255, 255, 0.3);
                }

                .Marginal_Line {

                }

                .Interlinear_Line {
                    display: flex;
                    flex-wrap: wrap;
                    column-gap: 0;
                    row-gap: 0;

                    margin: 0.20em 0em 0.35em 0em;
                }

                .Forward_Interlinear_Line {
                    flex-direction: row;
                }

                .Reverse_Interlinear_Line {
                    flex-direction: row-reverse;
                }

                .Centered_Interlinear_Line {
                    justify-content: center;    
                }

                .Padded_Interlinear_Line {
                    justify-self: stretch;
                    align-self: stretch;

                    width: auto;
                    
                    padding: 0 1em;
                    
                    border-style: solid;
                    border-width: 0 0 0 0;
                    border-color: rgba(255, 255, 255, 0.4);
                }
                
                .Column {
                    display: grid;
                    column-gap: 0;
                    justify-items: stretch;
                    align-items: stretch;
                    justify-content: stretch;
                    align-content: stretch;

                    margin: 0;
                    padding: 0;
                }

                .Marginal_Column {
                    font-size: .85em;
                }

                .Inter_Marginal_Column {
                    
                }

                .Interlinear_Column {
                    align-items: center;

                    padding: 0.15em 0;
                    
                    border-bottom: solid 1px rgba(255, 255, 255, 0.3);
                }

                .Inter_Interlinear_Column {
                    align-items: center;
                    
                    padding: 0.15em 0;
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
        const model: Model_Instance = this.Model();
        const count: Count = this.Child_Count();
        const target: Count = Math.max(model.Min_Line_Count(), model.Line_Count());

        for (let idx = count, end = target; idx < end; idx += 1) {
            new (this.Line_Class())(
                {
                    buffer: this,
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
        Model_Instance
    {
        return this.model();
    }

    Event_Grid_ID():
        ID
    {
        return this.event_grid_id();
    }

    Line_Class():
        Line_Class_i
    {
        return this.line_class;
    }
}
