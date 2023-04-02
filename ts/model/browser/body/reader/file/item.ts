import { Index } from "../../../../../types.js";

import * as Utils from "../../../../../utils.js";

import * as Text from "../../../../text.js";

import * as Segment from "./segment.js";

export class Instance
{
    private segment: Segment.Instance | null;
    private index: Index | null;
    private text: Text.Item.Instance | null;
    private value: Text.Value;

    constructor(
        {
            segment,
            index,
            text,
        }: {
            segment: Segment.Instance | null,
            index: Index | null,
            text: Text.Item.Instance | null,
        },
    )
    {
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

            if (text.Is_Part() && (text as Text.Part.Instance).Is_Command()) {
                this.value = ``;
            } else {
                this.value = text.Value()
                    .replace(/^ /, ` `)
                    .replace(/ $/, ` `)
                    .replace(/  /g, `  `);
            }
        }
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

    Is_Indented():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `Item is blank and can't be indented.`,
        );

        return (
            this.Index() === 0 &&
            this.Segment().Index() === 0 &&
            this.Segment().Line().Text().Is_Indented()
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
}
