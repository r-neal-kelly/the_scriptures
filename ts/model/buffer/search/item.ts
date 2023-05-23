import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Languages from "../../languages.js";
import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Segment from "./segment.js";
import * as Division from "./division.js";

export class Instance extends Entity.Instance
{
    private static min_division_count: Count = 1;

    private static blank_division: Division.Instance = new Division.Instance(
        {
            item: null,
            index: null,
            value: null,
            is_highlighted: null,
        },
    );

    static Min_Division_Count():
        Count
    {
        return Instance.min_division_count;
    }

    static Set_Min_Division_Count(
        min_division_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_division_count >= 0,
            `min_division_count must be greater than or equal to 0.`,
        );

        Instance.min_division_count = min_division_count;
    }

    private segment: Segment.Instance | null;
    private index: Index | null;
    private text: Text.Item.Instance | null;
    private divisions: Array<Division.Instance>;

    constructor(
        {
            segment,
            index,
            text,
        }: {
            segment: Segment.Instance | null,
            index: Index | null,
            text: Text.Item.Instance | null,
        },
    )
    {
        super();

        this.segment = segment;
        this.index = index;
        this.text = text;
        this.divisions = [];

        if (text == null) {
            Utils.Assert(
                segment == null,
                `segment must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                segment != null,
                `segment must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            this.divisions.push(
                new Division.Instance(
                    {
                        item: this,
                        index: 0,
                        value: this.Value(),
                        is_highlighted: false,
                    },
                ),
            );
        }

        this.Add_Dependencies(
            [
            ],
        );
    }

    Segment():
        Segment.Instance
    {
        Utils.Assert(
            this.segment != null,
            `Doesn't have segment.`,
        );

        return this.segment as Segment.Instance;
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

    Value():
        Text.Value
    {
        if (this.Is_Blank()) {
            return ``;
        } else {
            return this.Text().Value();
        }
    }

    Division_Count():
        Count
    {
        return this.divisions.length;
    }

    Division_At(
        division_index: Index,
    ):
        Division.Instance
    {
        Utils.Assert(
            division_index > -1,
            `division_index (${division_index}) must be greater than -1.`,
        );

        if (division_index < this.Division_Count()) {
            return this.divisions[division_index];
        } else {
            return Instance.blank_division;
        }
    }

    Highlight(
        {
            first_unit_index,
            end_unit_index,
        }: {
            first_unit_index: Index,
            end_unit_index: Index,
        },
    ):
        void
    {
        const value: Text.Value = this.Value();
        if (this.Division_Count() === 1) {
            if (first_unit_index === 0 && end_unit_index === value.length) {
                this.Division_At(0).Set_Highlight(true);
            } else if (first_unit_index === 0 || end_unit_index === value.length) {
                if (first_unit_index === 0) {
                    this.Division_At(0).Set_Value(value.slice(first_unit_index, end_unit_index));
                    this.Division_At(0).Set_Highlight(true);
                    this.divisions.push(
                        new Division.Instance(
                            {
                                item: this,
                                index: 1,
                                value: value.slice(end_unit_index, value.length),
                                is_highlighted: false,
                            },
                        ),
                    );
                } else {
                    this.Division_At(0).Set_Value(value.slice(0, first_unit_index));
                    this.divisions.push(
                        new Division.Instance(
                            {
                                item: this,
                                index: 1,
                                value: value.slice(first_unit_index, end_unit_index),
                                is_highlighted: true,
                            },
                        ),
                    );
                }
            } else {
                this.Division_At(0).Set_Value(value.slice(0, first_unit_index));
                this.divisions.push(
                    new Division.Instance(
                        {
                            item: this,
                            index: 1,
                            value: value.slice(first_unit_index, end_unit_index),
                            is_highlighted: true,
                        },
                    ),
                );
                this.divisions.push(
                    new Division.Instance(
                        {
                            item: this,
                            index: 2,
                            value: value.slice(end_unit_index, value.length),
                            is_highlighted: false,
                        },
                    ),
                );
            }
        } else {
            /*
                E.G. Expression <!is . the> matches the text "remove them the",
                first "remove the" and then "them the". We just go ahead and
                split the entire string maintaining previous highlighting. It's
                expensive to do this for every item, so we only do it when we have
                to.
            */
            const old_divisions: Array<Division.Instance> = this.divisions;
            this.divisions = [];
            for (const old_division of old_divisions) {
                const is_highlighted: boolean = old_division.Is_Highlighted();
                for (const unit of old_division.Value()) {
                    this.divisions.push(
                        new Division.Instance(
                            {
                                item: this,
                                index: this.divisions.length,
                                value: unit,
                                is_highlighted: is_highlighted,
                            },
                        ),
                    );
                }
            }

            for (let idx = first_unit_index, end = end_unit_index; idx < end; idx += 1) {
                this.Division_At(idx).Set_Highlight(true);
            }
        }
    }

    Part():
        Text.Part.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `Item is blank and doesn't have a part.`,
        );

        const text: Text.Item.Instance = this.Text();
        if (text.Is_Part()) {
            return (text as Text.Part.Instance);
        } else {
            return (text as Text.Split.Instance).Break();
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

        const part: Text.Part.Instance = this.Part();
        return (
            part.Is_Command() &&
            (part as Text.Part.Command.Instance).Is_Indent()
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

    Language():
        Languages.Name | null
    {
        return this.Part().Language();
    }
}
