import * as Utils from "../../../../utils.js";
export class Instance {
    constructor({ segment, index, text, }) {
        this.segment = segment;
        this.index = index;
        this.text = text;
        if (text == null) {
            Utils.Assert(segment == null, `segment must be null.`);
            Utils.Assert(index == null, `index must be null.`);
            this.value = ``;
        }
        else {
            Utils.Assert(segment != null, `segment must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            if (text.Is_Command()) {
                this.value = ``;
            }
            else {
                this.value = text.Value()
                    .replace(/^ /, ` `)
                    .replace(/ $/, ` `)
                    .replace(/  /g, `  `);
            }
        }
    }
    Is_Blank() {
        return this.text == null;
    }
    Segment() {
        Utils.Assert(this.segment != null, `Doesn't have segment.`);
        return this.segment;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Is_Indented() {
        Utils.Assert(!this.Is_Blank(), `Part is blank and can't be indented.`);
        return (this.Index() === 0 &&
            this.Segment().Index() === 0 &&
            this.Segment().Line().Text().Is_Indented());
    }
    Value() {
        return this.value;
    }
}
