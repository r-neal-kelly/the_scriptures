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
class Line {
    constructor({ parent, }) {
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.element.setAttribute(`contentEditable`, `true`);
        this.element.setAttribute(`spellcheck`, `false`);
        this.element.setAttribute(`style`, `
                width: 100%;
            `);
        this.element.addEventListener(`keydown`, function (event) {
            if (event.key === `Enter`) {
                event.preventDefault();
            }
        }.bind(this));
        this.element.addEventListener(`input`, function (event) {
            const input_event = event;
            if (input_event.inputType === `insertFromPaste`) {
                const selection = document.getSelection();
                if (selection &&
                    selection.anchorNode &&
                    selection.anchorNode !== this.element) {
                    let new_offset = Text_Offset_To_Node(this.element, selection.anchorNode) +
                        selection.anchorOffset;
                    this.element.innerHTML = this.element.textContent || ``;
                    selection.collapse(this.element.firstChild || this.element, new_offset);
                }
                else {
                    this.element.innerHTML = ``;
                }
            }
        }.bind(this));
        this.parent.appendChild(this.element);
    }
    Parent() {
        return this.parent;
    }
    Element() {
        return this.element;
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
                    Assert(this.Get_Text() === file_text.replaceAll(/\r/g, ``));
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

                overflow-y: auto;
            `);
        this.children.commands.appendChild(this.children.load_input);
        this.children.commands.appendChild(this.children.load_button);
        this.children.commands.appendChild(this.children.save_button);
        this.element.appendChild(this.children.commands);
        this.element.appendChild(this.children.name);
        this.element.appendChild(this.children.lines);
        this.parent.appendChild(this.element);
        this.lines = [];
        this.Add_Line();
    }
    Parent() {
        return this.parent;
    }
    Element() {
        return this.element;
    }
    Get_Name() {
        return this.children.name.textContent || ``;
    }
    Set_Name(name) {
        this.children.name.innerHTML = Escape_Text(name);
    }
    Get_Text() {
        return this.lines.map(line => line.Element().textContent || ``).join(`\n`);
    }
    Set_Text(text) {
        this.Clear_Text();
        const text_lines = text.split(/\r?\n/);
        for (const text_line of text_lines) {
            this.Add_Line(text_line);
        }
    }
    Save_Text() {
        const text = this.Get_Text();
        const name = this.Get_Name();
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
            this.children.lines.removeChild(line.Element());
        }
        this.lines = [];
    }
    Add_Line(text = ``) {
        const line = new Line({
            parent: this.children.lines,
        });
        this.lines.push(line);
        line.Element().innerHTML = Escape_Text(text);
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
