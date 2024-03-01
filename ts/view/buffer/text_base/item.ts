import { Float } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Language from "../../../model/language.js";
import { Script_Position } from "../../../model/script_position.js";

import * as Entity from "../../entity.js";

interface Model_Instance_i
{
    Is_Blank():
        boolean;

    Has_Image_Value():
        boolean;
    Is_Image_Value_Inline():
        boolean;
    Is_Indented():
        boolean;
    Is_Error():
        boolean;
    Has_Italic_Style():
        boolean;
    Has_Bold_Style():
        boolean;
    Has_Underline_Style():
        boolean;
    Has_Small_Caps_Style():
        boolean;
    Has_Superscript_Style():
        boolean;
    Has_Subscript_Style():
        boolean;
    Has_Error_Style():
        boolean;
    Has_Argument_Style():
        boolean;

    Override_Language_Name():
        Language.Name | null;

    Script_Position():
        Script_Position;
    Maybe_Size():
        Float | null;
}

interface Buffer_Instance_i
{
    Event_Grid_Hook():
        ID;

    Default_Font_Styles(
        {
            underlying_font_size_multiplier,
            script_position,
        }: {
            underlying_font_size_multiplier: Float,
            script_position: Script_Position,
        },
    ):
        { [css_property: string]: string };
    Override_Font_Styles(
        {
            language_name,
            underlying_font_size_multiplier,
            script_position,
        }: {
            language_name: Language.Name,
            underlying_font_size_multiplier: Float,
            script_position: Script_Position,
        },
    ):
        { [css_property: string]: string };
}

interface Segment_Instance_i<
    Buffer_Instance extends Buffer_Instance_i,
> extends Entity.Instance
{
    Buffer():
        Buffer_Instance;
}

export abstract class Instance<
    Model_Instance extends Model_Instance_i,
    Buffer_Instance extends Buffer_Instance_i,
    Segment_Instance extends Segment_Instance_i<Buffer_Instance>,
> extends Entity.Instance
{
    private model: () => Model_Instance;

    constructor(
        {
            segment,
            model,
        }: {
            segment: Segment_Instance,
            model: () => Model_Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: segment,
                event_grid: segment.Event_Grid(),
            },
        );

        this.model = model;
    }

    abstract override On_Refresh():
        void;

    override On_Reclass():
        Array<string>
    {
        const model: Model_Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Item`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else if (model.Has_Image_Value()) {
            classes.push(`Image_Item`);
        } else {
            if (model.Is_Indented()) {
                classes.push(`Indented_Item`);
            }
            if (model.Has_Italic_Style()) {
                classes.push(`Italic_Item`);
            }
            if (model.Has_Bold_Style()) {
                classes.push(`Bold_Item`);
            }
            if (model.Has_Underline_Style()) {
                classes.push(`Underlined_Item`);
            }
            if (model.Has_Small_Caps_Style()) {
                classes.push(`Small_Caps_Item`);
            }
            if (model.Has_Superscript_Style()) {
                classes.push(`Superscript_Item`);
            } else if (model.Has_Subscript_Style()) {
                classes.push(`Subscript_Item`);
            }
            if (
                model.Is_Error() ||
                model.Has_Error_Style()
            ) {
                classes.push(`Error_Item`);
            }
            if (model.Has_Argument_Style()) {
                classes.push(`Argument_Item`);
            }
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model_Instance = this.Model();

        if (!model.Is_Blank()) {
            const maybe_override_language_name: Language.Name | null =
                model.Override_Language_Name();
            const maybe_size: Float | null =
                model.Maybe_Size();

            if (model.Has_Image_Value()) {
                if (model.Is_Image_Value_Inline()) {
                    if (maybe_override_language_name != null) {
                        return {
                            "height":
                                this.Buffer().Override_Font_Styles(
                                    {
                                        language_name: maybe_override_language_name as Language.Name,
                                        underlying_font_size_multiplier: maybe_size || 1.0,
                                        script_position: model.Script_Position(),
                                    },
                                )[`font-size`],
                        };
                    } else {
                        return {
                            "height":
                                this.Buffer().Default_Font_Styles(
                                    {
                                        underlying_font_size_multiplier: maybe_size || 1.0,
                                        script_position: model.Script_Position(),
                                    },
                                )[`font-size`],
                        };
                    }
                } else {
                    // It might be nice to be able to control the size of block images too.
                    // But we need to examine the CSS closer before we start executing upon it.

                    return ``;
                }
            } else {
                if (maybe_override_language_name != null) {
                    return this.Buffer().Override_Font_Styles(
                        {
                            language_name: maybe_override_language_name as Language.Name,
                            underlying_font_size_multiplier: maybe_size || 1.0,
                            script_position: model.Script_Position(),
                        },
                    );
                } else if (maybe_size != null) {
                    return this.Buffer().Default_Font_Styles(
                        {
                            underlying_font_size_multiplier: maybe_size as Float,
                            script_position: model.Script_Position(),
                        },
                    );
                } else {
                    return ``;
                }
            }
        } else {
            return ``;
        }
    }

    Model():
        Model_Instance
    {
        return this.model();
    }

    Buffer():
        Buffer_Instance
    {
        return this.Segment().Buffer();
    }

    Segment():
        Segment_Instance
    {
        return this.Parent() as Segment_Instance;
    }
}
