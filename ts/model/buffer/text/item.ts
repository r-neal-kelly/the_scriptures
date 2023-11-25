import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Font from "../../font.js";
import * as Language from "../../language.js";
import * as Languages from "../../languages.js";
import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private buffer: Buffer.Instance;
    private segment: Segment.Instance | null;
    private index: Index | null;
    private text: Text.Item.Instance | null;
    private value: Text.Value;

    constructor(
        {
            buffer,
            segment,
            index,
            text,
        }: {
            buffer: Buffer.Instance,
            segment: Segment.Instance | null,
            index: Index | null,
            text: Text.Item.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.segment = segment;
        this.index = index;
        this.text = text;

        if (text == null) {
            Utils.Assert(
                segment == null,
                `segment must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );

            this.value = ``;
        } else {
            Utils.Assert(
                segment != null,
                `segment must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            if (text.Has_Image_Value()) {
                this.value = text.Image_Value();
            } else if (text.Has_Meta_Value()) {
                this.value = ``;
            } else {
                this.value = text.Value()
                    .replace(/^ /, ` `)
                    .replace(/ $/, ` `)
                    .replace(/  /g, `  `);

                this.value = Languages.Singleton().Adapt_Text_To_Font(
                    {
                        language_name: this.Language_Name(),
                        font_name: this.Font_Name(),
                        text: this.value,
                    },
                );
            }
        }
    }

    Buffer():
        Buffer.Instance
    {
        return this.buffer;
    }

    Segment():
        Segment.Instance
    {
        Utils.Assert(
            this.segment != null,
            `Doesn't have segment.`,
        );

        return this.segment as Segment.Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.index != null,
            `Doesn't have an index.`,
        );

        return this.index as Index;
    }

    Text():
        Text.Item.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Item.Instance;
    }

    Value():
        Text.Value
    {
        return this.value;
    }

    Part():
        Text.Part.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `Item is blank and doesn't have a part.`,
        );

        const text: Text.Item.Instance = this.Text();
        if (text.Is_Part()) {
            return (text as Text.Part.Instance);
        } else {
            return (text as Text.Split.Instance).Break();
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Has_Image_Value():
        boolean
    {
        return !this.Is_Blank() && this.Text().Has_Image_Value();
    }

    Is_Image_Value_Inline():
        boolean
    {
        return this.Has_Image_Value() && this.Text().Is_Image_Value_Inline();
    }

    Has_Inline_Image_Styles():
        boolean
    {
        return this.Is_Image_Value_Inline();
    }

    Some_Inline_Image_Styles():
        { [css_property: string]: string }
    {
        Utils.Assert(
            this.Has_Inline_Image_Styles(),
            `Does not have inline image styles.`,
        );

        let height;
        if (this.Has_Override_Font_Styles()) {
            height = this.Some_Override_Font_Styles()[`font-size`];
        } else {
            height = this.Buffer().Default_Font_Styles()[`font-size`];
        }

        return {
            "height": height,
        };
    }

    Is_Indented():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `Item is blank and can't be indented.`,
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
        return this.Part().Is_Error();
    }

    Has_Italic_Style():
        boolean
    {
        return this.Part().Has_Italic_Style();
    }

    Has_Bold_Style():
        boolean
    {
        return this.Part().Has_Bold_Style();
    }

    Has_Underline_Style():
        boolean
    {
        return this.Part().Has_Underline_Style();
    }

    Has_Small_Caps_Style():
        boolean
    {
        return this.Part().Has_Small_Caps_Style();
    }

    Has_Error_Style():
        boolean
    {
        return this.Part().Has_Error_Style();
    }

    Has_Argument_Style():
        boolean
    {
        return this.Part().Has_Argument_Style();
    }

    Has_Override_Language_Name():
        boolean
    {
        return this.Part().Language() != null;
    }

    Override_Language_Name():
        Language.Name | null
    {
        return this.Part().Language();
    }

    Some_Override_Language_Name():
        Language.Name
    {
        Utils.Assert(
            this.Has_Override_Language_Name(),
            `doesn't have an override language`,
        );

        return this.Part().Language() as Language.Name;
    }

    Language_Name():
        Language.Name
    {
        const override: Language.Name | null = this.Override_Language_Name();
        if (override != null) {
            return override;
        } else {
            return this.Buffer().Default_Language_Name();
        }
    }

    Override_Font_Name():
        Font.Name | null
    {
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
        const override: Font.Name | null = this.Override_Font_Name();
        if (override != null) {
            return override;
        } else {
            return this.Buffer().Default_Font_Name();
        }
    }

    Has_Override_Font_Styles():
        boolean
    {
        return this.Has_Override_Language_Name();
    }

    Some_Override_Font_Styles():
        { [css_property: string]: string }
    {
        Utils.Assert(
            this.Has_Override_Font_Styles(),
            `doesn't have override font styles`,
        );

        return this.Buffer().Override_Font_Styles(this.Some_Override_Language_Name());
    }

    Is_Greek():
        boolean
    {
        return this.Language_Name() === Language.Name.GREEK;
    }
}
