import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as Parts from "./parts.js";

export class Instance
{
    private parts: Parts.Instance | null;
    private index: Index | null;
    private text: Text.Part.Instance | null;

    constructor(
        {
            parts,
            index,
            text,
        }: {
            parts: Parts.Instance | null,
            index: Index | null,
            text: Text.Part.Instance | null,
        },
    )
    {
        this.parts = parts;
        this.index = index;
        this.text = text;

        if (text == null) {
            Utils.Assert(
                parts == null,
                `parts must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                parts != null,
                `parts must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
        }
    }

    Parts():
        Parts.Instance
    {
        Utils.Assert(
            this.parts != null,
            `Doesn't have parts.`,
        );

        return this.parts as Parts.Instance;
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

    Is_Blank():
        boolean
    {
        return this.text == null;
    }
}
