import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as Item from "./item.js";

export class Instance
{
    private item: Item.Instance | null;
    private index: Index | null;
    private text: Text.Item.Instance | null;
    private value: Text.Value;

    constructor(
        {
            item,
            index,
            text,
        }: {
            item: Item.Instance | null,
            index: Index | null,
            text: Text.Item.Instance | null,
        },
    )
    {
        this.item = item;
        this.index = index;
        this.text = text;

        if (text == null) {
            Utils.Assert(
                item == null,
                `item must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );

            this.value = ``;
        } else {
            Utils.Assert(
                item != null,
                `item must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            this.value = Item.Instance.Text_Value(text);
        }
    }

    Item():
        Item.Instance
    {
        Utils.Assert(
            this.item != null,
            `Doesn't have item.`,
        );

        return this.item as Item.Instance;
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

    Part():
        Text.Item.Part.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `Sub_Item is blank and doesn't have a part.`,
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

    Value():
        Text.Value
    {
        return this.value;
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
            `Sub_Item is blank and can't be indented.`,
        );

        return (
            this.Index() === 0 &&
            this.Item().Is_Indented()
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
}
