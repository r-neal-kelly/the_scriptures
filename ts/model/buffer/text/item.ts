import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Languages from "../../languages.js";
import * as Text from "../../text.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Segment from "./segment.js";

export class Instance extends Text_Base.Item.Instance<
    Buffer.Instance,
    Segment.Instance
>
{
    private value: Text.Value | null;

    constructor(
        {
            segment,
            index,
            text,
        }: {
            segment: Segment.Instance,
            index: Index,
            text: Text.Item.Instance | null,
        },
    )
    {
        super(
            {
                segment: segment,
                index: index,
                text: text,
            },
        );

        if (this.Is_Blank()) {
            this.value = null;
        } else {
            const text: Text.Item.Instance = this.Text();
            if (text.Has_Image_Value()) {
                this.value = text.Image_Value();
            } else if (text.Has_Meta_Value()) {
                this.value = ``;
            } else {
                this.value = Languages.Singleton().Adapt_Text_To_Font(
                    {
                        language_name: this.Language_Name(),
                        font_name: this.Font_Name(),
                        text: text.Value()
                            .replace(/^ /, ` `)
                            .replace(/ $/, ` `)
                            .replace(/  /g, `  `),
                    },
                );
            }
        }
    }

    Value():
        Text.Value
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.value as Text.Value;
    }
}
