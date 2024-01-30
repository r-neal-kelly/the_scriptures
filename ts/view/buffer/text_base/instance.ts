import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Language from "../../../model/language.js";
import * as Languages from "../../../model/languages.js";
import * as Font from "../../../model/font.js";

import * as Entity from "../../entity.js";

export interface Model_Instance_i
{
    Default_Language_Name():
        Language.Name;
    Default_Language_Direction():
        Language.Direction;
    Default_Font_Name():
        Font.Name;
    Override_Font_Name(
        language_name: Language.Name,
    ): Font.Name;

    Line_Buffer_Count():
        Count;
    Line_Count():
        Count;
}

export abstract class Instance<
    Model_Instance extends Model_Instance_i,
> extends Entity.Instance
{
    private model: () => Model_Instance;
    private event_grid_hook: () => ID;

    constructor(
        {
            parent,
            model,
            event_grid_hook,
        }: {
            parent: Entity.Instance,
            model: () => Model_Instance,
            event_grid_hook: () => ID,
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
        this.event_grid_hook = event_grid_hook;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
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

                    margin: 0;
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

                .Fully_Tabular_Column {
                    align-items: center;
                    align-content: center;
                }

                .Row {
                    display: block;

                    margin: 0;
                    padding: 0;
                }

                .Transparent_Row {
                    color: transparent;
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
                    width: ${this.Indent_EM()}em;
                }

                .Image_Item {
                    max-width: 100%;
                    max-height: 90vh;

                    vertical-align: middle;
                }

                .Italic_Item {
                    font-style: italic;
                }

                .Bold_Item {
                    font-weight: bold;
                }

                .Underlined_Item {
                    text-decoration: underline;
                }

                .Small_Caps_Item {
                    font-variant: small-caps;
                }

                .Superscript_Item {
                    /* font-variant-position might be nice, but still experimental in chromium */

                    font-size: 0.6em;
                    line-height: 0.7em;
                    vertical-align: super;
                }

                .Subscript_Item {
                    /* font-variant-position might be nice, but still experimental in chromium */

                    font-size: 0.6em;
                    line-height: 0.7em;
                    vertical-align: sub;
                }

                .Error_Item {
                    border-color: #ffcbcb;

                    color: #ffcbcb;
                }

                .Argument_Item {
                    
                }

                .Blank {
                    display: none;

                    color: transparent;
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
        const target: Count = Math.max(model.Line_Buffer_Count(), model.Line_Count());

        if (count < target) {
            for (let idx = count, end = target; idx < end; idx += 1) {
                this.Add_Line(idx);
            }
        } else if (count > target) {
            for (let idx = count, end = target; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = [];

        classes.push(`Text`);
        if (this.Model().Default_Language_Direction() === Language.Direction.LEFT_TO_RIGHT) {
            classes.push(`Left_To_Right`);
        } else {
            classes.push(`Right_To_Left`);
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        return this.Default_Font_Styles();
    }

    override On_Resize():
        void
    {
        this.Skip_Children();
    }

    Model():
        Model_Instance
    {
        return this.model();
    }

    Event_Grid_Hook():
        ID
    {
        return this.event_grid_hook();
    }

    abstract Add_Line(
        line_index: Index,
    ): void;

    Indent_EM():
        Count
    {
        return 3;
    }

    Pad_EM(
        pad_count: Count,
    ):
        Count
    {
        if (pad_count > 0) {
            return this.Indent_EM() * pad_count;
        } else {
            return 0;
        }
    }

    Default_Font_Styles():
        { [css_property: string]: string }
    {
        const model: Model_Instance = this.Model();

        return Languages.Singleton().Font_Styles(
            model.Default_Language_Name(),
            model.Default_Font_Name(),
        );
    }

    Override_Font_Styles(
        language_name: Language.Name,
    ):
        { [css_property: string]: string }
    {
        const model: Model_Instance = this.Model();

        return Languages.Singleton().Font_Styles(
            language_name,
            model.Override_Font_Name(language_name),
        );
    }
}
