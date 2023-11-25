import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Text from "../../text.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Column from "./column.js";
import * as Segment from "./segment.js";

export class Instance extends Text_Base.Row.Instance<
    Buffer.Instance,
    Column.Instance,
    Segment.Instance
>
{
    private static blank_segment: Segment.Instance = new Segment.Instance(
        {
            row: null,
            index: null,
            text: null,
        },
    );

    constructor(
        {
            column,
            index,
            text,
        }: {
            column: Column.Instance | null,
            index: Index | null,
            text: Text.Row.Instance | null,
        },
    )
    {
        super(
            {
                column: column,
                index: index,
                text: text,
            },
        );

        if (!this.Is_Blank()) {
            if (this.Text().Value() === ``) {
                const segment: Text.Segment.Instance = new Text.Segment.Instance(
                    {
                        segment_type: Text.Segment.Type.MACRO,
                        index: 0,
                    },
                );
                segment.Add_Item(
                    new Text.Part.Instance(
                        {
                            part_type: Text.Part.Type.POINT,
                            index: 0,
                            value: ` `,
                            status: Text.Part.Status.GOOD,
                            style: Text.Part.Style._NONE_,
                            language: null,
                        },
                    ),
                );
                this.Push_Segment(
                    new Segment.Instance(
                        {
                            row: this,
                            index: 0,
                            text: segment,
                        },
                    ),
                );
            } else {
                for (let idx = 0, end = this.Text().Macro_Segment_Count(); idx < end; idx += 1) {
                    this.Push_Segment(
                        new Segment.Instance(
                            {
                                row: this,
                                index: idx,
                                text: this.Text().Macro_Segment(idx),
                            },
                        ),
                    );
                }
            }
        }
    }

    Blank_Segment():
        Segment.Instance
    {
        return Instance.blank_segment;
    }
}
