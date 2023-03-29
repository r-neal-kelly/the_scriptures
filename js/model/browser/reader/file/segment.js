import * as Utils from "../../../../utils.js";
import * as Parts from "./parts.js";
export class Instance {
    constructor({ segments, index, text, }) {
        this.segments = segments;
        this.index = index;
        this.text = text;
        this.parts = new Parts.Instance({
            segment: this,
            text: text,
        });
        if (text == null) {
            Utils.Assert(segments == null, `segments must be null.`);
            Utils.Assert(index == null, `index must be null.`);
        }
        else {
            Utils.Assert(segments != null, `segments must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
        }
    }
    Segments() {
        Utils.Assert(this.segments != null, `Doesn't have segments.`);
        return this.segments;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Parts() {
        return this.parts;
    }
    Is_Blank() {
        return this.text == null;
    }
}
