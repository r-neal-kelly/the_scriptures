import * as Utils from "../../../../utils.js";
import * as File from "./instance.js";
import * as Segment from "./segment.js";
export class Instance {
    static Min_Count() {
        return File.Instance.Min_Segment_Count();
    }
    constructor({ line, text, }) {
        this.line = line;
        this.segments = [];
        if (text != null) {
            for (let idx = 0, end = text.Part_Segment_Count(); idx < end; idx += 1) {
                this.segments.push(new Segment.Instance({
                    segments: this,
                    index: idx,
                    text: text.Part_Segment(idx),
                }));
            }
        }
    }
    Line() {
        return this.line;
    }
    Count() {
        return this.segments.length;
    }
    At(segment_index) {
        Utils.Assert(segment_index > -1, `segment_index (${segment_index}) must be greater than -1.`);
        if (segment_index < this.Count()) {
            return this.segments[segment_index];
        }
        else {
            return Instance.blank_segment;
        }
    }
}
Instance.blank_segment = new Segment.Instance({
    segments: null,
    index: null,
    text: null,
});
