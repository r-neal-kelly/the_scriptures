import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Data from "../../data.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";

interface Buffer_Instance_i
{
}

interface Row_Instance_i<
    Buffer_Instance,
>
{
    Buffer():
        Buffer_Instance;
}

interface Item_Instance_i
{
}

export abstract class Instance<
    Buffer_Instance extends Buffer_Instance_i,
    Row_Instance extends Row_Instance_i<Buffer_Instance>,
    Item_Instance extends Item_Instance_i,
> extends Entity.Instance
{
    private row: Row_Instance | null;
    private index: Index | null;
    private text: Text.Segment.Instance | null;
    private items: Array<Item_Instance>;

    constructor(
        {
            row,
            index,
            text,
        }: {
            row: Row_Instance | null,
            index: Index | null,
            text: Text.Segment.Instance | null,
        },
    )
    {
        super();

        this.row = row;
        this.index = index;
        this.text = text;
        this.items = [];

        if (row == null) {
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
            Utils.Assert(
                text == null,
                `text must be null.`,
            );
        } else {
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
            Utils.Assert(
                text != null,
                `text must not be null.`,
            );
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Buffer():
        Buffer_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        return this.Row().Buffer();
    }

    Row():
        Row_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        return this.row as Row_Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        return this.index as Index;
    }

    Text():
        Text.Segment.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        return this.text as Text.Segment.Instance;
    }

    Min_Item_Count(
        {
            line_index,
            column_index,
            row_index,
            segment_index,
        }: {
            line_index: Index,
            column_index: Index,
            row_index: Index,
            segment_index: Index,
        },
    ):
        Count
    {
        if (Buffer.Use_Average_Counts()) {
            return Data.Singleton().Info().Avg_Macro_Item_Count(
                {
                    line_index: line_index,
                    column_index: column_index,
                    row_index: row_index,
                    segment_index: segment_index,
                },
            );
        } else {
            return Data.Singleton().Info().Max_Macro_Item_Count(
                {
                    line_index: line_index,
                    column_index: column_index,
                    row_index: row_index,
                    segment_index: segment_index,
                },
            );
        }
    }

    Item_Count():
        Count
    {
        return this.items.length;
    }

    abstract Blank_Item():
        Item_Instance;

    Item_At(
        item_index: Index,
    ):
        Item_Instance
    {
        Utils.Assert(
            item_index > -1,
            `item_index (${item_index}) must be greater than -1.`,
        );

        if (item_index < this.Item_Count()) {
            return this.items[item_index];
        } else {
            return this.Blank_Item();
        }
    }

    protected Push_Item(
        item: Item_Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        this.items.push(item);
    }

    Has_Left_To_Right_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        return this.Text().Segment_Type() === Text.Segment.Type.MACRO_LEFT_TO_RIGHT;
    }

    Has_Right_To_Left_Style():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        return this.Text().Segment_Type() === Text.Segment.Type.MACRO_RIGHT_TO_LEFT;
    }
}
