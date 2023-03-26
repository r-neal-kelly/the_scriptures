import { Index } from "../../../../types.js";

import * as Text from "../../../text.js";

import * as Lines from "./lines.js";

export class Instance
{
    private lines: Lines.Instance;
    private index: Index;
    private text_line: Text.Line.Instance;

    constructor(
        {
            lines,
            index,
            text_line,
        }: {
            lines: Lines.Instance,
            index: Index,
            text_line: Text.Line.Instance,
        },
    )
    {
        this.lines = lines;
        this.index = index;
        this.text_line = text_line;
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
        return this.text_line.Value().replaceAll(/  /g, `  `);
    }

    Text_Line():
        Text.Line.Instance
    {
        return this.text_line;
    }
}
