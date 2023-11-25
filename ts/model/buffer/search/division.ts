import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Languages from "../../languages.js";
import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Search from "../../search.js";

import * as Buffer from "./instance.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private item: Item.Instance | null;
    private index: Index | null;
    private value: Text.Value | null;
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
        this.value = value;
        this.is_highlighted = is_highlighted;

        if (item == null) {
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
            Utils.Assert(
                value == null,
                `value must be null.`,
            );
            Utils.Assert(
                is_highlighted == null,
                `is_highlighted must be null.`,
            );
        } else {
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
            Utils.Assert(
                value != null,
                `value must not be null.`,
            );
            Utils.Assert(
                is_highlighted != null,
                `is_highlighted must not be null.`,
            );

            this.Set_Value(value as Text.Value);
        }
    }

    Is_Blank():
        boolean
    {
        return this.item == null;
    }

    Buffer():
        Buffer.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        return this.Item().Buffer();
    }

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        return this.Item().Result();
    }

    Item():
        Item.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        return this.item as Item.Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        return this.index as Index;
    }

    Value():
        Text.Value
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        if (this.Buffer().Is_Showing_Commands()) {
            return this.value as Text.Value;
        } else {
            const text: Text.Item.Instance = this.Item().Text();
            if (text.Has_Meta_Value()) {
                return ``;
            } else {
                return this.value as Text.Value;
            }
        }
    }

    Set_Value(
        value: Text.Value,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        this.value = Languages.Singleton().Adapt_Text_To_Font(
            {
                language_name: this.Item().Language_Name(),
                font_name: this.Item().Font_Name(),
                text: value
                    .replace(/^ /, ` `)
                    .replace(/ $/, ` `)
                    .replace(/  /g, `  `),
            },
        );
    }

    Is_Highlighted():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        return this.is_highlighted as boolean;
    }

    Set_Highlight(
        is_highlighted: boolean,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Blank(),
            `division is blank.`,
        );

        this.is_highlighted = is_highlighted;
    }
}
