import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Data from "../../data.js";
import * as Text from "../../text.js";

interface Buffer_Instance_i
{
}

interface Line_Instance_i
{
    Index():
        Index;
}

interface Column_Instance_i<
    Line_Instance extends Line_Instance_i,
>
{
    Line():
        Line_Instance;
    Index():
        Index;
}

interface Row_Instance_i<
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i,
    Column_Instance extends Column_Instance_i<Line_Instance>,
>
{
    Buffer():
        Buffer_Instance;
    Column():
        Column_Instance;
    Index():
        Index;
}

interface Item_Instance_i
{
}

export abstract class Instance<
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i,
    Column_Instance extends Column_Instance_i<Line_Instance>,
    Row_Instance extends Row_Instance_i<Buffer_Instance, Line_Instance, Column_Instance>,
    Item_Instance extends Item_Instance_i,
> extends Entity.Instance
{
    private row: Row_Instance;
    private index: Index;
    private text: Text.Segment.Instance | null;
    private items: Array<Item_Instance>;

    constructor(
        {
            row,
            index,
            text,
        }: {
            row: Row_Instance,
            index: Index,
            text: Text.Segment.Instance | null,
        },
    )
    {
        super();

        this.row = row;
        this.index = index;
        this.text = text;
        this.items = [];

        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Buffer():
        Buffer_Instance
    {
        return this.Row().Buffer();
    }

    Row():
        Row_Instance
    {
        return this.row;
    }

    Index():
        Index
    {
        return this.index;
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

    Item_Buffer_Count():
        Count
    {
        return Data.Singleton().Info().Average_Macro_Item_Count(
            {
                line_index: this.Row().Column().Line().Index(),
                column_index: this.Row().Column().Index(),
                row_index: this.Row().Index(),
                segment_index: this.Index(),
            },
        );
    }

    Item_Count():
        Count
    {
        return this.items.length;
    }

    abstract Blank_Item(
        item_index: Index,
    ):
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
            return this.Blank_Item(item_index);
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
