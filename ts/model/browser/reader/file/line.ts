import * as Lines from "./lines.js";

export class Instance
{
    private lines: Lines.Instance;
    private text: string;

    constructor(
        {
            lines,
            text,
        }: {
            lines: Lines.Instance,
            text: string,
        },
    )
    {
        this.lines = lines;
        this.text = text.replaceAll(/  /g, `  `);
    }

    Lines():
        Lines.Instance
    {
        return this.lines;
    }

    Text():
        string
    {
        return this.text;
    }
}
