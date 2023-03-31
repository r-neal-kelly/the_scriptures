import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";
import * as Dictionary from "./dictionary.js";
import * as Part from "./item/part.js";
import * as Split from "./item/split.js";
import * as Segment from "./item/segment.js";
export class Instance {
    constructor({ text, value, }) {
        this.text = text;
        this.value = ``;
        this.micro_parts = [];
        this.macro_parts = [];
        this.micro_items = [];
        this.macro_items = [];
        this.is_centered = false;
        this.is_indented = false;
        this.Set_Value(value);
    }
    Text() {
        return this.text;
    }
    Index() {
        return this.Text().Line_Index(this);
    }
    Value() {
        return this.value;
    }
    Set_Value(value) {
        Utils.Assert(!/\r?\n/.test(value), `A line cannot have any line-breaks.`);
        this.value = value;
        this.micro_parts = [];
        this.macro_parts = [];
        this.micro_items = [];
        this.macro_items = [];
        this.is_centered =
            this.value.slice(0, Part.Command.Known_Value.CENTER.length) === Part.Command.Known_Value.CENTER;
        this.is_indented =
            this.value.slice(0, Part.Command.Known_Value.INDENT.length) === Part.Command.Known_Value.INDENT;
        let Current_Type;
        (function (Current_Type) {
            Current_Type[Current_Type["WORD"] = 0] = "WORD";
            Current_Type[Current_Type["BREAK"] = 1] = "BREAK";
            Current_Type[Current_Type["POINT"] = 2] = "POINT";
        })(Current_Type || (Current_Type = {}));
        const dictionary = this.Text().Dictionary();
        let current_style = Part.Style._NONE_;
        let current_type = Current_Type.POINT;
        let current_start = new Unicode.Iterator({
            text: this.value,
        });
        let first_non_command_index = null;
        const last_non_command_index = Part.Command.Last_Non_Value_Index(this.value);
        let current_micro_segment = new Segment.Instance({
            segment_type: Segment.Type.MICRO,
        });
        let current_macro_segment = new Segment.Instance({
            segment_type: Segment.Type.MACRO,
        });
        const Update_With_Micro_Item = function (item) {
            if (!current_micro_segment.Try_Add_Item(item)) {
                if (current_micro_segment.Item_Count() > 1) {
                    this.micro_items.push(current_micro_segment);
                }
                else {
                    this.micro_items.push(current_micro_segment.Item(0));
                }
                current_micro_segment = new Segment.Instance({
                    segment_type: Segment.Type.MICRO,
                });
                current_micro_segment.Add_Item(item);
            }
        }.bind(this);
        const Update_With_Macro_Item = function (item) {
            if (!current_macro_segment.Try_Add_Item(item)) {
                if (current_macro_segment.Item_Count() > 1) {
                    this.macro_items.push(current_macro_segment);
                }
                else {
                    this.macro_items.push(current_macro_segment.Item(0));
                }
                current_macro_segment = new Segment.Instance({
                    segment_type: Segment.Type.MACRO,
                });
                current_macro_segment.Add_Item(item);
            }
        }.bind(this);
        for (let it = current_start; !it.Is_At_End();) {
            const maybe_valid_command = Part.Command.Maybe_Valid_Value_From(it.Points());
            if (maybe_valid_command != null) {
                const command = new Part.Command.Instance({
                    value: maybe_valid_command,
                });
                if (command.Is_Open_Italic()) {
                    current_style |= Part.Style.ITALIC;
                }
                else if (command.Is_Close_Italic()) {
                    current_style &= ~Part.Style.ITALIC;
                }
                else if (command.Is_Open_Bold()) {
                    current_style |= Part.Style.BOLD;
                }
                else if (command.Is_Close_Bold()) {
                    current_style &= ~Part.Style.BOLD;
                }
                else if (command.Is_Open_Underline()) {
                    current_style |= Part.Style.UNDERLINE;
                }
                else if (command.Is_Close_Underline()) {
                    current_style &= ~Part.Style.UNDERLINE;
                }
                else if (command.Is_Open_Small_Caps()) {
                    current_style |= Part.Style.SMALL_CAPS;
                }
                else if (command.Is_Close_Small_Caps()) {
                    current_style &= ~Part.Style.SMALL_CAPS;
                }
                else if (command.Is_Open_Error()) {
                    current_style |= Part.Style.ERROR;
                }
                else if (command.Is_Close_Error()) {
                    current_style &= ~Part.Style.ERROR;
                }
                this.micro_parts.push(command);
                this.macro_parts.push(command);
                Update_With_Micro_Item(command);
                Update_With_Macro_Item(command);
                it = new Unicode.Iterator({
                    text: it.Text(),
                    index: it.Index() + maybe_valid_command.length,
                });
                current_start = it;
            }
            else {
                const this_point = it.Point();
                const next_point = it.Look_Forward_Point();
                const next_maybe_valid_command = Part.Command.Maybe_Valid_Value_From(it.Look_Forward_Points() || ``);
                if (dictionary.Has_Letter(this_point)) {
                    const point = new Part.Letter.Instance({
                        value: this_point,
                        style: current_style,
                    });
                    this.micro_parts.push(point);
                    Update_With_Micro_Item(point);
                    current_type = Current_Type.WORD;
                }
                else if (dictionary.Has_Marker(this_point)) {
                    const point = new Part.Marker.Instance({
                        value: this_point,
                        style: current_style,
                    });
                    this.micro_parts.push(point);
                    Update_With_Micro_Item(point);
                    current_type = Current_Type.BREAK;
                }
                else {
                    const point = new Part.Point.Instance({
                        value: this_point,
                        style: current_style,
                    });
                    this.micro_parts.push(point);
                    Update_With_Micro_Item(point);
                    current_type = Current_Type.POINT;
                    if (first_non_command_index == null) {
                        first_non_command_index = it.Index();
                    }
                    this.macro_parts.push(point);
                    Update_With_Macro_Item(point);
                    current_start = it.Next();
                }
                if (current_type === Current_Type.WORD) {
                    if (next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Letter(next_point)) {
                        if (first_non_command_index == null) {
                            first_non_command_index = it.Index();
                        }
                        const word = it.Text().slice(current_start.Index(), it.Look_Forward_Index());
                        const status = dictionary.Has_Word(word) ?
                            Part.Status.GOOD :
                            dictionary.Has_Word_Error(word) ?
                                Part.Status.ERROR :
                                Part.Status.UNKNOWN;
                        const part = new Part.Word.Instance({
                            value: word,
                            status: status,
                            style: current_style,
                        });
                        this.macro_parts.push(part);
                        Update_With_Macro_Item(part);
                        current_start = it.Next();
                    }
                }
                else if (current_type === Current_Type.BREAK) {
                    if (next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Marker(next_point)) {
                        if (first_non_command_index == null) {
                            first_non_command_index = it.Index();
                        }
                        const break_ = it.Text().slice(current_start.Index(), it.Look_Forward_Index());
                        const boundary = it.Index() === first_non_command_index ?
                            Dictionary.Boundary.START :
                            it.Index() === last_non_command_index ?
                                Dictionary.Boundary.END :
                                Dictionary.Boundary.MIDDLE;
                        const status = dictionary.Has_Break(break_, boundary) ?
                            Part.Status.GOOD :
                            dictionary.Has_Break_Error(break_, boundary) ?
                                Part.Status.ERROR :
                                Part.Status.UNKNOWN;
                        const part = new Part.Break.Instance({
                            value: break_,
                            status: status,
                            style: current_style,
                        });
                        this.macro_parts.push(part);
                        const splits = Split.From(part);
                        for (const split of splits) {
                            Update_With_Macro_Item(split);
                        }
                        current_start = it.Next();
                    }
                }
                it = it.Next();
            }
        }
        if (current_micro_segment.Item_Count() > 1) {
            this.micro_items.push(current_micro_segment);
        }
        else if (current_micro_segment.Item_Count() > 0) {
            this.micro_items.push(current_micro_segment.Item(0));
        }
        if (current_macro_segment.Item_Count() > 1) {
            this.macro_items.push(current_macro_segment);
        }
        else if (current_macro_segment.Item_Count() > 0) {
            this.macro_items.push(current_macro_segment.Item(0));
        }
    }
    Micro_Part_Count() {
        return this.micro_parts.length;
    }
    Micro_Part(micro_part_index) {
        Utils.Assert(micro_part_index > -1, `micro_part_index must be greater than -1.`);
        Utils.Assert(micro_part_index < this.Micro_Part_Count(), `micro_part_index must be less than micro_part_count.`);
        return this.micro_parts[micro_part_index];
    }
    Macro_Part_Count() {
        return this.macro_parts.length;
    }
    Macro_Part(macro_part_index) {
        Utils.Assert(macro_part_index > -1, `macro_part_index must be greater than -1.`);
        Utils.Assert(macro_part_index < this.Macro_Part_Count(), `macro_part_index must be less than macro_part_count.`);
        return this.macro_parts[macro_part_index];
    }
    Micro_Item_Count() {
        return this.micro_items.length;
    }
    Micro_Item(micro_item_index) {
        Utils.Assert(micro_item_index > -1, `micro_item_index must be greater than -1.`);
        Utils.Assert(micro_item_index < this.Micro_Item_Count(), `micro_item_index must be less than micro_item_count.`);
        return this.micro_items[micro_item_index];
    }
    Macro_Item_Count() {
        return this.macro_items.length;
    }
    Macro_Item(macro_item_index) {
        Utils.Assert(macro_item_index > -1, `macro_item_index must be greater than -1.`);
        Utils.Assert(macro_item_index < this.Macro_Item_Count(), `macro_item_index must be less than macro_item_count.`);
        return this.macro_items[macro_item_index];
    }
    Is_Centered() {
        return this.is_centered;
    }
    Is_Indented() {
        return this.is_indented;
    }
}
