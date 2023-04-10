/*
import { Index } from "../../types.js";
import { Name } from "../../types.js";

import * as Data from "../data.js";

export class Instance
{
    private search: Data.Search.Instance;
    private file_index: Index;
    private line_index: Index;
    private first_part_index: Index;
    private end_part_index: Index;
    private first_part_first_unit_index: Index;
    private last_part_end_unit_index: Index;

    constructor(
        {
            search,
            file_index,
            line_index,
            first_part_index,
            end_part_index,
            first_part_first_unit_index,
            last_part_end_unit_index,
        }: {
            search: Data.Search.Instance,
            file_index: Index,
            line_index: Index,
            first_part_index: Index,
            end_part_index: Index,
            first_part_first_unit_index: Index,
            last_part_end_unit_index: Index,
        },
    )
    {
        this.search = search;
        this.file_index = file_index;
        this.line_index = line_index;
        this.first_part_index = first_part_index;
        this.end_part_index = end_part_index;
        this.first_part_first_unit_index = first_part_first_unit_index;
        this.last_part_end_unit_index = last_part_end_unit_index;

        Object.freeze(this);
    }

    Book_Name():
        Name
    {
        return this.search.Version().Versions().Language().Languages().Book().Name();
    }

    Language_Name():
        Name
    {
        return this.search.Version().Versions().Language().Name();
    }

    Version_Name():
        Name
    {
        return this.search.Version().Name();
    }

    File_Index():
        Index
    {
        return this.file_index;
    }

    Line_Index():
        Index
    {
        return this.line_index;
    }

    First_Part_Index():
        Index
    {
        return this.first_part_index;
    }

    End_Part_Index():
        Index
    {
        return this.end_part_index;
    }

    First_Part_First_Unit_Index():
        Index
    {
        return this.first_part_first_unit_index;
    }

    Last_Part_End_Unit_Index():
        Index
    {
        return this.last_part_end_unit_index;
    }
}
*/
export class Instance {
}
