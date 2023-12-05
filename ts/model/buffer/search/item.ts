import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Text from "../../text.js";
import * as Search from "../../search.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Segment from "./segment.js";
import * as Division from "./division.js";

export class Instance extends Text_Base.Item.Instance<
    Buffer.Instance,
    Segment.Instance
>
{
    private divisions: Array<Division.Instance>;

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

        this.divisions = [];

        if (!this.Is_Blank()) {
            this.divisions.push(
                new Division.Instance(
                    {
                        item: this,
                        index: 0,
                        value: this.Text().Value(),
                        is_highlighted: false,
                    },
                ),
            );
        }
    }

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        return this.Segment().Result();
    }

    Min_Division_Buffer_Count():
        Count
    {
        return 1;
    }

    Max_Division_Buffer_Count():
        Count
    {
        return 1;
    }

    Division_Count():
        Count
    {
        return this.divisions.length;
    }

    Blank_Division(
        division_index: Index,
    ):
        Division.Instance
    {
        return new Division.Instance(
            {
                item: this,
                index: division_index,
                value: null,
                is_highlighted: false,
            },
        );
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
            return this.Blank_Division(division_index);
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
        Utils.Assert(
            !this.Is_Blank(),
            `item is blank.`,
        );

        const value: Text.Value = this.Text().Value();
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
}
