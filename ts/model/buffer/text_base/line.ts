import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Data from "../../data.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";

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
    private buffer: Buffer_Instance;
    private index: Index;
    private text: Text.Line.Instance | null;
    private columns: Array<Column_Instance>;

    constructor(
        {
            buffer,
            index,
            text,
        }: {
            buffer: Buffer_Instance,
            index: Index,
            text: Text.Line.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.index = index;
        this.text = text;
        this.columns = [];

        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    abstract Can_Be_Interior_Blank():
        boolean;

    Buffer():
        Buffer_Instance
    {
        return this.buffer;
    }

    Index():
        Index
    {
        return this.index;
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

    Column_Buffer_Count():
        Count
    {
        return Data.Singleton().Info().Average_Column_Count(
            {
                line_index: this.Index(),
            },
        );
    }

    Column_Count():
        Count
    {
        return this.columns.length;
    }

    abstract Blank_Column(
        column_index: Index,
    ):
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
            return this.Blank_Column(column_index);
        }
    }

    Column_Percents():
        Array<Count>
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.Text().Column_Percents();
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
