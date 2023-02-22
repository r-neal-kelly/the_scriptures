"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function Assert(boolean_statement) {
    if (boolean_statement === false) {
        throw new Error(`Failed assert.`);
    }
}
function Escape_Text(text) {
    return text.replaceAll(/./g, function (point) {
        if (point === ` `) {
            return `&#${` `.charCodeAt(0)};`;
        }
        else {
            return `&#${point.charCodeAt(0)};`;
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
            if (selection.anchorNode) {
                return Text_Offset_To_Node(element, selection.anchorNode) + selection.anchorOffset;
            }
            else {
                return null;
            }
        }
        else {
            if (selection.anchorNode && selection.focusNode) {
                if (selection.anchorOffset < selection.focusOffset) {
                    return Text_Offset_To_Node(element, selection.anchorNode) + selection.anchorOffset;
                }
                else {
                    return Text_Offset_To_Node(element, selection.focusNode) + selection.focusOffset;
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
class Line {
    constructor({ editor, parent, }) {
        this.editor = editor;
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {};
        this.element.setAttribute(`contentEditable`, `true`);
        this.element.setAttribute(`spellcheck`, `false`);
        this.element.setAttribute(`style`, `
                width: 100%;
                padding: 2px;

                border-width: 0 0 1px 0;
                border-style: solid;
                border-color: #3B3A32;
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
                        Assert(selection.anchorNode !== null);
                        const at = Text_Offset_To_Node(this.Element(), selection.anchorNode) +
                            selection.anchorOffset;
                        line_text_a = line_text.slice(0, at);
                        line_text_b = line_text.slice(at, line_text.length);
                    }
                    else {
                        Assert(selection.anchorNode !== null);
                        Assert(selection.focusNode !== null);
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
            else if (event.key === `ArrowDown`) {
                event.preventDefault();
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
            else if (event.key === `l`) {
                if (event.altKey) {
                    event.preventDefault();
                    const selected = Dictionary.Selected_Text_And_Class();
                    if (selected) {
                        if (selected.class === Dictionary_Class.UNKNOWN_POINT) {
                            this.Editor().Dictionary().Add_Letter(selected.text);
                            this.Set_Text(this.Text());
                        }
                        // we need to be able to remove it by toggle also. Not sure
                        // how it will be detected in selection.
                    }
                }
            }
            else if (event.key === `m`) {
                if (event.altKey) {
                    event.preventDefault();
                    const selected = Dictionary.Selected_Text_And_Class();
                    if (selected) {
                        if (selected.class === Dictionary_Class.UNKNOWN_POINT) {
                            this.Editor().Dictionary().Add_Marker(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.UNKNOWN_MARKER) {
                            this.Editor().Dictionary().Add_Marker(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.KNOWN_MARKER) {
                            this.Editor().Dictionary().Remove_Marker(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.KNOWN_ERROR) {
                            this.Editor().Dictionary().Remove_Error(selected.text);
                            this.Editor().Dictionary().Add_Marker(selected.text);
                            this.Set_Text(this.Text());
                        }
                    }
                }
            }
            else if (event.key === `w`) {
                if (event.altKey) {
                    event.preventDefault();
                    const selected = Dictionary.Selected_Text_And_Class();
                    if (selected) {
                        if (selected.class === Dictionary_Class.UNKNOWN_WORD) {
                            this.Editor().Dictionary().Add_Word(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.KNOWN_WORD) {
                            this.Editor().Dictionary().Remove_Word(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.KNOWN_ERROR) {
                            this.Editor().Dictionary().Remove_Error(selected.text);
                            this.Editor().Dictionary().Add_Word(selected.text);
                            this.Set_Text(this.Text());
                        }
                    }
                }
            }
            else if (event.key === `e`) {
                if (event.altKey) {
                    event.preventDefault();
                    const selected = Dictionary.Selected_Text_And_Class();
                    if (selected) {
                        if (selected.class === Dictionary_Class.UNKNOWN_MARKER) {
                            this.Editor().Dictionary().Add_Error(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.KNOWN_MARKER) {
                            this.Editor().Dictionary().Remove_Marker(selected.text);
                            this.Editor().Dictionary().Add_Error(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.UNKNOWN_WORD) {
                            this.Editor().Dictionary().Add_Error(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.KNOWN_WORD) {
                            this.Editor().Dictionary().Remove_Word(selected.text);
                            this.Editor().Dictionary().Add_Error(selected.text);
                            this.Set_Text(this.Text());
                        }
                        else if (selected.class === Dictionary_Class.KNOWN_ERROR) {
                            this.Editor().Dictionary().Remove_Error(selected.text);
                            this.Set_Text(this.Text());
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
                this.Set_Text(this.Text());
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
        Assert(index > -1);
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
        this.element.innerHTML = this.Editor().Dictionary().Treat(text);
    }
}
var Dictionary_Class;
(function (Dictionary_Class) {
    Dictionary_Class[Dictionary_Class["_NONE_"] = -1] = "_NONE_";
    Dictionary_Class[Dictionary_Class["UNKNOWN_POINT"] = 0] = "UNKNOWN_POINT";
    Dictionary_Class[Dictionary_Class["KNOWN_LETTER"] = 1] = "KNOWN_LETTER";
    Dictionary_Class[Dictionary_Class["UNKNOWN_MARKER"] = 2] = "UNKNOWN_MARKER";
    Dictionary_Class[Dictionary_Class["KNOWN_MARKER"] = 3] = "KNOWN_MARKER";
    Dictionary_Class[Dictionary_Class["UNKNOWN_WORD"] = 4] = "UNKNOWN_WORD";
    Dictionary_Class[Dictionary_Class["KNOWN_WORD"] = 5] = "KNOWN_WORD";
    Dictionary_Class[Dictionary_Class["KNOWN_ERROR"] = 6] = "KNOWN_ERROR";
})(Dictionary_Class || (Dictionary_Class = {}));
;
class Dictionary {
    static Selected_Text_And_Class() {
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
                if (span.textContent != null) {
                    const dictionary_text = span.textContent.replaceAll(/ /g, ` `);
                    if (dictionary_text !== ``) {
                        let dictionary_class = Dictionary_Class._NONE_;
                        // can't do KNOWN_LETTER unless we allow text as well as span
                        if (span.classList.contains(`UNKNOWN_POINT`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_POINT;
                        }
                        else if (span.classList.contains(`UNKNOWN_MARKER`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_MARKER;
                        }
                        else if (span.classList.contains(`KNOWN_MARKER`)) {
                            dictionary_class = Dictionary_Class.KNOWN_MARKER;
                        }
                        else if (span.classList.contains(`UNKNOWN_WORD`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_WORD;
                        }
                        else if (span.classList.contains(`KNOWN_WORD`)) {
                            dictionary_class = Dictionary_Class.KNOWN_WORD;
                        }
                        else if (span.classList.contains(`KNOWN_ERROR`)) {
                            dictionary_class = Dictionary_Class.KNOWN_ERROR;
                        }
                        if (dictionary_class !== Dictionary_Class._NONE_) {
                            return {
                                text: dictionary_text,
                                class: dictionary_class,
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
    constructor({ json = null, }) {
        if (json) {
            this.data = JSON.parse(json);
        }
        else {
            this.data = {
                letters: [],
                markers: [],
                words: {},
                errors: [],
            };
        }
    }
    Has_Letter(letter) {
        Assert(letter.length === 1);
        return this.data.letters.includes(letter);
    }
    Add_Letter(letter) {
        Assert(letter.length === 1);
        if (!this.data.letters.includes(letter)) {
            this.data.letters.push(letter);
            this.data.words[letter] = [];
        }
    }
    Remove_Letter(letter) {
        Assert(letter.length === 1);
        const index = this.data.letters.indexOf(letter);
        if (index > -1) {
            this.data.letters[index] = this.data.letters[this.data.letters.length - 1];
            this.data.letters.pop();
            delete this.data.words[letter];
        }
    }
    Has_Marker(marker) {
        Assert(marker.length > 0);
        return this.data.markers.includes(marker);
    }
    Add_Marker(marker) {
        Assert(marker.length > 0);
        Assert(!this.Has_Error(marker));
        if (!this.data.markers.includes(marker)) {
            this.data.markers.push(marker);
        }
    }
    Remove_Marker(marker) {
        Assert(marker.length > 0);
        const index = this.data.markers.indexOf(marker);
        if (index > -1) {
            this.data.markers[index] = this.data.markers[this.data.markers.length - 1];
            this.data.markers.pop();
        }
    }
    Has_Word(word) {
        Assert(word.length > 0);
        return (this.data.words[word[0]] != null &&
            this.data.words[word[0]].includes(word));
    }
    Add_Word(word) {
        Assert(word.length > 0);
        Assert(!this.Has_Error(word));
        if (this.data.words[word[0]] == null) {
            this.Add_Letter(word[0]);
            this.data.words[word[0]].push(word);
        }
        else {
            if (!this.data.words[word[0]].includes(word)) {
                this.data.words[word[0]].push(word);
            }
        }
    }
    Remove_Word(word) {
        Assert(word.length > 0);
        if (this.data.words[word[0]] != null) {
            const index = this.data.words[word[0]].indexOf(word);
            if (index > -1) {
                this.data.words[word[0]][index] = this.data.words[word[0]][this.data.words[word[0]].length - 1];
                this.data.words[word[0]].pop();
            }
        }
    }
    Has_Error(error) {
        Assert(error.length > 0);
        return this.data.errors.includes(error);
    }
    Add_Error(error) {
        Assert(error.length > 0);
        Assert(!this.Has_Marker(error));
        Assert(!this.Has_Word(error));
        if (!this.data.errors.includes(error)) {
            this.data.errors.push(error);
        }
    }
    Remove_Error(error) {
        Assert(error.length > 0);
        const index = this.data.errors.indexOf(error);
        if (index > -1) {
            this.data.errors[index] = this.data.errors[this.data.errors.length - 1];
            this.data.errors.pop();
        }
    }
    Treat(text) {
        let Type;
        (function (Type) {
            Type[Type["_NONE_"] = -1] = "_NONE_";
            Type[Type["POINT"] = 0] = "POINT";
            Type[Type["LETTERS"] = 1] = "LETTERS";
            Type[Type["MARKERS"] = 2] = "MARKERS";
        })(Type || (Type = {}));
        ;
        const parts = [];
        let current_start_index = 0;
        let current_type = Type._NONE_;
        for (let idx = 0, end = text.length; idx < end; idx += 1) {
            if (this.data.letters.includes(text[idx])) {
                current_type = Type.LETTERS;
            }
            else if (this.data.markers.includes(text[idx])) {
                current_type = Type.MARKERS;
            }
            else {
                current_type = Type.POINT;
            }
            if (current_type === Type.POINT) {
                parts.push({
                    subtext: text.slice(current_start_index, idx + 1),
                    type: Type.POINT,
                });
                current_start_index = idx + 1;
            }
            else if (current_type === Type.LETTERS) {
                if (idx + 1 === end ||
                    !this.data.letters.includes(text[idx + 1])) {
                    parts.push({
                        subtext: text.slice(current_start_index, idx + 1),
                        type: Type.LETTERS,
                    });
                    current_start_index = idx + 1;
                }
            }
            else if (current_type === Type.MARKERS) {
                if (idx + 1 === end ||
                    !this.data.markers.includes(text[idx + 1])) {
                    parts.push({
                        subtext: text.slice(current_start_index, idx + 1),
                        type: Type.MARKERS,
                    });
                    current_start_index = idx + 1;
                }
            }
            else {
                Assert(false);
            }
        }
        let inner_html = ``;
        for (const part of parts) {
            if (part.type === Type.POINT) {
                inner_html += `<span class="UNKNOWN_POINT">${Escape_Text(part.subtext)}</span>`;
            }
            else if (part.type === Type.LETTERS) {
                if (this.data.errors.includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_ERROR">${Escape_Text(part.subtext)}</span>`;
                }
                else if (this.data.words[part.subtext[0]].includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_WORD">${Escape_Text(part.subtext)}</span>`;
                }
                else {
                    inner_html += `<span class="UNKNOWN_WORD">${Escape_Text(part.subtext)}</span>`;
                }
            }
            else if (part.type === Type.MARKERS) {
                if (this.data.errors.includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_ERROR">${Escape_Text(part.subtext)}</span>`;
                }
                else if (this.data.markers.includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_MARKER">${Escape_Text(part.subtext)}</span>`;
                }
                else {
                    inner_html += `<span class="UNKNOWN_MARKER">${Escape_Text(part.subtext)}</span>`;
                }
            }
        }
        return inner_html;
    }
    JSON() {
        return JSON.stringify(this.data);
    }
}
class Editor {
    constructor({ parent, }) {
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {
            commands: document.createElement(`div`),
            load_file_input: document.createElement(`input`),
            load_file_button: document.createElement(`div`),
            save_file_button: document.createElement(`div`),
            file_name: document.createElement(`div`),
            lines: document.createElement(`div`),
        };
        this.element.setAttribute(`style`, `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                height: 100%;
                width: 100%;
                padding: 7px;

                border-width: 0;

                background-color: #0f1318;
                color: #E0ECFF;

                overflow-y: auto;
            `);
        this.children.commands.setAttribute(`style`, `
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                width: 100%;
                height: 5%;
            `);
        this.children.load_file_input.setAttribute(`type`, `file`);
        this.children.load_file_input.setAttribute(`accept`, `text/plain`);
        this.children.load_file_input.setAttribute(`style`, `
                display: none;
            `);
        this.children.load_file_input.addEventListener(`input`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.children.load_file_input.files && this.children.load_file_input.files[0]) {
                    const file = this.children.load_file_input.files[0];
                    const file_text = yield file.text();
                    this.Set_File_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Text(file_text);
                    this.children.load_file_input.value = ``;
                    Assert(this.Text() === file_text.replaceAll(/\r/g, ``));
                }
            });
        }.bind(this));
        this.children.load_file_button.setAttribute(`style`, `
                width: 50%;
                height: 100%;
            `);
        this.children.load_file_button.textContent = `Load`;
        this.children.load_file_button.addEventListener(`click`, function (event) {
            this.children.load_file_input.click();
        }.bind(this));
        this.children.save_file_button.setAttribute(`style`, `
                width: 50%;
                height: 100%;
            `);
        this.children.save_file_button.textContent = `Save`;
        this.children.save_file_button.addEventListener(`click`, function (event) {
            this.Save_Text();
        }.bind(this));
        this.children.file_name.setAttribute(`contentEditable`, `true`);
        this.children.file_name.setAttribute(`spellcheck`, `false`);
        this.children.file_name.setAttribute(`style`, `
                width: 100%;
                height: 5%;
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
        this.children.lines.setAttribute(`style`, `
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: start;
                
                width: 100%;
                height: 90%;
                padding: 2px;

                border-width: 2px;
                border-style: solid;
                border-color: #3B3A32;

                overflow-y: auto;
            `);
        this.dictionary = new Dictionary({});
        this.lines = [];
        this.children.commands.appendChild(this.children.load_file_input);
        this.children.commands.appendChild(this.children.load_file_button);
        this.children.commands.appendChild(this.children.save_file_button);
        this.element.appendChild(this.children.commands);
        this.element.appendChild(this.children.file_name);
        this.element.appendChild(this.children.lines);
        this.parent.appendChild(this.element);
        this.Set_File_Name(`New Text`);
        this.Add_Line(``);
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
    File_Name() {
        if (this.children.file_name.textContent) {
            return this.children.file_name.textContent.replaceAll(/ /g, ` `);
        }
        else {
            return ``;
        }
    }
    Set_File_Name(name) {
        this.children.file_name.innerHTML = this.Dictionary().Treat(name);
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
    }
    Clear_Text() {
        for (const line of this.lines) {
            line.Destruct();
        }
        this.lines = [];
    }
    Line_Count() {
        return this.lines.length;
    }
    Lines() {
        return Array.from(this.lines);
    }
    Line(line_index) {
        Assert(line_index >= 0);
        Assert(line_index < this.lines.length);
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
        Assert(line_index > 0);
        Assert(line_index < this.lines.length);
        if (line_index > 0) {
            this.lines.splice(line_index, 1)[0].Destruct();
        }
    }
    Insert_Line(at_line_index, text) {
        Assert(at_line_index >= 0);
        Assert(at_line_index <= this.lines.length);
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
}
function Style() {
    const style = document.createElement(`style`);
    style.setAttribute(`type`, `text/css`);
    style.appendChild(document.createTextNode(`
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
                }

                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .UNKNOWN_POINT {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #ffff00;
                }

                .UNKNOWN_WORD {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #ff5858;
                }

                .UNKNOWN_MARKER {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #00da6f;
                }

                .KNOWN_ERROR {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #e767c3;
                }
            `));
    document.head.appendChild(style);
}
function Build() {
    const text_editor = new Editor({
        parent: document.body,
    });
}
function Main() {
    Style();
    Build();
}
Main();
