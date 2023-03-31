import * as Utils from "../../../../utils.js";
import * as Item from "./item.js";
export class Instance {
    constructor({ item, index, text, }) {
        this.item = item;
        this.index = index;
        this.text = text;
        if (text == null) {
            Utils.Assert(item == null, `item must be null.`);
            Utils.Assert(index == null, `index must be null.`);
            this.value = ``;
        }
        else {
            Utils.Assert(item != null, `item must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            this.value = Item.Instance.Text_Value(text);
        }
    }
    Item() {
        Utils.Assert(this.item != null, `Doesn't have item.`);
        return this.item;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Part() {
        Utils.Assert(!this.Is_Blank(), `Sub_Item is blank and doesn't have a part.`);
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
    Value() {
        return this.value;
    }
    Is_Blank() {
        return this.text == null;
    }
    Is_Indented() {
        Utils.Assert(!this.Is_Blank(), `Sub_Item is blank and can't be indented.`);
        return (this.Index() === 0 &&
            this.Item().Is_Indented());
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
