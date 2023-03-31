import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";
import * as Data from "../../data.js";
import * as Reader from "../instance.js";

import * as Line from "./line.js";

export class Instance
{
    private static min_line_count: Count = 50;
    private static min_item_count: Count = 100;

    private static blank_line: Line.Instance = new Line.Instance(
        {
            file: null,
            index: null,
            text: null,
        },
    );

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

    static Min_Item_Count():
        Count
    {
        return Instance.min_item_count;
    }

    static Set_Min_Item_Count(
        min_item_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_item_count >= 0,
            `min_item_count must be greater than or equal to 0.`,
        );

        Instance.min_item_count = min_item_count;
    }

    private reader: Reader.Instance;
    private data: Data.File.Instance | null;
    private text: Text.Instance;
    private lines: Array<Line.Instance>;

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
        this.lines = [];

        for (let idx = 0, end = text.Line_Count(); idx < end; idx += 1) {
            this.lines.push(
                new Line.Instance(
                    {
                        file: this,
                        index: idx,
                        text: text.Line(idx),
                    },
                ),
            );
        }
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

    Line_Count():
        Count
    {
        return this.lines.length;
    }

    Line_At(
        line_index: Index,
    ):
        Line.Instance
    {
        Utils.Assert(
            line_index > -1,
            `line_index (${line_index}) must be greater than -1.`,
        );

        if (line_index < this.Line_Count()) {
            return this.lines[line_index];
        } else {
            return Instance.blank_line;
        }
    }
}
