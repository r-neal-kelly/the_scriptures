import * as Utils from "../../../../utils.js";
export class Instance {
    constructor({ parts, index, text, }) {
        this.parts = parts;
        this.index = index;
        this.text = text;
        if (text == null) {
            Utils.Assert(parts == null, `parts must be null.`);
            Utils.Assert(index == null, `index must be null.`);
        }
        else {
            Utils.Assert(parts != null, `parts must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
        }
    }
    Parts() {
        Utils.Assert(this.parts != null, `Doesn't have parts.`);
        return this.parts;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Is_Blank() {
        return this.text == null;
    }
    Is_Indented() {
        return (this.Index() === 0 &&
            this.Parts().Segment().Index() === 0 &&
            this.Parts().Segment().Segments().Line().Text().Is_Indented());
    }
}
