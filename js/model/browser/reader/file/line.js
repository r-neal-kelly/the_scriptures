import * as Utils from "../../../../utils.js";
import * as File from "./instance.js";
import * as Segment from "./segment.js";
export class Instance {
    static Min_Segment_Count() {
        return File.Instance.Min_Segment_Count();
    }
    constructor({ file, index, text, }) {
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
            for (let idx = 0, end = text.Part_Segment_Count(); idx < end; idx += 1) {
                this.segments.push(new Segment.Instance({
                    line: this,
                    index: idx,
                    text: text.Part_Segment(idx),
                }));
            }
        }
    }
    Is_Blank() {
        return this.text == null;
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
}
Instance.blank_segment = new Segment.Instance({
    line: null,
    index: null,
    text: null,
});
