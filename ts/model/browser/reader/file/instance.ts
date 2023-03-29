import { Count } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";
import * as Data from "../../data.js";
import * as Reader from "../instance.js";

import * as Lines from "./lines.js";

export class Instance
{
    private static min_line_count: Count = 40;
    private static min_part_count: Count = 50;

    static Min_Line_Count():
        Count
    {
        return Instance.min_line_count;
    }

    static Set_Min_Line_Count(
        min_line_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_line_count >= 0,
            `min_line_count must be greater than or equal to 0.`,
        );

        Instance.min_line_count = min_line_count;
    }

    static Min_Part_Count():
        Count
    {
        return Instance.min_part_count;
    }

    static Set_Min_Part_Count(
        min_part_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_part_count >= 0,
            `min_part_count must be greater than or equal to 0.`,
        );

        Instance.min_part_count = min_part_count;
    }

    private reader: Reader.Instance;
    private data: Data.File.Instance | null;
    private text: Text.Instance;
    private lines: Lines.Instance;

    constructor(
        {
            reader,
            data,
            text,
        }: {
            reader: Reader.Instance,
            data: Data.File.Instance | null,
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
                text: text.Lines(), // we should just pass the text and let the lines iterate it
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
        Utils.Assert(
            this.data != null,
            `Has no data.`,
        );

        return this.data as Data.File.Instance;
    }

    Maybe_Data():
        Data.File.Instance | null
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
