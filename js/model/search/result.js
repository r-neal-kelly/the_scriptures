export class Instance {
    constructor({ search, file_index, line_index, first_unit_index, end_unit_index, }) {
        this.search = search;
        this.file_index = file_index;
        this.line_index = line_index;
        this.first_unit_index = first_unit_index;
        this.end_unit_index = end_unit_index;
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
    First_Unit_Index() {
        return this.first_unit_index;
    }
    End_Unit_Index() {
        return this.end_unit_index;
    }
}
