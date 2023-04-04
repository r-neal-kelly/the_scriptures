var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "./utils.js";
import * as Unicode from "./unicode.js";
import * as Model from "./model/text.js";
function Escape_Text(text) {
    return text.replaceAll(/./g, function (point) {
        if (point === ` `) {
            return `&#${` `.charCodeAt(0)};`;
        }
        else {
            const code = point.charCodeAt(0);
            if (code < 0xD800 || code > 0xDFFF) {
                return `&#${code};`;
            }
            else {
                // why bother escaping anything outside of the BMP
                return point;
            }
        }
    });
}
function Text_Offset_To_Node(from, to) {
    if (from === to) {
        return 0;
    }
    else {
        let offset = 0;
        for (const child_node of from.childNodes) {
            if (child_node === to) {
                return offset;
            }
            else if (child_node.contains(to)) {
                return offset + Text_Offset_To_Node(child_node, to);
            }
            else {
                if (child_node.textContent) {
                    offset += child_node.textContent.length;
                }
                else {
                    offset += 0;
                }
            }
        }
        return offset;
    }
}
;
function Text_Offset(element) {
    const selection = document.getSelection();
    if (selection) {
        if (selection.isCollapsed) {
            if (selection.anchorNode &&
                (selection.anchorNode === element ||
                    element.contains(selection.anchorNode))) {
                return Text_Offset_To_Node(element, selection.anchorNode) + selection.anchorOffset;
            }
            else {
                return null;
            }
        }
        else {
            if (selection.anchorNode &&
                selection.focusNode &&
                (selection.anchorNode === element ||
                    element.contains(selection.anchorNode)) &&
                (selection.focusNode === element ||
                    element.contains(selection.focusNode))) {
                // this needs a better check. we want to know which is the start and end nodes
                // but this doesn't work correctly if the anchor and focus are not the same text node
                if (selection.anchorOffset < selection.focusOffset) {
                    if (selection.focusNode instanceof Text) {
                        return Text_Offset_To_Node(element, selection.focusNode) +
                            selection.focusOffset;
                    }
                    else {
                        if (selection.focusNode.textContent) {
                            return Text_Offset_To_Node(element, selection.focusNode) +
                                selection.focusNode.textContent.length;
                        }
                        else {
                            return Text_Offset_To_Node(element, selection.focusNode);
                        }
                    }
                }
                else {
                    if (selection.anchorNode instanceof Text) {
                        return Text_Offset_To_Node(element, selection.anchorNode) +
                            selection.anchorOffset;
                    }
                    else {
                        if (selection.anchorNode.textContent) {
                            return Text_Offset_To_Node(element, selection.anchorNode) +
                                selection.anchorNode.textContent.length;
                        }
                        else {
                            return Text_Offset_To_Node(element, selection.anchorNode);
                        }
                    }
                }
            }
            else {
                return null;
            }
        }
    }
    else {
        return null;
    }
}
function Set_Text_Offset(element, offset) {
    class Node_And_Offset {
        constructor({ node, offset, }) {
            this.node = node;
            this.offset = offset;
        }
    }
    ;
    function Text_Offset_To_Node_And_Offset(node, target_offset, current_offset = 0) {
        for (const child_node of node.childNodes) {
            if (child_node instanceof Text) {
                const text_length = child_node.textContent ?
                    child_node.textContent.length :
                    0;
                current_offset += text_length;
                if (current_offset >= target_offset) {
                    return new Node_And_Offset({
                        node: child_node,
                        offset: target_offset - (current_offset - text_length),
                    });
                }
            }
            else {
                const maybe_node_and_offset = Text_Offset_To_Node_And_Offset(child_node, target_offset, current_offset);
                if (maybe_node_and_offset instanceof Node_And_Offset) {
                    return maybe_node_and_offset;
                }
                else {
                    current_offset = maybe_node_and_offset;
                }
            }
        }
        return current_offset;
    }
    element.focus();
    const selection = document.getSelection();
    if (selection) {
        const maybe_node_and_offset = Text_Offset_To_Node_And_Offset(element, offset);
        if (maybe_node_and_offset instanceof Node_And_Offset) {
            selection.collapse(maybe_node_and_offset.node, maybe_node_and_offset.offset);
        }
        else {
            selection.collapse(element, maybe_node_and_offset);
        }
    }
}
var Part_Class;
(function (Part_Class) {
    Part_Class[Part_Class["_NONE_"] = -1] = "_NONE_";
    Part_Class[Part_Class["UNKNOWN_POINT"] = 0] = "UNKNOWN_POINT";
    Part_Class[Part_Class["KNOWN_LETTER"] = 1] = "KNOWN_LETTER";
    Part_Class[Part_Class["KNOWN_MARKER"] = 2] = "KNOWN_MARKER";
    Part_Class[Part_Class["UNKNOWN_WORD"] = 3] = "UNKNOWN_WORD";
    Part_Class[Part_Class["KNOWN_WORD"] = 4] = "KNOWN_WORD";
    Part_Class[Part_Class["UNKNOWN_BREAK"] = 5] = "UNKNOWN_BREAK";
    Part_Class[Part_Class["KNOWN_BREAK"] = 6] = "KNOWN_BREAK";
    Part_Class[Part_Class["KNOWN_WORD_ERROR"] = 7] = "KNOWN_WORD_ERROR";
    Part_Class[Part_Class["KNOWN_BREAK_ERROR"] = 8] = "KNOWN_BREAK_ERROR";
})(Part_Class || (Part_Class = {}));
;
function First_Part_Index(element) {
    for (let idx = 0, end = element.children.length; idx < end;) {
        if (!element.children[idx].classList.contains(`COMMAND`)) {
            return idx;
        }
        idx += 1;
    }
    return null;
}
function Last_Part_Index(element) {
    for (let idx = element.children.length, end = 0; idx > end;) {
        idx -= 1;
        if (!element.children[idx].classList.contains(`COMMAND`)) {
            return idx;
        }
    }
    return null;
}
function Selected_Part() {
    const selection = document.getSelection();
    if (selection &&
        !selection.isCollapsed &&
        selection.anchorNode != null &&
        selection.focusNode != null &&
        selection.anchorNode === selection.focusNode &&
        selection.getRangeAt(0).startOffset === 0 &&
        selection.getRangeAt(0).endOffset === 1) {
        if (selection.anchorNode instanceof HTMLSpanElement) {
            const span = selection.anchorNode;
            if (span.parentElement != null &&
                span.textContent != null) {
                const dictionary_text = span.textContent.replaceAll(/ /g, ` `);
                if (dictionary_text !== ``) {
                    let dictionary_class = Part_Class._NONE_;
                    if (span.classList.contains(`UNKNOWN_POINT`)) {
                        dictionary_class = Part_Class.UNKNOWN_POINT;
                    }
                    else if (span.classList.contains(`KNOWN_LETTER`)) {
                        dictionary_class = Part_Class.KNOWN_LETTER;
                    }
                    else if (span.classList.contains(`KNOWN_MARKER`)) {
                        dictionary_class = Part_Class.KNOWN_MARKER;
                    }
                    else if (span.classList.contains(`UNKNOWN_WORD`)) {
                        dictionary_class = Part_Class.UNKNOWN_WORD;
                    }
                    else if (span.classList.contains(`KNOWN_WORD`)) {
                        dictionary_class = Part_Class.KNOWN_WORD;
                    }
                    else if (span.classList.contains(`UNKNOWN_BREAK`)) {
                        dictionary_class = Part_Class.UNKNOWN_BREAK;
                    }
                    else if (span.classList.contains(`KNOWN_BREAK`)) {
                        dictionary_class = Part_Class.KNOWN_BREAK;
                    }
                    else if (span.classList.contains(`KNOWN_WORD_ERROR`)) {
                        dictionary_class = Part_Class.KNOWN_WORD_ERROR;
                    }
                    else if (span.classList.contains(`KNOWN_BREAK_ERROR`)) {
                        dictionary_class = Part_Class.KNOWN_BREAK_ERROR;
                    }
                    if (dictionary_class !== Part_Class._NONE_) {
                        const span_index = Array.from(span.parentElement.children).indexOf(span);
                        let dictionary_boundary = Model.Dictionary.Boundary.MIDDLE;
                        if (span_index === First_Part_Index(span.parentElement)) {
                            dictionary_boundary = Model.Dictionary.Boundary.START;
                        }
                        else if (span_index === Last_Part_Index(span.parentElement)) {
                            dictionary_boundary = Model.Dictionary.Boundary.END;
                        }
                        return {
                            text: dictionary_text,
                            class: dictionary_class,
                            boundary: dictionary_boundary,
                        };
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}
var Line_Event_Key;
(function (Line_Event_Key) {
    Line_Event_Key["LETTER"] = "Home";
    Line_Event_Key["MARKER"] = "PageUp";
    Line_Event_Key["WORD"] = "PageDown";
    Line_Event_Key["BREAK"] = "End";
    Line_Event_Key["ERROR"] = "Delete";
    Line_Event_Key["WORD_ERROR"] = "Pause";
    Line_Event_Key["BREAK_ERROR"] = "Insert";
})(Line_Event_Key || (Line_Event_Key = {}));
;
class Line {
    constructor({ editor, parent, }) {
        this.editor = editor;
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {};
        this.element.setAttribute(`contentEditable`, `true`);
        this.element.setAttribute(`spellcheck`, `false`);
        this.element.setAttribute(`style`, `
                display: flex;
                flex-wrap: wrap;
                justify-content: center;

                width: 100%;
                padding: 2px;

                border-width: 0 0 1px 0;
                border-style: solid;
                border-color: #3B3A32;

                font-size: 20px;
                direction: ltr;
            `);
        this.element.addEventListener(`keydown`, function (event) {
            if (event.key === `Enter`) {
                event.preventDefault();
                const selection = document.getSelection();
                if (selection) {
                    const line_text = this.Text();
                    let line_text_a;
                    let line_text_b;
                    if (selection.isCollapsed) {
                        Utils.Assert(selection.anchorNode !== null);
                        const at = Text_Offset_To_Node(this.Element(), selection.anchorNode) +
                            selection.anchorOffset;
                        line_text_a = line_text.slice(0, at);
                        line_text_b = line_text.slice(at, line_text.length);
                    }
                    else {
                        Utils.Assert(selection.anchorNode !== null);
                        Utils.Assert(selection.focusNode !== null);
                        let start_node;
                        let start_offset;
                        let stop_node;
                        let stop_offset;
                        if (selection.anchorOffset < selection.focusOffset) {
                            start_node = selection.anchorNode;
                            start_offset = selection.anchorOffset;
                            stop_node = selection.focusNode;
                            stop_offset = selection.focusOffset;
                        }
                        else {
                            start_node = selection.focusNode;
                            start_offset = selection.focusOffset;
                            stop_node = selection.anchorNode;
                            stop_offset = selection.anchorOffset;
                        }
                        const top_node = this.Element();
                        const from = Text_Offset_To_Node(top_node, start_node) +
                            start_offset;
                        const to = Text_Offset_To_Node(top_node, stop_node) +
                            stop_offset;
                        line_text_a = line_text.slice(0, from);
                        line_text_b = line_text.slice(to, line_text.length);
                    }
                    const line_index = this.Index();
                    this.Set_Text(line_text_a);
                    this.Editor().Insert_Line(line_index + 1, line_text_b);
                    this.Editor().Line(line_index + 1).Element().focus();
                }
            }
            else if (event.key === `Backspace`) {
                const selection = document.getSelection();
                if (selection) {
                    const line_index = this.Index();
                    const text_offset = Text_Offset(this.element);
                    if (line_index > 0 && selection.isCollapsed && text_offset === 0) {
                        event.preventDefault();
                        // we destroy this line and combine its text with the previous line.
                        const previous = this.Editor().Line(line_index - 1);
                        const previous_text = previous.Text();
                        previous.Set_Text(`${previous_text}${this.Text()}`);
                        this.Editor().Remove_Line(line_index);
                        Set_Text_Offset(previous.Element(), previous_text.length);
                    }
                }
            }
            else if (event.key === `ArrowUp`) {
                event.preventDefault();
                if (!this.Editor().Is_Meta_Key_Active()) {
                    const selection = document.getSelection();
                    if (selection) {
                        const line_index = this.Index();
                        if (line_index > 0) {
                            const text_offset = Text_Offset(this.element);
                            const above_line = this.Editor().Line(line_index - 1);
                            const above_line_text = above_line.Text();
                            Set_Text_Offset(above_line.Element(), above_line_text.length < text_offset ?
                                above_line_text.length :
                                text_offset);
                        }
                    }
                }
            }
            else if (event.key === `ArrowDown`) {
                event.preventDefault();
                if (!this.Editor().Is_Meta_Key_Active()) {
                    const selection = document.getSelection();
                    if (selection) {
                        const line_index = this.Index();
                        const line_count = this.Editor().Line_Count();
                        if (line_index < line_count - 1) {
                            const text_offset = Text_Offset(this.element);
                            const below_line = this.Editor().Line(line_index + 1);
                            const below_line_text = below_line.Text();
                            Set_Text_Offset(below_line.Element(), below_line_text.length < text_offset ?
                                below_line_text.length :
                                text_offset);
                        }
                    }
                }
            }
            else if (event.key === `ArrowLeft`) {
                const selection = document.getSelection();
                if (selection &&
                    !selection.isCollapsed &&
                    selection.anchorNode &&
                    selection.focusNode &&
                    selection.anchorNode === selection.focusNode) {
                    event.preventDefault();
                    const parent = this.Element();
                    const child_index = Array.from(parent.children)
                        .indexOf(selection.anchorNode);
                    if (child_index > 0) {
                        selection.getRangeAt(0).setStart(parent.children[child_index - 1], 0);
                        selection.getRangeAt(0).setEnd(parent.children[child_index - 1], 1);
                    }
                }
                else {
                    const text_offset = Text_Offset(this.Element());
                    if (text_offset != null) {
                        event.preventDefault();
                        if (text_offset > 0) {
                            const previous_code = this.Text()[text_offset - 1].charCodeAt(0);
                            if (previous_code >= 0xDC00 &&
                                previous_code <= 0xDFFF) {
                                Set_Text_Offset(this.Element(), Math.max(0, text_offset - 2));
                            }
                            else {
                                Set_Text_Offset(this.Element(), text_offset - 1);
                            }
                        }
                    }
                }
            }
            else if (event.key === `ArrowRight`) {
                const selection = document.getSelection();
                if (selection &&
                    !selection.isCollapsed &&
                    selection.anchorNode &&
                    selection.focusNode &&
                    selection.anchorNode === selection.focusNode) {
                    event.preventDefault();
                    const parent = this.Element();
                    const child_index = Array.from(parent.children)
                        .indexOf(selection.anchorNode);
                    if (child_index >= 0 &&
                        child_index < parent.children.length - 1) {
                        selection.getRangeAt(0).setStart(parent.children[child_index + 1], 0);
                        selection.getRangeAt(0).setEnd(parent.children[child_index + 1], 1);
                    }
                }
                else {
                    const text_offset = Text_Offset(this.Element());
                    if (text_offset != null) {
                        event.preventDefault();
                        const text = this.Text();
                        if (text_offset + 2 <= text.length) {
                            const next_code = text[text_offset + 1].charCodeAt(0);
                            if (next_code >= 0xDC00 &&
                                next_code <= 0xDFFF) {
                                Set_Text_Offset(this.Element(), text_offset + 2);
                            }
                            else {
                                Set_Text_Offset(this.Element(), text_offset + 1);
                            }
                        }
                        else if (text_offset < text.length) {
                            Set_Text_Offset(this.Element(), text_offset + 1);
                        }
                    }
                }
            }
            else if (event.key === Line_Event_Key.LETTER) {
                event.preventDefault();
                if (this.Editor().Is_Meta_Key_Active()) {
                    const selected = Selected_Part();
                    if (selected) {
                        if (selected.class === Part_Class.UNKNOWN_POINT) {
                            this.Editor().Dictionary().Add_Letter(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_LETTER) {
                            this.Editor().Dictionary().Remove_Letter(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.UNKNOWN_WORD ||
                            selected.class === Part_Class.KNOWN_WORD) {
                            if (Unicode.Is_Point(selected.text)) {
                                this.Editor().Dictionary().Remove_Letter(selected.text);
                                this.Editor().Touch();
                            }
                        }
                    }
                }
            }
            else if (event.key === Line_Event_Key.MARKER) {
                event.preventDefault();
                if (this.Editor().Is_Meta_Key_Active()) {
                    const selected = Selected_Part();
                    if (selected) {
                        if (selected.class === Part_Class.UNKNOWN_POINT) {
                            this.Editor().Dictionary().Add_Marker(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_MARKER) {
                            this.Editor().Dictionary().Remove_Marker(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.UNKNOWN_BREAK ||
                            selected.class === Part_Class.KNOWN_BREAK) {
                            if (Unicode.Is_Point(selected.text)) {
                                this.Editor().Dictionary().Remove_Marker(selected.text);
                                this.Editor().Touch();
                            }
                        }
                    }
                }
            }
            else if (event.key === Line_Event_Key.WORD) {
                event.preventDefault();
                if (this.Editor().Is_Meta_Key_Active()) {
                    const selected = Selected_Part();
                    if (selected) {
                        if (selected.class === Part_Class.UNKNOWN_WORD) {
                            this.Editor().Dictionary().Add_Word(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_WORD) {
                            this.Editor().Dictionary().Remove_Word(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_WORD_ERROR) {
                            this.Editor().Dictionary().Remove_Word_Error(selected.text);
                            this.Editor().Dictionary().Add_Word(selected.text);
                            this.Editor().Touch();
                        }
                    }
                }
            }
            else if (event.key === Line_Event_Key.BREAK) {
                event.preventDefault();
                if (this.Editor().Is_Meta_Key_Active()) {
                    const selected = Selected_Part();
                    if (selected) {
                        if (selected.class === Part_Class.UNKNOWN_BREAK) {
                            this.Editor().Dictionary().Add_Break(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_BREAK) {
                            this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_BREAK_ERROR) {
                            this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary);
                            this.Editor().Dictionary().Add_Break(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                    }
                }
            }
            else if (event.key === Line_Event_Key.ERROR) {
                if (this.Editor().Is_Meta_Key_Active()) {
                    event.preventDefault();
                    const selected = Selected_Part();
                    if (selected) {
                        if (selected.class === Part_Class.UNKNOWN_WORD) {
                            this.Editor().Dictionary().Add_Word_Error(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_WORD) {
                            this.Editor().Dictionary().Remove_Word(selected.text);
                            this.Editor().Dictionary().Add_Word_Error(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.UNKNOWN_BREAK) {
                            this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_BREAK) {
                            this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary);
                            this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_WORD_ERROR) {
                            this.Editor().Dictionary().Remove_Word_Error(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_BREAK_ERROR) {
                            this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                    }
                }
            }
            else if (event.key === Line_Event_Key.WORD_ERROR) {
                if (this.Editor().Is_Meta_Key_Active()) {
                    event.preventDefault();
                    const selected = Selected_Part();
                    if (selected) {
                        if (selected.class === Part_Class.UNKNOWN_POINT) {
                            this.Editor().Dictionary().Add_Word_Error(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.UNKNOWN_WORD) {
                            this.Editor().Dictionary().Add_Word_Error(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_WORD) {
                            this.Editor().Dictionary().Remove_Word(selected.text);
                            this.Editor().Dictionary().Add_Word_Error(selected.text);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_WORD_ERROR) {
                            this.Editor().Dictionary().Remove_Word_Error(selected.text);
                            this.Editor().Touch();
                        }
                    }
                }
            }
            else if (event.key === Line_Event_Key.BREAK_ERROR) {
                if (this.Editor().Is_Meta_Key_Active()) {
                    event.preventDefault();
                    const selected = Selected_Part();
                    if (selected) {
                        if (selected.class === Part_Class.UNKNOWN_POINT) {
                            this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.UNKNOWN_BREAK) {
                            this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_BREAK) {
                            this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary);
                            this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                        else if (selected.class === Part_Class.KNOWN_BREAK_ERROR) {
                            this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary);
                            this.Editor().Touch();
                        }
                    }
                }
            }
        }.bind(this));
        this.element.addEventListener(`input`, function (event) {
            const input_event = event;
            if (input_event.inputType === `insertText` ||
                input_event.inputType === `deleteContentBackward` ||
                input_event.inputType === `insertFromPaste`) {
                const text_offset = Text_Offset(this.element);
                this.Touch();
                Set_Text_Offset(this.element, text_offset);
            }
        }.bind(this));
        this.element.addEventListener(`dblclick`, function (mouse_event) {
            const selection = document.getSelection();
            if (selection) {
                if (selection.rangeCount < 1) {
                    selection.addRange(document.createRange());
                }
                let node = this.Element();
                for (const child of this.Element().children) {
                    const rect = child.getBoundingClientRect();
                    if (mouse_event.clientX >= rect.left &&
                        mouse_event.clientX <= rect.right &&
                        mouse_event.clientY >= rect.top &&
                        mouse_event.clientY <= rect.bottom) {
                        node = child;
                        break;
                    }
                }
                if (node === this.Element()) {
                    selection.getRangeAt(0).setStart(node, 0);
                    selection.getRangeAt(0).setEnd(node, node.children.length);
                }
                else {
                    selection.getRangeAt(0).setStart(node, 0);
                    selection.getRangeAt(0).setEnd(node, 1);
                }
            }
        }.bind(this));
        this.parent.appendChild(this.element);
    }
    Destruct() {
        this.parent.removeChild(this.element);
    }
    Editor() {
        return this.editor;
    }
    Parent() {
        return this.parent;
    }
    Element() {
        return this.element;
    }
    Index() {
        const index = this.Editor().Lines().indexOf(this);
        Utils.Assert(index > -1);
        return index;
    }
    Text() {
        // for now we just replace all non-breaking spaces with regular spaces.
        // see the comments in Set_Text for more info, as this is a temporary measure.
        if (this.element.textContent) {
            return this.element.textContent.replaceAll(/ /g, ` `);
        }
        else {
            return ``;
        }
    }
    Set_Text(text) {
        // some browsers like firefox do not automatically replace
        // spaces with non-breaking spaces, which is needed because
        // browsers automatically remove extra spaces, whereas an editor
        // should allow them. but firefox is a hot mess, it doesn't even
        // properly backspace when spans are in the editor, so we do not
        // support it for now. in the future we can keep track of our own
        // caret to make up for it's hot mess, but not at this time.
        // we also have the other problem though. We don't actually want all
        // these non-breaking spaces. So we are going to have to keep a separate
        // string containing the actual text of the line and then use it to
        // set the innerHTML. however, sometimes we need to read from textContent,
        // so what we will have to do is alter the actual string after input events.
        // very frustrating, but we have to do this so that the user can actually
        // use non-breaking spaces and we don't stomp them trying to switch them all
        // out. I'm tempted to just switch them all out though until we need to use
        // such a thing, because it's an annoying problem that doesn't need to be dealt
        // with just yet.
        if (this.Editor().Is_In_Point_Mode()) {
            this.element.innerHTML = this.Treat_As_Points(text);
            this.element.style.display = `block`;
        }
        else {
            const treatment = this.Treat(text);
            this.element.innerHTML = treatment.html;
            if (treatment.is_centered) {
                this.element.style.display = `flex`;
            }
            else {
                this.element.style.display = `block`;
            }
        }
    }
    Touch() {
        const text_offset = Text_Offset(this.Element());
        this.Set_Text(this.Text());
        if (text_offset) {
            Set_Text_Offset(this.Element(), text_offset);
        }
    }
    Treat(text) {
        const model = new Model.Instance({
            dictionary: this.Editor().Dictionary(),
            value: text,
        });
        Utils.Assert(model.Line_Count() === 1, `model's line count should be 1.`);
        const line = model.Line(0);
        let inner_html = ``;
        for (let idx = 0, end = line.Macro_Part_Count(); idx < end; idx += 1) {
            const part = line.Macro_Part(idx);
            if (part.Is_Command()) {
                const command = part;
                let command_classes = ``;
                if (command.Is_Indent()) {
                    command_classes += ` INDENT`;
                }
                inner_html +=
                    `<span class="COMMAND${command_classes}">${Escape_Text(command.Value())}</span>`;
            }
            else {
                let command_classes = ``;
                if (part.Has_Italic_Style()) {
                    command_classes += ` ITALIC`;
                }
                if (part.Has_Bold_Style()) {
                    command_classes += ` BOLD`;
                }
                if (part.Has_Underline_Style()) {
                    command_classes += ` UNDERLINE`;
                }
                if (part.Has_Small_Caps_Style()) {
                    command_classes += ` SMALL_CAPS`;
                }
                if (part.Has_Error_Style()) {
                    command_classes += ` ERROR`;
                }
                if (part.Is_Point()) {
                    inner_html +=
                        `<span class="UNKNOWN_POINT${command_classes}">${Escape_Text(part.Value())}</span>`;
                }
                else if (part.Is_Word()) {
                    if (part.Is_Good()) {
                        inner_html +=
                            `<span class="KNOWN_WORD${command_classes}">${Escape_Text(part.Value())}</span>`;
                    }
                    else if (part.Is_Error()) {
                        inner_html +=
                            `<span class="KNOWN_WORD_ERROR${command_classes}">${Escape_Text(part.Value())}</span>`;
                    }
                    else if (part.Is_Unknown()) {
                        inner_html +=
                            `<span class="UNKNOWN_WORD${command_classes}">${Escape_Text(part.Value())}</span>`;
                    }
                    else {
                        Utils.Assert(false, `unknown part state.`);
                    }
                }
                else if (part.Is_Break()) {
                    if (part.Is_Good()) {
                        inner_html +=
                            `<span class="KNOWN_BREAK${command_classes}">${Escape_Text(part.Value())}</span>`;
                    }
                    else if (part.Is_Error()) {
                        inner_html +=
                            `<span class="KNOWN_BREAK_ERROR${command_classes}">${Escape_Text(part.Value())}</span>`;
                    }
                    else if (part.Is_Unknown()) {
                        inner_html +=
                            `<span class="UNKNOWN_BREAK${command_classes}">${Escape_Text(part.Value())}</span>`;
                    }
                    else {
                        Utils.Assert(false, `unknown part state.`);
                    }
                }
                else {
                    Utils.Assert(false, `invalid macro part.`);
                }
            }
        }
        return ({
            html: inner_html,
            is_centered: line.Is_Centered(),
        });
    }
    Treat_As_Points(text) {
        const model = new Model.Instance({
            dictionary: this.Editor().Dictionary(),
            value: text,
        });
        Utils.Assert(model.Line_Count() === 1, `model's line count should be 1.`);
        const line = model.Line(0);
        let inner_html = ``;
        for (let idx = 0, end = line.Micro_Part_Count(); idx < end; idx += 1) {
            const part = line.Micro_Part(idx);
            if (part.Is_Command()) {
                let it = new Unicode.Iterator({
                    text: part.Value(),
                    index: 0,
                });
                for (; !it.Is_At_End(); it = it.Next()) {
                    inner_html +=
                        `<span class="COMMAND SEPARATE_POINT">${Escape_Text(it.Point())}</span>`;
                }
            }
            else {
                if (part.Is_Letter()) {
                    inner_html +=
                        `<span class="KNOWN_LETTER SEPARATE_POINT">${Escape_Text(part.Value())}</span>`;
                }
                else if (part.Is_Marker()) {
                    inner_html +=
                        `<span class="KNOWN_MARKER SEPARATE_POINT">${Escape_Text(part.Value())}</span>`;
                }
                else if (part.Is_Point()) {
                    inner_html +=
                        `<span class="UNKNOWN_POINT SEPARATE_POINT">${Escape_Text(part.Value())}</span>`;
                }
                else {
                    Utils.Assert(false, `invalid micro part.`);
                }
            }
        }
        return inner_html;
    }
}
class Editor {
    constructor({ parent, }) {
        const button_style = `
            display: flex;
            justify-content: center;
            align-items: center;
            justify-self: center;

            width: 100%;
            padding: 2px;

            border-width: 2px;
            border-style: solid;
            border-color: #3B3A32;

            cursor: pointer;
            user-select: none;
        `;
        this.is_meta_key_active = false;
        this.is_in_point_mode = false;
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {
            controls: document.createElement(`div`),
            dictionary_label: document.createElement(`div`),
            dictionary_new_button: document.createElement(`div`),
            dictionary_load_input: document.createElement(`input`),
            dictionary_load_button: document.createElement(`div`),
            dictionary_save_button: document.createElement(`div`),
            dictionary_name: document.createElement(`div`),
            file_label: document.createElement(`div`),
            file_new_button: document.createElement(`div`),
            file_load_input: document.createElement(`input`),
            file_load_button: document.createElement(`div`),
            file_save_button: document.createElement(`div`),
            file_name: document.createElement(`div`),
            lines: document.createElement(`div`),
        };
        this.element.setAttribute(`style`, `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                position: relative;

                height: 100%;
                width: 100%;
                padding: 7px 7px 0 7px;

                border-width: 0;

                background-color: #0f1318;
                color: #E0ECFF;

                overflow-y: auto;
            `);
        this.element.addEventListener(`keydown`, function (event) {
            const keyboard_event = event;
            if (keyboard_event.key === `Escape`) {
                event.preventDefault();
                this.is_meta_key_active = true;
            }
            else if (keyboard_event.key === `ArrowLeft`) {
                if (this.Is_Meta_Key_Active()) {
                    this.children.dictionary_name.style.direction = `rtl`;
                    this.children.file_name.style.direction = `rtl`;
                    for (const line of this.lines) {
                        line.Element().style.direction = `rtl`;
                    }
                }
            }
            else if (keyboard_event.key === `ArrowRight`) {
                if (this.Is_Meta_Key_Active()) {
                    this.children.dictionary_name.style.direction = `ltr`;
                    this.children.file_name.style.direction = `ltr`;
                    for (const line of this.lines) {
                        line.Element().style.direction = `ltr`;
                    }
                }
            }
            else if (keyboard_event.key === `ArrowDown`) {
                if (this.Is_Meta_Key_Active()) {
                    this.is_in_point_mode = true;
                    this.Touch();
                }
            }
            else if (keyboard_event.key === `ArrowUp`) {
                if (this.Is_Meta_Key_Active()) {
                    this.is_in_point_mode = false;
                    this.Touch();
                }
            }
            else if (keyboard_event.key === `\``) {
                if (this.Is_Meta_Key_Active()) {
                    keyboard_event.preventDefault();
                    this.Highlight_First_Unknown();
                }
            }
            else if (keyboard_event.key === `~`) {
                if (this.Is_Meta_Key_Active()) {
                    keyboard_event.preventDefault();
                    this.Highlight_Next(`⸨err⸩`);
                }
            }
            else if (keyboard_event.key === `!`) {
                if (this.Is_Meta_Key_Active()) {
                    keyboard_event.preventDefault();
                    this.Highlight_Next(`⸨b⸩`);
                }
            }
        }.bind(this));
        this.element.addEventListener(`keyup`, function (event) {
            const keyboard_event = event;
            if (keyboard_event.key === `Escape`) {
                event.preventDefault();
                this.is_meta_key_active = false;
            }
        }.bind(this));
        this.children.controls.setAttribute(`style`, `
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                grid-gap: 3px;

                width: 100%;
                padding: 2px 0;
            `);
        this.children.dictionary_label.setAttribute(`style`, `
                font-size: 24px;

                user-select: none;
            `);
        this.children.dictionary_label.textContent = `Dictionary:`;
        this.children.dictionary_name.setAttribute(`contentEditable`, `true`);
        this.children.dictionary_name.setAttribute(`spellcheck`, `true`);
        this.children.dictionary_name.setAttribute(`style`, `
                padding: 2px;

                font-size: 22px;
                direction: ltr;
            `);
        this.children.dictionary_name.addEventListener(`keydown`, function (event) {
            if (event.key === `Enter`) {
                event.preventDefault();
            }
        }.bind(this));
        this.children.dictionary_name.addEventListener(`input`, function (event) {
            const input_event = event;
            if (input_event.inputType === `insertText` ||
                input_event.inputType === `deleteContentBackward` ||
                input_event.inputType === `insertFromPaste`) {
                const text_offset = Text_Offset(this.children.dictionary_name);
                this.Set_Dictionary_Name(this.Dictionary_Name());
                Set_Text_Offset(this.children.dictionary_name, text_offset);
            }
        }.bind(this));
        this.children.dictionary_new_button.setAttribute(`style`, button_style);
        this.children.dictionary_new_button.innerHTML = `<div>New</div>`;
        this.children.dictionary_new_button.addEventListener(`click`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.saved_dictionary === null ?
                    this.Dictionary().To_JSON() !== new Model.Dictionary.Instance({}).To_JSON() :
                    this.saved_dictionary !== this.Dictionary().To_JSON()) {
                    if (!(yield this.Try_To_Save_Dictionary())) {
                        return;
                    }
                }
                this.Set_Dictionary_Name(`New Dictionary`);
                this.dictionary = new Model.Dictionary.Instance({});
                this.Touch();
                this.saved_dictionary = null;
            });
        }.bind(this));
        this.children.dictionary_load_input.setAttribute(`type`, `file`);
        this.children.dictionary_load_input.setAttribute(`accept`, `.json`);
        this.children.dictionary_load_input.setAttribute(`style`, `
                display: none;
            `);
        this.children.dictionary_load_input.addEventListener(`input`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.children.dictionary_load_input.files && this.children.dictionary_load_input.files[0]) {
                    const file = this.children.dictionary_load_input.files[0];
                    const file_text = yield file.text();
                    this.Set_Dictionary_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Dictionary_JSON(file_text);
                    this.children.dictionary_load_input.value = ``;
                    this.saved_dictionary = this.Dictionary().To_JSON();
                }
            });
        }.bind(this));
        this.children.dictionary_load_button.setAttribute(`style`, button_style);
        this.children.dictionary_load_button.innerHTML = `<div>Load</div>`;
        this.children.dictionary_load_button.addEventListener(`click`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.saved_dictionary === null ?
                    this.Dictionary().To_JSON() !== new Model.Dictionary.Instance({}).To_JSON() :
                    this.saved_dictionary !== this.Dictionary().To_JSON()) {
                    if (!(yield this.Try_To_Save_Dictionary())) {
                        return;
                    }
                }
                this.children.dictionary_load_input.click();
            });
        }.bind(this));
        this.children.dictionary_save_button.setAttribute(`style`, button_style);
        this.children.dictionary_save_button.innerHTML = `<div>Save</div>`;
        this.children.dictionary_save_button.addEventListener(`click`, function (event) {
            this.Save_Dictionary();
        }.bind(this));
        this.children.file_label.setAttribute(`style`, `
                font-size: 24px;

                user-select: none;
            `);
        this.children.file_label.textContent = `File:`;
        this.children.file_name.setAttribute(`contentEditable`, `true`);
        this.children.file_name.setAttribute(`spellcheck`, `true`);
        this.children.file_name.setAttribute(`style`, `
                padding: 2px;

                font-size: 22px;
                direction: ltr;
            `);
        this.children.file_name.addEventListener(`keydown`, function (event) {
            if (event.key === `Enter`) {
                event.preventDefault();
            }
        }.bind(this));
        this.children.file_name.addEventListener(`input`, function (event) {
            const input_event = event;
            if (input_event.inputType === `insertText` ||
                input_event.inputType === `deleteContentBackward` ||
                input_event.inputType === `insertFromPaste`) {
                const text_offset = Text_Offset(this.children.file_name);
                this.Set_File_Name(this.File_Name());
                Set_Text_Offset(this.children.file_name, text_offset);
            }
        }.bind(this));
        this.children.file_new_button.setAttribute(`style`, button_style);
        this.children.file_new_button.innerHTML = `<div>New</div>`;
        this.children.file_new_button.addEventListener(`click`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.saved_file === null ?
                    this.Text() !== `` :
                    this.saved_file !== this.Text()) {
                    if (!(yield this.Try_To_Save_File())) {
                        return;
                    }
                }
                this.Set_File_Name(`New File`);
                this.Clear_Text();
                this.Touch();
                this.saved_file = null;
            });
        }.bind(this));
        this.children.file_load_input.setAttribute(`type`, `file`);
        this.children.file_load_input.setAttribute(`accept`, `.txt`);
        this.children.file_load_input.setAttribute(`style`, `
                display: none;
            `);
        this.children.file_load_input.addEventListener(`input`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.children.file_load_input.files && this.children.file_load_input.files[0]) {
                    const file = this.children.file_load_input.files[0];
                    const file_text = yield file.text();
                    this.Set_File_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Text(file_text);
                    this.children.file_load_input.value = ``;
                    this.saved_file = this.Text();
                    Utils.Assert(this.Text() === file_text.replaceAll(/\r/g, ``));
                }
            });
        }.bind(this));
        this.children.file_load_button.setAttribute(`style`, button_style);
        this.children.file_load_button.innerHTML = `<div>Load</div>`;
        this.children.file_load_button.addEventListener(`click`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.saved_file === null ?
                    this.Text() !== `` :
                    this.saved_file !== this.Text()) {
                    if (!(yield this.Try_To_Save_File())) {
                        return;
                    }
                }
                this.children.file_load_input.click();
            });
        }.bind(this));
        this.children.file_save_button.setAttribute(`style`, button_style);
        this.children.file_save_button.innerHTML = `<div>Save</div>`;
        this.children.file_save_button.addEventListener(`click`, function (event) {
            this.Save_Text();
        }.bind(this));
        this.children.lines.setAttribute(`style`, `
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: start;
                
                width: 100%;
                height: 90%;
                padding: 2px;

                border-width: 2px;
                border-style: none;
                border-color: #3B3A32;

                overflow-y: auto;
            `);
        this.dictionary = new Model.Dictionary.Instance({});
        this.lines = [];
        this.children.controls.appendChild(this.children.dictionary_label);
        this.children.controls.appendChild(this.children.dictionary_name);
        this.children.controls.appendChild(this.children.dictionary_new_button);
        this.children.controls.appendChild(this.children.dictionary_load_button);
        this.children.controls.appendChild(this.children.dictionary_save_button);
        this.children.controls.appendChild(this.children.file_label);
        this.children.controls.appendChild(this.children.file_name);
        this.children.controls.appendChild(this.children.file_new_button);
        this.children.controls.appendChild(this.children.file_load_button);
        this.children.controls.appendChild(this.children.file_save_button);
        this.element.appendChild(this.children.controls);
        this.element.appendChild(this.children.lines);
        this.parent.appendChild(this.element);
        this.Set_Dictionary_Name(`New Dictionary`);
        this.Set_File_Name(`New File`);
        this.Add_Line(``);
        this.saved_dictionary = null;
        this.saved_file = null;
    }
    Parent() {
        return this.parent;
    }
    Element() {
        return this.element;
    }
    Dictionary() {
        return this.dictionary;
    }
    Dictionary_Name() {
        if (this.children.dictionary_name.textContent) {
            return this.children.dictionary_name.textContent.replaceAll(/ /g, ` `);
        }
        else {
            return ``;
        }
    }
    Set_Dictionary_Name(name) {
        this.children.dictionary_name.innerHTML = Escape_Text(name);
    }
    Dictionary_JSON() {
        return this.Dictionary().To_JSON();
    }
    Set_Dictionary_JSON(json) {
        this.dictionary = new Model.Dictionary.Instance({
            json: json,
        });
        this.Touch();
    }
    Save_Dictionary() {
        const json = this.Dictionary_JSON();
        const file_name = this.Dictionary_Name();
        const file = new File([json], `${file_name}.json`);
        const file_url = URL.createObjectURL(file);
        const link = document.createElement(`a`);
        link.href = file_url;
        link.download = `${file_name}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.saved_dictionary = json;
    }
    Try_To_Save_Dictionary() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(function (resolve, reject) {
                const modal = document.createElement(`div`);
                modal.setAttribute(`style`, `
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 1;

                        width: 100%;
                        height: 100%;

                        background-color: rgba(0, 0, 0, 0.7);

                        font-size: 18px;
                    `);
                const message = document.createElement(`div`);
                message.setAttribute(`style`, `
                        width: 67%;
                        margin: 2px;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                        text-align: center;
                    `);
                message.innerHTML = `<div>
                    There are unsaved changes to the current dictionary.
                </div>`;
                const options = document.createElement(`div`);
                options.setAttribute(`style`, `
                        display: grid;
                        grid-template-columns: 1fr;
                        grid-template-rows: 1fr 1fr 1fr;
                        grid-gap: 12px;

                        width: 67%;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                    `);
                const button_style = `
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    border-width: 2px;
                    border-style: solid;
                    border-color: #3B3A32;

                    cursor: pointer;
                    user-select: none;
                `;
                const save_button = document.createElement(`div`);
                save_button.setAttribute(`style`, button_style);
                save_button.innerHTML = `<div>Save Changes</div>`;
                save_button.addEventListener(`click`, function (event) {
                    this.Save_Dictionary();
                    document.body.removeChild(modal);
                    resolve(true);
                }.bind(this));
                const discard_button = document.createElement(`div`);
                discard_button.setAttribute(`style`, button_style);
                discard_button.innerHTML = `<div>Discard Changes</div>`;
                discard_button.addEventListener(`click`, function (event) {
                    document.body.removeChild(modal);
                    resolve(true);
                }.bind(this));
                const cancel_button = document.createElement(`div`);
                cancel_button.setAttribute(`style`, button_style);
                cancel_button.innerHTML = `<div>Cancel</div>`;
                cancel_button.addEventListener(`click`, function (event) {
                    document.body.removeChild(modal);
                    resolve(false);
                }.bind(this));
                options.appendChild(save_button);
                options.appendChild(discard_button);
                options.appendChild(cancel_button);
                modal.appendChild(message);
                modal.appendChild(options);
                document.body.appendChild(modal);
            }.bind(this));
        });
    }
    File_Name() {
        if (this.children.file_name.textContent) {
            return this.children.file_name.textContent.replaceAll(/ /g, ` `);
        }
        else {
            return ``;
        }
    }
    Set_File_Name(name) {
        this.children.file_name.innerHTML = Escape_Text(name);
    }
    Text() {
        return this.lines.map(function (line) {
            return line.Text();
        }).join(`\n`);
    }
    Set_Text(text) {
        this.Clear_Text();
        const text_lines = text.split(/\r?\n/);
        for (const text_line of text_lines) {
            this.Add_Line(text_line);
        }
        this.Remove_Line(0);
    }
    Save_Text() {
        const text = this.Text();
        const file_name = this.File_Name();
        const file = new File([text], `${file_name}.txt`);
        const file_url = URL.createObjectURL(file);
        const link = document.createElement(`a`);
        link.href = file_url;
        link.download = `${file_name}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.saved_file = text;
    }
    Try_To_Save_File() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(function (resolve, reject) {
                const modal = document.createElement(`div`);
                modal.setAttribute(`style`, `
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 1;

                        width: 100%;
                        height: 100%;

                        background-color: rgba(0, 0, 0, 0.7);

                        font-size: 18px;
                    `);
                const message = document.createElement(`div`);
                message.setAttribute(`style`, `
                        width: 67%;
                        margin: 2px;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                        text-align: center;
                    `);
                message.innerHTML = `<div>
                    There are unsaved changes to the current file.
                </div>`;
                const options = document.createElement(`div`);
                options.setAttribute(`style`, `
                        display: grid;
                        grid-template-columns: 1fr;
                        grid-template-rows: 1fr 1fr 1fr;
                        grid-gap: 12px;

                        width: 67%;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                    `);
                const button_style = `
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    border-width: 2px;
                    border-style: solid;
                    border-color: #3B3A32;

                    cursor: pointer;
                    user-select: none;
                `;
                const save_button = document.createElement(`div`);
                save_button.setAttribute(`style`, button_style);
                save_button.innerHTML = `<div>Save Changes</div>`;
                save_button.addEventListener(`click`, function (event) {
                    this.Save_Text();
                    document.body.removeChild(modal);
                    resolve(true);
                }.bind(this));
                const discard_button = document.createElement(`div`);
                discard_button.setAttribute(`style`, button_style);
                discard_button.innerHTML = `<div>Discard Changes</div>`;
                discard_button.addEventListener(`click`, function (event) {
                    document.body.removeChild(modal);
                    resolve(true);
                }.bind(this));
                const cancel_button = document.createElement(`div`);
                cancel_button.setAttribute(`style`, button_style);
                cancel_button.innerHTML = `<div>Cancel</div>`;
                cancel_button.addEventListener(`click`, function (event) {
                    document.body.removeChild(modal);
                    resolve(false);
                }.bind(this));
                options.appendChild(save_button);
                options.appendChild(discard_button);
                options.appendChild(cancel_button);
                modal.appendChild(message);
                modal.appendChild(options);
                document.body.appendChild(modal);
            }.bind(this));
        });
    }
    Clear_Text() {
        for (const line of this.lines) {
            line.Destruct();
        }
        this.lines = [];
        this.Add_Line(``);
    }
    Line_Count() {
        return this.lines.length;
    }
    Lines() {
        return Array.from(this.lines);
    }
    Line(line_index) {
        Utils.Assert(line_index >= 0);
        Utils.Assert(line_index < this.lines.length);
        return this.lines[line_index];
    }
    Add_Line(text) {
        const line = new Line({
            editor: this,
            parent: this.children.lines,
        });
        this.lines.push(line);
        line.Set_Text(text);
    }
    Remove_Line(line_index) {
        Utils.Assert(line_index > 0 || this.lines.length > 1);
        Utils.Assert(line_index < this.lines.length);
        this.lines.splice(line_index, 1)[0].Destruct();
    }
    Insert_Line(at_line_index, text) {
        Utils.Assert(at_line_index >= 0);
        Utils.Assert(at_line_index <= this.lines.length);
        for (let idx = at_line_index, end = this.lines.length; idx < end; idx += 1) {
            const line = this.lines[idx];
            line.Parent().removeChild(line.Element());
        }
        const line = new Line({
            editor: this,
            parent: this.children.lines,
        });
        this.lines.splice(at_line_index, 0, line);
        line.Set_Text(text);
        for (let idx = at_line_index + 1, end = this.lines.length; idx < end; idx += 1) {
            const line = this.lines[idx];
            line.Parent().appendChild(line.Element());
        }
    }
    Touch() {
        this.Set_Dictionary_Name(this.Dictionary_Name());
        this.Set_File_Name(this.File_Name());
        for (const line of this.lines) {
            line.Touch();
        }
    }
    Is_Meta_Key_Active() {
        return this.is_meta_key_active;
    }
    Is_In_Point_Mode() {
        return this.is_in_point_mode;
    }
    Highlight_First_Unknown() {
        for (const line of this.lines) {
            for (const child of line.Element().children) {
                for (const class_name of child.classList.values()) {
                    if (/UNKNOWN/.test(class_name)) {
                        line.Element().focus();
                        const selection = document.getSelection();
                        selection.getRangeAt(0).setStart(child, 0);
                        selection.getRangeAt(0).setEnd(child, 1);
                        return;
                    }
                }
            }
        }
        this.lines[0].Element().focus();
        const selection = document.getSelection();
        selection.collapse(this.lines[0].Element(), 0);
    }
    Highlight_Next(text) {
        const selected_line_idx = this.Focused_Line_Index();
        const selection = document.getSelection();
        if (selected_line_idx != null &&
            selection != null &&
            !selection.isCollapsed &&
            selection.anchorNode != null &&
            selection.anchorNode === selection.focusNode &&
            ((selection.anchorOffset === 0 && selection.focusOffset === 1) ||
                (selection.anchorOffset === 1 && selection.focusOffset === 0))) {
            // we have a highlight already, so we look for the next one in this line or the lines that follow
            const selected_line_element = this.lines[selected_line_idx].Element();
            const selected_child_idx = Array.from(selected_line_element.children).indexOf(selection.anchorNode);
            Utils.Assert(selected_child_idx > -1);
            const selected_child_element = selected_line_element.children[selected_child_idx];
            const next_error_element = (function () {
                let line_idx = selected_line_idx;
                let child_idx = selected_child_idx + 1;
                while (true) {
                    const line = this.lines[line_idx].Element();
                    for (let end = line.children.length; child_idx < end; child_idx += 1) {
                        const child = line.children[child_idx];
                        if ((child.textContent || ``).replaceAll(/ /g, ` `) === text) {
                            return child;
                        }
                        else if (child === selected_child_element) {
                            return null;
                        }
                    }
                    if (line_idx === this.lines.length - 1) {
                        line_idx = 0;
                    }
                    else {
                        line_idx += 1;
                    }
                    child_idx = 0;
                }
            }.bind(this))();
            if (next_error_element) {
                next_error_element.parentElement.focus();
                selection.getRangeAt(0).setStart(next_error_element, 0);
                selection.getRangeAt(0).setEnd(next_error_element, 1);
            }
        }
        else {
            // we have to look for the first instance and highlight it
            for (let line of this.lines) {
                for (let child of line.Element().children) {
                    if ((child.textContent || ``).replaceAll(/ /g, ` `) === text) {
                        line.Element().focus();
                        const selection = document.getSelection();
                        selection.getRangeAt(0).setStart(child, 0);
                        selection.getRangeAt(0).setEnd(child, 1);
                        return;
                    }
                }
            }
        }
    }
    Focused_Line_Index() {
        const selection = document.getSelection();
        if (selection &&
            (selection.anchorNode || selection.focusNode)) {
            for (let idx = 0, end = this.lines.length; idx < end; idx += 1) {
                if (this.lines[idx].Element().contains(selection.anchorNode) ||
                    this.lines[idx].Element().contains(selection.focusNode)) {
                    return idx;
                }
            }
            return null;
        }
        else {
            return null;
        }
    }
    Display_Stats() {
        const modal = document.createElement(`div`);
        modal.setAttribute(`style`, `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;

                width: 100%;
                height: 100%;

                background-color: rgba(0, 0, 0, 0.7);

                font-size: 18px;
                color: #E0ECFF;
            `);
        const wrapper = document.createElement(`div`);
        wrapper.setAttribute(`style`, `
                width: 67%;
                margin: 2px;
                padding: 7px;

                background-color: #0f1318;

                text-align: center;
            `);
        const okay_button = document.createElement(`div`);
        okay_button.setAttribute(`style`, `
            display: flex;
            justify-content: center;
            align-items: center;

            border-width: 2px;
            border-style: solid;
            border-color: #3B3A32;

            cursor: pointer;
            user-select: none;
        `);
        okay_button.innerHTML = `<div>Okay</div>`;
        okay_button.addEventListener(`click`, function (event) {
            document.body.removeChild(modal);
            this.Line(0).Element().focus();
        }.bind(this));
        wrapper.appendChild(okay_button);
        modal.appendChild(wrapper);
        document.body.appendChild(modal);
    }
}
(function Main() {
    Utils.Create_Style_Element(`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        *:focus {
            outline: 0;
        }
        
        html, body {
            width: 100%;
            height: 100%;

            background-color: black;

            font-family: sans-serif;
        }

        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        span {
            display: inline-block;
        }

        .ITALIC {
            font-style: italic;
        }

        .BOLD {
            font-weight: bold;
        }

        .UNDERLINE {
            text-decoration: underline;
        }
        
        .SMALL_CAPS {
            font-variant: small-caps;
        }

        .ERROR {
            color: #ffcbcb;
        }

        .INDENT {
            width: 6em;
        }

        .SEPARATE_POINT {
            display: inline-block;

            min-width: 7px;

            text-align: center;
        }

        .UNKNOWN_POINT {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #ffff00;

            overflow-wrap: normal;
        }

        .KNOWN_LETTER {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .KNOWN_MARKER {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .UNKNOWN_WORD {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #ff5858;

            overflow-wrap: normal;
        }

        .KNOWN_WORD {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .UNKNOWN_BREAK {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #00da6f;

            overflow-wrap: normal;
        }

        .KNOWN_BREAK {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .KNOWN_WORD_ERROR {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #e767c3;

            overflow-wrap: normal;
        }

        .KNOWN_BREAK_ERROR {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #e767c3;

            overflow-wrap: normal;
        }

        .COMMAND {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;
            
            overflow-wrap: normal;
        }
    `);
    new Editor({
        parent: document.body,
    });
})();
