import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as Line from "./line.js";
import * as Sub_Item from "./sub_item.js";

export class Instance
{
    private static blank_sub_item: Sub_Item.Instance = new Sub_Item.Instance(
        {
            item: null,
            index: null,
            text: null,
        },
    );

    static Text_Value(
        item: Text.Item.Instance,
    ):
        Text.Value
    {
        Utils.Assert(
            !item.Is_Segment(),
            `Invalid item_type.`,
        );

        if (item.Is_Part() && (item as Text.Item.Part.Instance).Is_Command()) {
            return ``;
        } else {
            return item.Value()
                .replace(/^ /, ` `)
                .replace(/ $/, ` `)
                .replace(/  /g, `  `);
        }
    }

    private line: Line.Instance | null;
    private index: Index | null;
    private text: Text.Item.Instance | null;
    private value: Text.Value | null;
    private sub_items: Array<Sub_Item.Instance> | null;

    constructor(
        {
            line,
            index,
            text,
        }: {
            line: Line.Instance | null,
            index: Index | null,
            text: Text.Item.Instance | null,
        },
    )
    {
        this.line = line;
        this.index = index;
        this.text = text;
        this.sub_items = null;
        this.value = null;

        if (text == null) {
            Utils.Assert(
                line == null,
                `line must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );

            this.value = ``;
        } else {
            Utils.Assert(
                line != null,
                `line must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            if (text.Is_Segment()) {
                const segment: Text.Item.Segment.Instance =
                    text as Text.Item.Segment.Instance;
                this.sub_items = [];
                for (let idx = 0, end = segment.Item_Count(); idx < end; idx += 1) {
                    this.sub_items.push(
                        new Sub_Item.Instance(
                            {
                                item: this,
                                index: idx,
                                text: segment.Item(idx),
                            },
                        ),
                    );
                }
            } else {
                this.value = Instance.Text_Value(text);
            }
        }
    }

    Line():
        Line.Instance
    {
        Utils.Assert(
            this.line != null,
            `Doesn't have line.`,
        );

        return this.line as Line.Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.index != null,
            `Doesn't have an index.`,
        );

        return this.index as Index;
    }

    Text():
        Text.Item.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Item.Instance;
    }

    Has_Part():
        boolean
    {
        return (
            !this.Is_Blank() &&
            !(this.Text() instanceof Text.Item.Segment.Instance)
        );
    }

    Part():
        Text.Item.Part.Instance
    {
        Utils.Assert(
            this.Has_Part(),
            `Doesn't have a part.`,
        );

        const text: Text.Item.Instance = this.Text();

        if (text.Is_Part()) {
            return (text as Text.Item.Part.Instance);
        } else if (text.Is_Split()) {
            return (text as Text.Item.Split.Instance).Break();
        } else {
            Utils.Assert(
                false,
                `Invalid item_type.`,
            );

            return (text as Text.Item.Part.Instance);
        }
    }

    Has_Value():
        boolean
    {
        return this.value != null;
    }

    Value():
        Text.Value
    {
        if (this.Is_Blank()) {
            return ``;
        } else {
            Utils.Assert(
                this.Has_Value(),
                `This item has no value but rather sub_items, which have their own values.`,
            );

            return this.value as Text.Value;
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Is_Indented():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `Item is blank and can't be indented.`,
        );

        return (
            this.Index() === 0 &&
            this.Line().Text().Is_Indented()
        );
    }

    Is_Error():
        boolean
    {
        return this.Part().Is_Error();
    }

    Has_Italic_Style():
        boolean
    {
        return this.Part().Has_Italic_Style();
    }

    Has_Bold_Style():
        boolean
    {
        return this.Part().Has_Bold_Style();
    }

    Has_Underline_Style():
        boolean
    {
        return this.Part().Has_Underline_Style();
    }

    Has_Small_Caps_Style():
        boolean
    {
        return this.Part().Has_Small_Caps_Style();
    }

    Has_Error_Style():
        boolean
    {
        return this.Part().Has_Error_Style();
    }

    Sub_Item_Count():
        Count
    {
        if (this.sub_items != null) {
            return this.sub_items.length;
        } else {
            return 0;
        }
    }

    Sub_Item_At(
        sub_item_index: Index,
    ):
        Sub_Item.Instance
    {
        Utils.Assert(
            sub_item_index > -1,
            `sub_item_index (${sub_item_index}) must be greater than -1.`,
        );

        if (this.sub_items != null) {
            if (sub_item_index < this.Sub_Item_Count()) {
                return this.sub_items[sub_item_index];
            } else {
                return Instance.blank_sub_item;
            }
        } else {
            return Instance.blank_sub_item;
        }
    }
}
