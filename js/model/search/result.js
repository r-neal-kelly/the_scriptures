export class Instance {
    constructor({ search, file_index, line_index, first_part_index, end_part_index, first_part_first_unit_index, last_part_end_unit_index, }) {
        this.search = search;
        this.file_index = file_index;
        this.line_index = line_index;
        this.first_part_index = first_part_index;
        this.end_part_index = end_part_index;
        this.first_part_first_unit_index = first_part_first_unit_index;
        this.last_part_end_unit_index = last_part_end_unit_index;
        Object.freeze(this);
    }
    Book_Name() {
        return this.search.Version().Versions().Language().Languages().Book().Name();
    }
    Language_Name() {
        return this.search.Version().Versions().Language().Name();
    }
    Version_Name() {
        return this.search.Version().Name();
    }
    File_Index() {
        return this.file_index;
    }
    Line_Index() {
        return this.line_index;
    }
    First_Part_Index() {
        return this.first_part_index;
    }
    End_Part_Index() {
        return this.end_part_index;
    }
    First_Part_First_Unit_Index() {
        return this.first_part_first_unit_index;
    }
    Last_Part_End_Unit_Index() {
        return this.last_part_end_unit_index;
    }
}
