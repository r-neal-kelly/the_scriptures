import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as Segments from "./segments.js";
import * as Parts from "./parts.js";

export class Instance
{
    private segments: Segments.Instance | null;
    private index: Index | null;
    private text: Text.Segment.Instance | null;
    private parts: Parts.Instance;

    constructor(
        {
            segments,
            index,
            text,
        }: {
            segments: Segments.Instance | null,
            index: Index | null,
            text: Text.Segment.Instance | null,
        },
    )
    {
        this.segments = segments;
        this.index = index;
        this.text = text;
        this.parts = new Parts.Instance(
            {
                segment: this,
                text: text,
            },
        );

        if (text == null) {
            Utils.Assert(
                segments == null,
                `segments must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                segments != null,
                `segments must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
        }
    }

    Segments():
        Segments.Instance
    {
        Utils.Assert(
            this.segments != null,
            `Doesn't have segments.`,
        );

        return this.segments as Segments.Instance;
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
        Text.Segment.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Segment.Instance;
    }

    Parts():
        Parts.Instance
    {
        return this.parts;
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }
}
