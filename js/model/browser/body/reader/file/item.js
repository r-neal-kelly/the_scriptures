import * as Utils from "../../../../../utils.js";
import * as Entity from "../../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ segment, index, text, }) {
        super();
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
            if (text.Is_Part() && text.Is_Command()) {
                this.value = ``;
            }
            else {
                this.value = text.Value()
                    .replace(/^ /, ` `)
                    .replace(/ $/, ` `)
                    .replace(/  /g, `  `);
            }
        }
        this.Is_Ready_After([]);
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
    Value() {
        return this.value;
    }
    Part() {
        Utils.Assert(!this.Is_Blank(), `Item is blank and doesn't have a part.`);
        const text = this.Text();
        if (text.Is_Part()) {
            return text;
        }
        else {
            return text.Break();
        }
    }
    Is_Blank() {
        return this.text == null;
    }
    Is_Indented() {
        Utils.Assert(!this.Is_Blank(), `Item is blank and can't be indented.`);
        return (this.Index() === 0 &&
            this.Segment().Index() === 0 &&
            this.Segment().Line().Text().Is_Indented());
    }
    Is_Error() {
        return this.Part().Is_Error();
    }
    Has_Italic_Style() {
        return this.Part().Has_Italic_Style();
    }
    Has_Bold_Style() {
        return this.Part().Has_Bold_Style();
    }
    Has_Underline_Style() {
        return this.Part().Has_Underline_Style();
    }
    Has_Small_Caps_Style() {
        return this.Part().Has_Small_Caps_Style();
    }
    Has_Error_Style() {
        return this.Part().Has_Error_Style();
    }
}
