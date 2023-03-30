import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";
import * as Dictionary from "./dictionary.js";
import * as Segment from "./segment.js";
import { Status } from "./part/status.js";
import { Style } from "./part/style.js";
import * as Command from "./part/command.js";
import * as Word from "./part/word.js";
import * as Break from "./part/break.js";
import * as Letter from "./part/letter.js";
import * as Marker from "./part/marker.js";
import * as Point from "./part/point.js";
export class Instance {
    constructor({ text, value, }) {
        this.text = text;
        this.value = ``;
        this.point_segments = [];
        this.part_segments = [];
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
        this.point_segments = [];
        this.part_segments = [];
        this.is_centered =
            this.value.slice(0, Command.Known_Value.CENTER.length) === Command.Known_Value.CENTER;
        this.is_indented =
            this.value.slice(0, Command.Known_Value.INDENT.length) === Command.Known_Value.INDENT;
        let Current_Type;
        (function (Current_Type) {
            Current_Type[Current_Type["WORD"] = 0] = "WORD";
            Current_Type[Current_Type["BREAK"] = 1] = "BREAK";
            Current_Type[Current_Type["POINT"] = 2] = "POINT";
        })(Current_Type || (Current_Type = {}));
        const dictionary = this.Text().Dictionary();
        let current_style = Style._NONE_;
        let current_type = Current_Type.POINT;
        let current_start = new Unicode.Iterator({
            text: this.value,
        });
        let first_non_command_index = null;
        const last_non_command_index = Command.Last_Non_Value_Index(this.value);
        let current_point_segment = new Segment.Instance();
        let current_part_segment = new Segment.Instance();
        for (let it = current_start; !it.Is_At_End();) {
            const maybe_valid_command = Command.Maybe_Valid_Value_From(it.Points());
            if (maybe_valid_command != null) {
                const command = new Command.Instance({
                    value: maybe_valid_command,
                });
                if (command.Is_Open_Italic()) {
                    current_style |= Style.ITALIC;
                }
                else if (command.Is_Close_Italic()) {
                    current_style &= ~Style.ITALIC;
                }
                else if (command.Is_Open_Bold()) {
                    current_style |= Style.BOLD;
                }
                else if (command.Is_Close_Bold()) {
                    current_style &= ~Style.BOLD;
                }
                else if (command.Is_Open_Underline()) {
                    current_style |= Style.UNDERLINE;
                }
                else if (command.Is_Close_Underline()) {
                    current_style &= ~Style.UNDERLINE;
                }
                else if (command.Is_Open_Small_Caps()) {
                    current_style |= Style.SMALL_CAPS;
                }
                else if (command.Is_Close_Small_Caps()) {
                    current_style &= ~Style.SMALL_CAPS;
                }
                else if (command.Is_Open_Error()) {
                    current_style |= Style.ERROR;
                }
                else if (command.Is_Close_Error()) {
                    current_style &= ~Style.ERROR;
                }
                if (!current_point_segment.Try_Add_Part(command)) {
                    this.point_segments.push(current_point_segment);
                    current_point_segment = new Segment.Instance();
                    current_point_segment.Add_Part(command);
                }
                if (!current_part_segment.Try_Add_Part(command)) {
                    this.part_segments.push(current_part_segment);
                    current_part_segment = new Segment.Instance();
                    current_part_segment.Add_Part(command);
                }
                it = new Unicode.Iterator({
                    text: it.Text(),
                    index: it.Index() + maybe_valid_command.length,
                });
                current_start = it;
            }
            else {
                const this_point = it.Point();
                const next_point = it.Look_Forward_Point();
                const next_maybe_valid_command = Command.Maybe_Valid_Value_From(it.Look_Forward_Points() || ``);
                if (dictionary.Has_Letter(this_point)) {
                    const point = new Letter.Instance({
                        value: this_point,
                        style: current_style,
                    });
                    if (!current_point_segment.Try_Add_Part(point)) {
                        this.point_segments.push(current_point_segment);
                        current_point_segment = new Segment.Instance();
                        current_point_segment.Add_Part(point);
                    }
                    current_type = Current_Type.WORD;
                }
                else if (dictionary.Has_Marker(this_point)) {
                    const point = new Marker.Instance({
                        value: this_point,
                        style: current_style,
                    });
                    if (!current_point_segment.Try_Add_Part(point)) {
                        this.point_segments.push(current_point_segment);
                        current_point_segment = new Segment.Instance();
                        current_point_segment.Add_Part(point);
                    }
                    current_type = Current_Type.BREAK;
                }
                else {
                    const point = new Point.Instance({
                        value: this_point,
                        style: current_style,
                    });
                    if (!current_point_segment.Try_Add_Part(point)) {
                        this.point_segments.push(current_point_segment);
                        current_point_segment = new Segment.Instance();
                        current_point_segment.Add_Part(point);
                    }
                    current_type = Current_Type.POINT;
                    if (first_non_command_index == null) {
                        first_non_command_index = it.Index();
                    }
                    if (!current_part_segment.Try_Add_Part(point)) {
                        this.part_segments.push(current_part_segment);
                        current_part_segment = new Segment.Instance();
                        current_part_segment.Add_Part(point);
                    }
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
                            Status.GOOD :
                            dictionary.Has_Word_Error(word) ?
                                Status.ERROR :
                                Status.UNKNOWN;
                        const part = new Word.Instance({
                            value: word,
                            status: status,
                            style: current_style,
                        });
                        if (!current_part_segment.Try_Add_Part(part)) {
                            this.part_segments.push(current_part_segment);
                            current_part_segment = new Segment.Instance();
                            current_part_segment.Add_Part(part);
                        }
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
                            Status.GOOD :
                            dictionary.Has_Break_Error(break_, boundary) ?
                                Status.ERROR :
                                Status.UNKNOWN;
                        const part = new Break.Instance({
                            value: break_,
                            status: status,
                            style: current_style,
                        });
                        if (!current_part_segment.Try_Add_Part(part)) {
                            this.part_segments.push(current_part_segment);
                            current_part_segment = new Segment.Instance();
                            current_part_segment.Add_Part(part);
                        }
                        current_start = it.Next();
                    }
                }
                it = it.Next();
            }
        }
        this.point_segments.push(current_point_segment);
        this.part_segments.push(current_part_segment);
    }
    Point_Segment_Count() {
        return this.point_segments.length;
    }
    Point_Segment(point_segment_index) {
        Utils.Assert(point_segment_index > -1, `point_segment_index must be greater than -1.`);
        Utils.Assert(point_segment_index < this.Point_Segment_Count(), `point_segment_index must be less than point_segment_count.`);
        return this.point_segments[point_segment_index];
    }
    Part_Segment_Count() {
        return this.part_segments.length;
    }
    Part_Segment(part_segment_index) {
        Utils.Assert(part_segment_index > -1, `part_segment_index must be greater than -1.`);
        Utils.Assert(part_segment_index < this.Part_Segment_Count(), `part_segment_index must be less than part_segment_count.`);
        return this.part_segments[part_segment_index];
    }
    Is_Centered() {
        return this.is_centered;
    }
    Is_Indented() {
        return this.is_indented;
    }
}
