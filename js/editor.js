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
class Text_Editor {
    constructor({ name = `new_text`, parent, style, }) {
        this.name = name;
        this.parent = parent;
        this.wrapper = document.createElement(`div`);
        this.wrapper.setAttribute(`style`, style);
        this.editor = document.createElement(`div`);
        this.editor.setAttribute(`contenteditable`, `true`);
        this.editor.setAttribute(`style`, `
                width: 100%;
                height: 100%;
            `);
        this.editor.innerHTML = `<div></div>`;
        this.input = document.createElement(`input`);
        this.input.setAttribute(`type`, `file`);
        this.input.setAttribute(`accept`, `text/plain`);
        this.input.setAttribute(`style`, `
                display: block;
            `);
        this.input.addEventListener(`input`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.input.files && this.input.files[0]) {
                    const file = this.input.files[0];
                    const file_text = yield file.text();
                    this.Set_Text(file_text);
                    Assert(this.Get_Text() === file_text.replaceAll(/\r/g, ``));
                    this.Save_Text(); // temp
                }
            });
        }.bind(this));
        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.editor);
        this.parent.appendChild(this.wrapper);
    }
    Get_Name() {
        return this.name;
    }
    Get_Text() {
        return this.editor.innerHTML
            .replace(/^\<div\>/, ``)
            .replace(/\<\/div\>$/, ``)
            .replaceAll(/\<br\>/g, ``)
            .replaceAll(/\<\/div\>\<div\>/g, `\n`);
    }
    Set_Text(text) {
        this.editor.innerHTML =
            text.split(/\r?\n/).map(function (line) {
                if (line === ``) {
                    line = `<br>`;
                }
                else {
                    line = line.replaceAll(/./g, function (character) {
                        return `&#${character.charCodeAt(0)};`;
                    });
                }
                return `<div>${line}</div>`;
            }).join(``);
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
    const text_editor = new Text_Editor({
        parent: document.body,
        style: `
                height: 300px;
                width: 90%;
                padding: 2px;

                border-width: 0;

                background-color: blue;
                color: white;

                overflow-y: auto;
            `,
    });
}
function Main() {
    Style();
    Build();
}
Main();
