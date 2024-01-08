import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Data from "../../data.js";
import * as Text from "../../text.js";

interface Buffer_Instance_i
{
    Default_Language_Direction():
        Language.Direction;
}

interface Line_Instance_i
{
    Index():
        Index;
}

interface Column_Instance_i<
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i,
>
{
    Buffer():
        Buffer_Instance;
    Line():
        Line_Instance;
    Index():
        Index;
}

interface Segment_Instance_i
{
}

export abstract class Instance<
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i,
    Column_Instance extends Column_Instance_i<Buffer_Instance, Line_Instance>,
    Segment_Instance extends Segment_Instance_i,
> extends Entity.Instance
{
    private column: Column_Instance;
    private index: Index;
    private text: Text.Row.Instance | null;
    private segments: Array<Segment_Instance>;

    constructor(
        {
            column,
            index,
            text,
        }: {
            column: Column_Instance,
            index: Index,
            text: Text.Row.Instance | null,
        },
    )
    {
        super();

        this.column = column;
        this.index = index;
        this.text = text;
        this.segments = [];

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
        return this.Column().Buffer();
    }

    Column():
        Column_Instance
    {
        return this.column;
    }

    Index():
        Index
    {
        return this.index;
    }

    Text():
        Text.Row.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.text as Text.Row.Instance;
    }

    Segment_Buffer_Count():
        Count
    {
        return Data.Singleton().Info().Average_Macro_Segment_Count(
            {
                line_index: this.Column().Line().Index(),
                column_index: this.Column().Index(),
                row_index: this.Index(),
            },
        );
    }

    Segment_Count():
        Count
    {
        return this.segments.length;
    }

    abstract Blank_Segment(
        segment_index: Index,
    ):
        Segment_Instance;

    Segment_At(
        segment_index: Index,
    ):
        Segment_Instance
    {
        Utils.Assert(
            segment_index > -1,
            `segment_index (${segment_index}) must be greater than -1.`,
        );

        if (segment_index < this.Segment_Count()) {
            return this.segments[segment_index];
        } else {
            return this.Blank_Segment(segment_index);
        }
    }

    protected Push_Segment(
        segment: Segment_Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        this.segments.push(segment);
    }

    Is_Transparent():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.Text().Value() === ``;
    }

    Is_Centered():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.Text().Can_Be_Centered() && this.Text().Is_Centered();
    }

    Is_Padded():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.Text().Can_Be_Padded() && this.Text().Is_Padded();
    }

    Padding_Count():
        Count
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );
        Utils.Assert(
            this.Is_Padded(),
            `row is not padded.`,
        );

        if (this.Text().Can_Be_Padded()) {
            return this.Text().Padding_Count();
        } else {
            return 0;
        }
    }

    Padding_Direction():
        Language.Direction
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );
        Utils.Assert(
            this.Is_Padded(),
            `row is not padded.`,
        );

        return this.Buffer().Default_Language_Direction();
    }
}
