var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../utils.js";
import * as Event from "../event.js";
import * as Entity from "../entity.js";
import * as Model from "../model/browser.js";
import * as View from "./browser.js";
class Body extends Entity.Instance {
    constructor({ model, }) {
        super({
            element: document.body,
            parent: null,
            event_grid: new Event.Grid(),
        });
        this.model = model;
    }
    On_Life() {
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
        this.Window().addEventListener(`beforeunload`, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.Die();
            });
        }.bind(this));
        return [];
    }
    On_Refresh() {
        if (!this.Has_View()) {
            this.Abort_All_Children();
            new View.Instance({
                model: this.Model(),
                root: this,
            });
        }
    }
    Model() {
        return this.model;
    }
    Window() {
        return window;
    }
    Document() {
        return document;
    }
    Has_View() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof View.Instance);
    }
    View() {
        Utils.Assert(this.Has_View(), `Does not have a view.`);
        return this.Child(0);
    }
}
function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        const model = new Model.Instance();
        yield model.Ready();
        new Body({
            model: model,
        });
    });
}
Main();
