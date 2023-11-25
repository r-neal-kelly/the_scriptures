import { ID } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Language from "../../../model/language.js";

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
    Has_Error_Style():
        boolean;
    Has_Argument_Style():
        boolean;

    Override_Language_Name():
        Language.Name | null;
}

interface Buffer_Instance_i
{
    Event_Grid_ID():
        ID;

    Default_Font_Styles():
        { [css_property: string]: string };
    Override_Font_Styles(
        language_name: Language.Name,
    ): { [css_property: string]: string };
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

    abstract override On_Restyle():
        string | { [index: string]: string; };

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

    Event_Grid_ID():
        ID
    {
        return this.Buffer().Event_Grid_ID();
    }

    Has_Override_Font_Styles():
        boolean
    {
        const model: Model_Instance = this.Model();

        Utils.Assert(
            !model.Is_Blank(),
            `item is blank.`,
        );

        return model.Override_Language_Name() != null;
    }

    Override_Font_Styles():
        { [css_property: string]: string }
    {
        const model: Model_Instance = this.Model();

        Utils.Assert(
            !model.Is_Blank(),
            `item is blank.`,
        );
        Utils.Assert(
            this.Has_Override_Font_Styles(),
            `Does not have override font styles.`,
        );

        return this.Buffer().Override_Font_Styles(model.Override_Language_Name() as Language.Name);
    }

    Has_Inline_Image_Styles():
        boolean
    {
        const model: Model_Instance = this.Model();

        Utils.Assert(
            !model.Is_Blank(),
            `item is blank.`,
        );

        return model.Is_Image_Value_Inline();
    }

    Inline_Image_Styles():
        { [css_property: string]: string }
    {
        const model: Model_Instance = this.Model();

        Utils.Assert(
            !model.Is_Blank(),
            `item is blank.`,
        );
        Utils.Assert(
            this.Has_Inline_Image_Styles(),
            `Does not have inline image styles.`,
        );

        let height;
        if (model.Override_Language_Name() != null) {
            height = this.Override_Font_Styles()[`font-size`];
        } else {
            height = this.Buffer().Default_Font_Styles()[`font-size`];
        }

        return {
            "height": height,
        };
    }
}
