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

interface Column_Instance_i<
    Buffer_Instance,
>
{
    Buffer():
        Buffer_Instance;
}

interface Segment_Instance_i
{
}

export abstract class Instance<
    Buffer_Instance extends Buffer_Instance_i,
    Column_Instance extends Column_Instance_i<Buffer_Instance>,
    Segment_Instance extends Segment_Instance_i,
> extends Entity.Instance
{
    private column: Column_Instance | null;
    private index: Index | null;
    private text: Text.Row.Instance | null;
    private segments: Array<Segment_Instance>;

    constructor(
        {
            column,
            index,
            text,
        }: {
            column: Column_Instance | null,
            index: Index | null,
            text: Text.Row.Instance | null,
        },
    )
    {
        super();

        this.column = column;
        this.index = index;
        this.text = text;
        this.segments = [];

        if (column == null) {
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
            Utils.Assert(
                text == null,
                `text must be null.`,
            );
        } else {
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
            Utils.Assert(
                text != null,
                `text must not be null.`,
            );
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Buffer():
        Buffer_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.Column().Buffer();
    }

    Column():
        Column_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.column as Column_Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.index as Index;
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

    Min_Segment_Count(
        {
            line_index,
            column_index,
            row_index,
        }: {
            line_index: Index,
            column_index: Index,
            row_index: Index,
        },
    ):
        Count
    {
        return Data.Singleton().Info().Max_Macro_Segment_Count(
            {
                line_index: line_index,
                column_index: column_index,
                row_index: row_index,
            },
        );
    }

    Segment_Count():
        Count
    {
        return this.segments.length;
    }

    abstract Blank_Segment():
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
            return this.Blank_Segment();
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
