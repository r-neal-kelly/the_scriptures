import { Index } from "../../../../types.js";

import * as Text from "../../../text.js";

import * as Lines from "./lines.js";
import * as Parts from "./parts.js";

export class Instance
{
    private lines: Lines.Instance;
    private index: Index;
    private text: Text.Line.Instance;
    private parts: Parts.Instance;

    constructor(
        {
            lines,
            index,
            text,
        }: {
            lines: Lines.Instance,
            index: Index,
            text: Text.Line.Instance,
        },
    )
    {
        this.lines = lines;
        this.index = index;
        this.text = text;
        this.parts = new Parts.Instance(
            {
                line: this,
                text: text.Parts(),
            },
        );
    }

    Lines():
        Lines.Instance
    {
        return this.lines;
    }

    Index():
        Index
    {
        return this.index;
    }

    Text():
        Text.Line.Instance
    {
        return this.text;
    }

    Parts():
        Parts.Instance
    {
        return this.parts;
    }
}
