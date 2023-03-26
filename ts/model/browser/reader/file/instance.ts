import * as Text from "../../../text.js";
import * as Data from "../../data.js";
import * as Reader from "../instance.js";

import * as Lines from "./lines.js";

export class Instance
{
    private reader: Reader.Instance;
    private data: Data.File.Instance;
    private text: Text.Instance;
    private lines: Lines.Instance;

    constructor(
        {
            reader,
            data,
            text,
        }: {
            reader: Reader.Instance,
            data: Data.File.Instance,
            text: Text.Instance,
        },
    )
    {
        this.reader = reader;
        this.data = data;
        this.text = text;
        this.lines = new Lines.Instance(
            {
                file: this,
                text: text.Lines(),
            },
        );
    }

    Reader():
        Reader.Instance
    {
        return this.reader;
    }

    Data():
        Data.File.Instance
    {
        return this.data;
    }

    Text():
        Text.Instance
    {
        return this.text;
    }

    Lines():
        Lines.Instance
    {
        return this.lines;
    }
}
