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
    private item: Item.Instance;
    private index: Index;
    private value: Text.Value | null;
    private is_highlighted: boolean;

    constructor(
        {
            item,
            index,
            value,
            is_highlighted,
        }: {
            item: Item.Instance,
            index: Index,
            value: Text.Value | null,
            is_highlighted: boolean,
        },
    )
    {
        super();

        this.item = item;
        this.index = index;
        this.value = value;
        this.is_highlighted = is_highlighted;

        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );

        if (value != null) {
            this.Set_Value(value as Text.Value);
        }

        this.Add_Dependencies(
            [
            ],
        );
    }

    Is_Blank():
        boolean
    {
        return this.value == null;
    }

    Buffer():
        Buffer.Instance
    {
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
        return this.item;
    }

    Index():
        Index
    {
        return this.index;
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
        return this.is_highlighted;
    }

    Set_Highlight(
        is_highlighted: boolean,
    ):
        void
    {
        this.is_highlighted = is_highlighted;
    }
}
