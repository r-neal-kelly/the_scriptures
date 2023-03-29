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
        this.points = [];
        this.parts = [];
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
        this.points = [];
        this.parts = [];
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
                this.points.push(command);
                this.parts.push(command);
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
                    this.points.push(point);
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
                    this.points.push(point);
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
                    this.points.push(point);
                    if (!current_point_segment.Try_Add_Part(point)) {
                        this.point_segments.push(current_point_segment);
                        current_point_segment = new Segment.Instance();
                        current_point_segment.Add_Part(point);
                    }
                    current_type = Current_Type.POINT;
                    // Saves us memory to do this here rather than
                    // create another part for this point below.
                    if (first_non_command_index == null) {
                        first_non_command_index = it.Index();
                    }
                    this.parts.push(point);
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
                        this.parts.push(part);
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
                            // This check fails when one or more commands are the end of the string.
                            // We'll need to read the string backwards, so we'll need to update
                            // the iterator and make a function probably in Command that tells us
                            // the index of the last point in the string that is not part of a
                            // command value. Then we'll need to compare that with the next point's
                            // index, which means we'll need to keep it as an iterator | null.
                            // So the command function can simply return an iterator also.
                            // In the even that the whole string is a command, it should return null.
                            next_point == null ?
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
                        this.parts.push(part);
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
    Points() {
        return Array.from(this.points);
    }
    Parts() {
        return Array.from(this.parts);
    }
    Is_Centered() {
        return this.is_centered;
    }
    Is_Indented() {
        return this.is_indented;
    }
}
