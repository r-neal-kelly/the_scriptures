import * as Data from "../../data.js";
import * as Reader from "../instance.js";

import * as Lines from "./lines.js";

export class Instance
{
    private reader: Reader.Instance;
    private data: Data.File.Instance;
    private lines: Lines.Instance;

    constructor(
        {
            reader,
            data,
            text,
        }: {
            reader: Reader.Instance,
            data: Data.File.Instance,
            text: string,
        },
    )
    {
        this.reader = reader;
        this.data = data;
        this.lines = new Lines.Instance(
            {
                file: this,
                text: text,
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

    Lines():
        Lines.Instance
    {
        return this.lines;
    }
}
