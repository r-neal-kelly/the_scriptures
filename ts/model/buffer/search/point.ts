import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private segment: Segment.Instance | null;
    private index: Index | null;
    private text: Text.Part.Instance | null;
    private value: Text.Value;

    constructor(
        {
            segment,
            index,
            text,
        }: {
            segment: Segment.Instance | null,
            index: Index | null,
            text: Text.Part.Instance | null,
        },
    )
    {
        super();

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

            if (text.Is_Command()) {
                // Do we do this only when there is no match for it?
                this.value = ``;
            } else {
                this.value = text.Value()
                    .replace(/^ /, ` `)
                    .replace(/ $/, ` `)
                    .replace(/  /g, `  `);
            }
        }

        this.Add_Dependencies(
            [
            ],
        );
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
        Text.Part.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Part.Instance;
    }

    Value():
        Text.Value
    {
        return this.value;
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
            `Point is blank and can't be indented.`,
        );

        const part: Text.Part.Instance = this.Text();
        return (
            part.Is_Command() &&
            (part as Text.Part.Command.Instance).Is_Indent()
        );
    }

    Is_Error():
        boolean
    {
        return this.Text().Is_Error();
    }

    Has_Italic_Style():
        boolean
    {
        return this.Text().Has_Italic_Style();
    }

    Has_Bold_Style():
        boolean
    {
        return this.Text().Has_Bold_Style();
    }

    Has_Underline_Style():
        boolean
    {
        return this.Text().Has_Underline_Style();
    }

    Has_Small_Caps_Style():
        boolean
    {
        return this.Text().Has_Small_Caps_Style();
    }

    Has_Error_Style():
        boolean
    {
        return this.Text().Has_Error_Style();
    }
}
