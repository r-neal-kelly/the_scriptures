import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Languages from "../../languages.js";
import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private item: Item.Instance | null;
    private index: Index | null;
    private value: Text.Value;
    private is_highlighted: boolean | null;

    constructor(
        {
            item,
            index,
            value,
            is_highlighted,
        }: {
            item: Item.Instance | null,
            index: Index | null,
            value: Text.Value | null,
            is_highlighted: boolean | null,
        },
    )
    {
        super();

        this.item = item;
        this.index = index;
        this.value = ``;
        this.is_highlighted = is_highlighted;

        if (value == null) {
            Utils.Assert(
                item == null,
                `item must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
            Utils.Assert(
                is_highlighted == null,
                `is_highlighted must be null.`,
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
            Utils.Assert(
                is_highlighted != null,
                `is_highlighted must not be null.`,
            );

            this.Set_Value(value);
        }

        this.Add_Dependencies(
            [
            ],
        );
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

    Value():
        Text.Value
    {
        if (this.Is_Blank()) {
            return ``;
        } else {
            if (this.Item().Segment().Row().Column().Line().Buffer().Is_Showing_Commands()) {
                return this.value;
            } else {
                const text: Text.Item.Instance = this.Item().Text();
                if (text.Has_Meta_Value()) {
                    return ``;
                } else {
                    return this.value;
                }
            }
        }
    }

    Set_Value(
        value: Text.Value,
    ):
        void
    {
        this.value = value
            .replace(/^ /, ` `)
            .replace(/ $/, ` `)
            .replace(/  /g, `  `);

        this.value = Languages.Singleton().Adapt_Text_To_Default_Global_Font(
            {
                language_name: this.Item().Language_Name(),
                text: this.value,
            },
        );
    }

    Is_Blank():
        boolean
    {
        return this.item == null;
    }

    Is_Highlighted():
        boolean
    {
        Utils.Assert(
            this.is_highlighted != null,
            `Doesn't know if it's highlighted or not.`,
        );

        return this.is_highlighted as boolean;
    }

    Set_Highlight(
        is_highlighted: boolean,
    ):
        void
    {
        Utils.Assert(
            this.is_highlighted != null,
            `Can't know if it's highlighted or not.`,
        );

        this.is_highlighted = is_highlighted;
    }
}
