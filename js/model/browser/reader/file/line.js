import * as Utils from "../../../../utils.js";
import * as Segments from "./segments.js";
export class Instance {
    constructor({ lines, index, text, }) {
        this.lines = lines;
        this.index = index;
        this.text = text;
        this.segments = new Segments.Instance({
            line: this,
            text: text,
        });
        if (text == null) {
            Utils.Assert(lines == null, `lines must be null.`);
            Utils.Assert(index == null, `index must be null.`);
        }
        else {
            Utils.Assert(lines != null, `lines must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
        }
    }
    Lines() {
        Utils.Assert(this.lines != null, `Doesn't have lines.`);
        return this.lines;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Segments() {
        return this.segments;
    }
    Is_Blank() {
        return this.text == null;
    }
}
