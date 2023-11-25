import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Text from "../../text.js";

import { Default_Min_Counts } from "./default_min_counts.js";

interface Buffer_Instance_i
{
}

interface Column_Instance_i
{
}

export abstract class Instance<
    Buffer_Instance extends Buffer_Instance_i,
    Column_Instance extends Column_Instance_i,
> extends Entity.Instance
{
    private buffer: Buffer_Instance | null;
    private index: Index | null;
    private text: Text.Line.Instance | null;
    private columns: Array<Column_Instance>;

    constructor(
        {
            buffer,
            index,
            text,
        }: {
            buffer: Buffer_Instance | null,
            index: Index | null,
            text: Text.Line.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.index = index;
        this.text = text;
        this.columns = [];

        if (buffer == null) {
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
            `line is blank.`,
        );

        return this.buffer as Buffer_Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.index as Index;
    }

    Text():
        Text.Line.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.text as Text.Line.Instance;
    }

    Min_Column_Count():
        Count
    {
        return Default_Min_Counts.COLUMN;
    }

    Column_Count():
        Count
    {
        return this.columns.length;
    }

    abstract Blank_Column():
        Column_Instance;

    Column_At(
        column_index: Index,
    ):
        Column_Instance
    {
        Utils.Assert(
            column_index > -1,
            `column_index (${column_index}) must be greater than -1.`,
        );

        if (column_index < this.Column_Count()) {
            return this.columns[column_index];
        } else {
            return this.Blank_Column();
        }
    }

    protected Push_Column(
        column: Column_Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        this.columns.push(column);
    }

    Has_Margin():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Has_Margin();
    }

    Has_Interlineation():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Has_Interlineation();
    }

    Has_Forward_Interlineation():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Has_Forward_Interlineation();
    }

    Has_Reverse_Interlineation():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Has_Reverse_Interlineation();
    }

    Is_Row_Of_Table():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Is_Row_Of_Table();
    }

    Is_First_Row_Of_Table():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Is_First_Row_Of_Table();
    }

    Is_Centered():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Is_Centered();
    }

    Is_Padded():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Is_Padded();
    }

    Padding_Count():
        Count
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );
        Utils.Assert(
            this.Is_Padded(),
            `line is not padded.`,
        );

        return this.Text().Padding_Count();
    }

    Padding_Direction():
        Language.Direction
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );
        Utils.Assert(
            this.Is_Padded(),
            `line is not padded.`,
        );

        return this.Text().Has_Forward_Interlineation() ?
            Language.Direction.LEFT_TO_RIGHT :
            Language.Direction.RIGHT_TO_LEFT;
    }
}
