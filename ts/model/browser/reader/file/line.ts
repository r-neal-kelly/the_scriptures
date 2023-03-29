import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as Lines from "./lines.js";
import * as Segments from "./segments.js";

export class Instance
{
    private lines: Lines.Instance | null;
    private index: Index | null;
    private text: Text.Line.Instance | null;
    private segments: Segments.Instance;

    constructor(
        {
            lines,
            index,
            text,
        }: {
            lines: Lines.Instance | null,
            index: Index | null,
            text: Text.Line.Instance | null,
        },
    )
    {
        this.lines = lines;
        this.index = index;
        this.text = text;
        this.segments = new Segments.Instance(
            {
                line: this,
                text: text,
            },
        );

        if (text == null) {
            Utils.Assert(
                lines == null,
                `lines must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                lines != null,
                `lines must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
        }
    }

    Lines():
        Lines.Instance
    {
        Utils.Assert(
            this.lines != null,
            `Doesn't have lines.`,
        );

        return this.lines as Lines.Instance;
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
        Text.Line.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Line.Instance;
    }

    Segments():
        Segments.Instance
    {
        return this.segments;
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }
}
