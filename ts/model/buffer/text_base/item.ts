import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Font from "../../font.js";
import * as Text from "../../text.js";

interface Buffer_Instance_i
{
    Default_Language_Name():
        Language.Name;
    Default_Font_Name():
        Font.Name;
    Override_Font_Name(
        language_name: Language.Name,
    ): Font.Name;
}

interface Segment_Instance_i<
    Buffer_Instance,
>
{
    Buffer():
        Buffer_Instance;
}

export class Instance<
    Buffer_Instance extends Buffer_Instance_i,
    Segment_Instance extends Segment_Instance_i<Buffer_Instance>,
> extends Entity.Instance
{
    private segment: Segment_Instance | null;
    private index: Index | null;
    private text: Text.Item.Instance | null;

    constructor(
        {
            segment,
            index,
            text,
        }: {
            segment: Segment_Instance | null,
            index: Index | null,
            text: Text.Item.Instance | null,
        },
    )
    {
        super();

        this.segment = segment;
        this.index = index;
        this.text = text;

        if (segment == null) {
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
            Utils.Assert(
                text == null,
                `text must be null.`,
            );
        } else {
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
            Utils.Assert(
                text != null,
                `text must not be null.`,
            );
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Buffer():
        Buffer_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Segment().Buffer();
    }

    Segment():
        Segment_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.segment as Segment_Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.index as Index;
    }

    Text():
        Text.Item.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.text as Text.Item.Instance;
    }

    Part():
        Text.Part.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        const text: Text.Item.Instance = this.Text();
        if (text.Is_Part()) {
            return (text as Text.Part.Instance);
        } else {
            return (text as Text.Split.Instance).Break();
        }
    }

    Has_Image_Value():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Text().Has_Image_Value();
    }

    Is_Image_Value_Inline():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Text().Has_Image_Value() && this.Text().Is_Image_Value_Inline();
    }

    Is_Indented():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        const part: Text.Part.Instance = this.Part();

        return (
            part.Is_Command() &&
            (part as Text.Part.Command.Instance).Is_Indent()
        );
    }

    Is_Error():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Is_Error();
    }

    Has_Italic_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Has_Italic_Style();
    }

    Has_Bold_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Has_Bold_Style();
    }

    Has_Underline_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Has_Underline_Style();
    }

    Has_Small_Caps_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Has_Small_Caps_Style();
    }

    Has_Error_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Has_Error_Style();
    }

    Has_Argument_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Has_Argument_Style();
    }

    Default_Language_Name():
        Language.Name
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Buffer().Default_Language_Name();
    }

    Override_Language_Name():
        Language.Name | null
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Part().Language();
    }

    Language_Name():
        Language.Name
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        const override: Language.Name | null = this.Override_Language_Name();

        if (override != null) {
            return override;
        } else {
            return this.Default_Language_Name();
        }
    }

    Default_Font_Name():
        Font.Name
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Buffer().Default_Font_Name();
    }

    Override_Font_Name():
        Font.Name | null
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        const language_name: Language.Name | null = this.Override_Language_Name();

        if (language_name != null) {
            return this.Buffer().Override_Font_Name(language_name);
        } else {
            return null;
        }
    }

    Font_Name():
        Font.Name
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        const override: Font.Name | null = this.Override_Font_Name();

        if (override != null) {
            return override;
        } else {
            return this.Default_Font_Name();
        }
    }
}
