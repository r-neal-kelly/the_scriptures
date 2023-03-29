import * as Utils from "../../../../utils.js";
import * as Lines from "./lines.js";
export class Instance {
    static Min_Line_Count() {
        return Instance.min_line_count;
    }
    static Set_Min_Line_Count(min_line_count) {
        Utils.Assert(min_line_count >= 0, `min_line_count must be greater than or equal to 0.`);
        Instance.min_line_count = min_line_count;
    }
    static Min_Segment_Count() {
        return Instance.min_segment_count;
    }
    static Set_Min_Segment_Count(min_segment_count) {
        Utils.Assert(min_segment_count >= 0, `min_segment_count must be greater than or equal to 0.`);
        Instance.min_segment_count = min_segment_count;
    }
    static Min_Part_Count() {
        return Instance.min_part_count;
    }
    static Set_Min_Part_Count(min_part_count) {
        Utils.Assert(min_part_count >= 0, `min_part_count must be greater than or equal to 0.`);
        Instance.min_part_count = min_part_count;
    }
    constructor({ reader, data, text, }) {
        this.reader = reader;
        this.data = data;
        this.text = text;
        this.lines = new Lines.Instance({
            file: this,
            text: text,
        });
    }
    Reader() {
        return this.reader;
    }
    Data() {
        Utils.Assert(this.data != null, `Has no data.`);
        return this.data;
    }
    Maybe_Data() {
        return this.data;
    }
    Text() {
        return this.text;
    }
    Lines() {
        return this.lines;
    }
}
Instance.min_line_count = 40;
Instance.min_segment_count = 50;
Instance.min_part_count = 2;
