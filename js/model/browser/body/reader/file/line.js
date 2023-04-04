import * as Utils from "../../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Segment from "./segment.js";
export class Instance extends Entity.Instance {
    static Min_Segment_Count() {
        return Instance.min_segment_count;
    }
    static Set_Min_Segment_Count(min_segment_count) {
        Utils.Assert(min_segment_count >= 0, `min_segment_count must be greater than or equal to 0.`);
        Instance.min_segment_count = min_segment_count;
    }
    constructor({ file, index, text, }) {
        super();
        this.file = file;
        this.index = index;
        this.text = text;
        this.segments = [];
        if (text == null) {
            Utils.Assert(file == null, `file must be null.`);
            Utils.Assert(index == null, `index must be null.`);
        }
        else {
            Utils.Assert(file != null, `file must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            for (let idx = 0, end = text.Macro_Segment_Count(); idx < end; idx += 1) {
                this.segments.push(new Segment.Instance({
                    line: this,
                    index: idx,
                    text: text.Macro_Segment(idx),
                }));
            }
        }
        this.Is_Ready_After(this.segments);
    }
    File() {
        Utils.Assert(this.file != null, `Doesn't have file.`);
        return this.file;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Segment_Count() {
        return this.segments.length;
    }
    Segment_At(segment_index) {
        Utils.Assert(segment_index > -1, `segment_index (${segment_index}) must be greater than -1.`);
        if (segment_index < this.Segment_Count()) {
            return this.segments[segment_index];
        }
        else {
            return Instance.blank_segment;
        }
    }
    Is_Blank() {
        return this.text == null;
    }
}
Instance.min_segment_count = 70;
Instance.blank_segment = new Segment.Instance({
    line: null,
    index: null,
    text: null,
});
