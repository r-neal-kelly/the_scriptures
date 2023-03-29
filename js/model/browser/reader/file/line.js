import * as Utils from "../../../../utils.js";
import * as Parts from "./parts.js";
export class Instance {
    constructor({ lines, index, text, }) {
        this.lines = lines;
        this.index = index;
        this.text = text;
        if (text == null) {
            Utils.Assert(lines == null, `lines must be null.`);
            Utils.Assert(index == null, `index must be null.`);
            this.parts = new Parts.Instance({
                line: this,
                text: [],
            });
        }
        else {
            Utils.Assert(lines != null, `lines must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            this.parts = new Parts.Instance({
                line: this,
                text: text.Parts(), // we should just pass the text and let the parts iterate it
            });
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
    Parts() {
        return this.parts;
    }
    Is_Blank() {
        return this.text == null;
    }
}
