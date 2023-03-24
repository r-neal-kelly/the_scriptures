import * as Utils from "../../../utils.js";

import * as Data from "../data.js";
import * as Reader from "./instance.js";

export class Instance
{
    private reader: Reader.Instance;
    private data: Data.File.Instance;
    private text: string;

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
        this.text = text;
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
        string
    {
        return this.text;
    }
}
