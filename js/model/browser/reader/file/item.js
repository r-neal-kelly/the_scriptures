import * as Utils from "../../../../utils.js";
import * as Text from "../../../text.js";
import * as Sub_Item from "./sub_item.js";
export class Instance {
    static Text_Value(item) {
        Utils.Assert(!item.Is_Segment(), `Invalid item_type.`);
        if (item.Is_Part() && item.Is_Command()) {
            return ``;
        }
        else {
            return item.Value()
                .replace(/^ /, ` `)
                .replace(/ $/, ` `)
                .replace(/  /g, `  `);
        }
    }
    constructor({ line, index, text, }) {
        this.line = line;
        this.index = index;
        this.text = text;
        this.sub_items = null;
        this.value = null;
        if (text == null) {
            Utils.Assert(line == null, `line must be null.`);
            Utils.Assert(index == null, `index must be null.`);
            this.value = ``;
        }
        else {
            Utils.Assert(line != null, `line must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            if (text.Is_Segment()) {
                const segment = text;
                this.sub_items = [];
                for (let idx = 0, end = segment.Item_Count(); idx < end; idx += 1) {
                    this.sub_items.push(new Sub_Item.Instance({
                        item: this,
                        index: idx,
                        text: segment.Item(idx),
                    }));
                }
            }
            else {
                this.value = Instance.Text_Value(text);
            }
        }
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
    Has_Part() {
        return (!this.Is_Blank() &&
            !(this.Text() instanceof Text.Item.Segment.Instance));
    }
    Part() {
        Utils.Assert(this.Has_Part(), `Doesn't have a part.`);
        const text = this.Text();
        if (text.Is_Part()) {
            return text;
        }
        else if (text.Is_Split()) {
            return text.Break();
        }
        else {
            Utils.Assert(false, `Invalid item_type.`);
            return text;
        }
    }
    Has_Value() {
        return this.value != null;
    }
    Value() {
        if (this.Is_Blank()) {
            return ``;
        }
        else {
            Utils.Assert(this.Has_Value(), `This item has no value but rather sub_items, which have their own values.`);
            return this.value;
        }
    }
    Is_Blank() {
        return this.text == null;
    }
    Is_Indented() {
        Utils.Assert(!this.Is_Blank(), `Item is blank and can't be indented.`);
        return (this.Index() === 0 &&
            this.Line().Text().Is_Indented());
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
    Sub_Item_Count() {
        if (this.sub_items != null) {
            return this.sub_items.length;
        }
        else {
            return 0;
        }
    }
    Sub_Item_At(sub_item_index) {
        Utils.Assert(sub_item_index > -1, `sub_item_index (${sub_item_index}) must be greater than -1.`);
        if (this.sub_items != null) {
            if (sub_item_index < this.Sub_Item_Count()) {
                return this.sub_items[sub_item_index];
            }
            else {
                return Instance.blank_sub_item;
            }
        }
        else {
            return Instance.blank_sub_item;
        }
    }
}
Instance.blank_sub_item = new Sub_Item.Instance({
    item: null,
    index: null,
    text: null,
});
