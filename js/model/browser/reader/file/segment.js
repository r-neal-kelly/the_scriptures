import * as Utils from "../../../../utils.js";
import * as File from "./instance.js";
import * as Part from "./part.js";
export class Instance {
    static Min_Part_Count() {
        return File.Instance.Min_Part_Count();
    }
    constructor({ line, index, text, }) {
        this.line = line;
        this.index = index;
        this.text = text;
        this.parts = [];
        if (text == null) {
            Utils.Assert(line == null, `line must be null.`);
            Utils.Assert(index == null, `index must be null.`);
        }
        else {
            Utils.Assert(line != null, `line must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            for (let idx = 0, end = text.Part_Count(); idx < end; idx += 1) {
                this.parts.push(new Part.Instance({
                    segment: this,
                    index: idx,
                    text: text.Part(idx),
                }));
            }
        }
    }
    Is_Blank() {
        return this.text == null;
    }
    Line() {
        Utils.Assert(this.line != null, `Doesn't have line.`);
        return this.line;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Part_Count() {
        return this.parts.length;
    }
    Part_At(part_index) {
        Utils.Assert(part_index > -1, `part_index (${part_index}) must be greater than -1.`);
        if (part_index < this.Part_Count()) {
            return this.parts[part_index];
        }
        else {
            return Instance.blank_part;
        }
    }
}
Instance.blank_part = new Part.Instance({
    segment: null,
    index: null,
    text: null,
});
