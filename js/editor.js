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
        return `&#${point.charCodeAt(0)};`;
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

                border-width: 0 0 1px 0;
                border-color: rgba(255, 255, 255, 0.7);
                border-style: solid;
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
        return this.element.textContent || ``;
    }
    Set_Text(text) {
        this.element.innerHTML = this.Editor().Dictionary().Treat(text);
    }
}
class Dictionary {
    constructor() {
        this.json = {
            letters: [],
            markers: [],
            words: {},
            errors: [],
        };
        this.Init_Test();
    }
    Init_Test() {
        this.json = JSON.parse(`
            {
                "letters": [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z"
                ],
                "markers": [
                    " ",
                    ",",
                    "."
                ],
                "words": {
                    "a": [
                        "apple",
                        "angel"
                    ],
                    "b": [
                        "baby",
                        "bath"
                    ],
                    "c": [],
                    "d": [],
                    "e": [],
                    "f": [],
                    "g": [],
                    "h": [],
                    "i": [],
                    "j": [],
                    "k": [],
                    "l": [],
                    "m": [],
                    "n": [],
                    "o": [],
                    "p": [],
                    "q": [],
                    "r": [],
                    "s": [],
                    "t": [],
                    "u": [],
                    "v": [],
                    "w": [],
                    "x": [],
                    "y": [],
                    "z": []
                },
                "errors": [
                    "aple",
                    "batth"
                ]
            }
        `);
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
            if (this.json.letters.includes(text[idx])) {
                current_type = Type.LETTERS;
            }
            else if (this.json.markers.includes(text[idx])) {
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
                    !this.json.letters.includes(text[idx + 1])) {
                    parts.push({
                        subtext: text.slice(current_start_index, idx + 1),
                        type: Type.LETTERS,
                    });
                    current_start_index = idx + 1;
                }
            }
            else if (current_type === Type.MARKERS) {
                if (idx + 1 === end ||
                    !this.json.markers.includes(text[idx + 1])) {
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
                if (this.json.errors.includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_ERROR">${Escape_Text(part.subtext)}</span>`;
                }
                else if (this.json.words[part.subtext[0]].includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_WORD">${Escape_Text(part.subtext)}</span>`;
                }
                else {
                    inner_html += `<span class="UNKNOWN_WORD">${Escape_Text(part.subtext)}</span>`;
                }
            }
            else if (part.type === Type.MARKERS) {
                if (this.json.markers.includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_MARKER">${Escape_Text(part.subtext)}</span>`;
                }
                else {
                    inner_html += `<span class="UNKNOWN_MARKER">${Escape_Text(part.subtext)}</span>`;
                }
            }
        }
        return inner_html;
    }
}
class Editor {
    constructor({ parent, }) {
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {
            commands: document.createElement(`div`),
            load_input: document.createElement(`input`),
            load_button: document.createElement(`div`),
            save_button: document.createElement(`div`),
            name: document.createElement(`div`),
            lines: document.createElement(`div`),
        };
        this.element.setAttribute(`style`, `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                height: 90%;
                width: 90%;
                padding: 2px;

                border-width: 0;

                background-color: blue;
                color: white;

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
        this.children.load_input.setAttribute(`type`, `file`);
        this.children.load_input.setAttribute(`accept`, `text/plain`);
        this.children.load_input.setAttribute(`style`, `
                display: none;
            `);
        this.children.load_input.addEventListener(`input`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.children.load_input.files && this.children.load_input.files[0]) {
                    const file = this.children.load_input.files[0];
                    const file_text = yield file.text();
                    this.Set_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Text(file_text);
                    this.children.load_input.value = ``;
                    Assert(this.Text() === file_text.replaceAll(/\r/g, ``));
                }
            });
        }.bind(this));
        this.children.load_button.setAttribute(`style`, `
                width: 50%;
                height: 100%;
            `);
        this.children.load_button.textContent = `Load`;
        this.children.load_button.addEventListener(`click`, function (event) {
            this.children.load_input.click();
        }.bind(this));
        this.children.save_button.setAttribute(`style`, `
                width: 50%;
                height: 100%;
            `);
        this.children.save_button.textContent = `Save`;
        this.children.save_button.addEventListener(`click`, function (event) {
            this.Save_Text();
        }.bind(this));
        this.children.name.setAttribute(`contentEditable`, `true`);
        this.children.name.setAttribute(`spellcheck`, `false`);
        this.children.name.setAttribute(`style`, `
                width: 100%;
                height: 5%;
            `);
        this.children.name.addEventListener(`keydown`, function (event) {
            if (event.key === `Enter`) {
                event.preventDefault();
            }
        }.bind(this));
        this.children.name.addEventListener(`input`, function (event) {
            const input_event = event;
            if (input_event.inputType === `insertFromPaste`) {
                const selection = document.getSelection();
                if (selection &&
                    selection.anchorNode &&
                    selection.anchorNode !== this.children.name) {
                    let new_offset = Text_Offset_To_Node(this.children.name, selection.anchorNode) +
                        selection.anchorOffset;
                    this.children.name.innerHTML = this.children.name.textContent || ``;
                    selection.collapse(this.children.name.firstChild || this.children.name, new_offset);
                }
                else {
                    this.children.name.innerHTML = ``;
                }
            }
        }.bind(this));
        this.Set_Name(`new_text`);
        this.children.lines.setAttribute(`style`, `
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: start;
                
                width: 100%;
                height: 90%;
                padding: 2px;

                border-width: 2px;
                border-color: rgba(255, 255, 255, 0.7);
                border-style: solid;

                overflow-y: auto;
            `);
        this.children.commands.appendChild(this.children.load_input);
        this.children.commands.appendChild(this.children.load_button);
        this.children.commands.appendChild(this.children.save_button);
        this.element.appendChild(this.children.commands);
        this.element.appendChild(this.children.name);
        this.element.appendChild(this.children.lines);
        this.parent.appendChild(this.element);
        this.dictionary = new Dictionary();
        this.lines = [];
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
    Name() {
        return this.children.name.textContent || ``;
    }
    Set_Name(name) {
        this.children.name.innerHTML = Escape_Text(name);
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
        const name = this.Name();
        const file = new File([text], `${name}.txt`);
        const file_url = URL.createObjectURL(file);
        const link = document.createElement(`a`);
        link.href = file_url;
        link.download = `${name}.txt`;
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
