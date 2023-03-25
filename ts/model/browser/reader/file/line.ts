import { Index } from "../../../../types.js";

import * as Lines from "./lines.js";

export class Instance
{
    private lines: Lines.Instance;
    private index: Index;
    private text: string;

    constructor(
        {
            lines,
            index,
            text,
        }: {
            lines: Lines.Instance,
            index: Index,
            text: string,
        },
    )
    {
        this.lines = lines;
        this.index = index;
        this.text = text.replaceAll(/  /g, `  `);
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
        string
    {
        return this.text;
    }
}
