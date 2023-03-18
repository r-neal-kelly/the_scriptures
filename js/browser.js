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
class Browser {
    constructor({ parent_element, }) {
        this.element = document.createElement(`div`);
        this.element.setAttribute(`style`, `
                display: grid;

                width: 100%;
                height: 100%;

                overflow-x: hidden;
                overflow-y: hidden;

                color: white;
            `);
        this.element.textContent = `Browsing...`;
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                while (this.Is_Alive()) {
                    const element = this.Element();
                    if (element.textContent === `Browsing.`) {
                        element.textContent = `Browsing..`;
                    }
                    else if (element.textContent === `Browsing..`) {
                        element.textContent = `Browsing...`;
                    }
                    else if (element.textContent === `Browsing...`) {
                        element.textContent = `Browsing.`;
                    }
                    else {
                        Utils.Assert(false);
                    }
                    yield Utils.Wait_Milliseconds(300);
                }
            });
        }.bind(this))();
        parent_element.appendChild(this.element);
    }
    Element() {
        Utils.Assert(this.Is_Alive(), `Calling method on a dead instance.`);
        Utils.Assert(this.element != null, `Does not have an element!`);
        return this.element;
    }
    Parent_Element() {
        Utils.Assert(this.Is_Alive(), `Calling method on a dead instance.`);
        Utils.Assert(this.Element().parentElement != null, `Does not have a parent element!`);
        return this.Element().parentElement;
    }
    Is_Alive() {
        return this.element != null;
    }
    Is_Dead() {
        return !this.Is_Alive();
    }
    Kill() {
        Utils.Assert(this.Is_Dead(), `Instance is already dead.`);
        this.Parent_Element().removeChild(this.Element());
        this.element = null;
    }
}
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
`);
new Browser({
    parent_element: document.body,
});
