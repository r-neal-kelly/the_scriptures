import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as Segment from "./segment.js";

export class Instance
{
    private segment: Segment.Instance | null;
    private index: Index | null;
    private text: Text.Part.Instance | null;
    private value: string;

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
                this.value = ``;
            } else {
                this.value = text.Value()
                    .replace(/^ /, ` `)
                    .replace(/ $/, ` `)
                    .replace(/  /g, `  `);
            }
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
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

    Is_Indented():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `Part is blank and can't be indented.`,
        );

        return (
            this.Index() === 0 &&
            this.Segment().Index() === 0 &&
            this.Segment().Line().Text().Is_Indented()
        );
    }

    Value():
        string
    {
        return this.value;
    }
}
