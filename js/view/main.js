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
import * as Model from "../model/layout.js";
import * as View from "./layout.js";
import * as Browser_Model from "../model/browser.js";
import * as Browser_View from "./browser.js";
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
        this.Add_CSS(`
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                *:focus {
                    outline: 0;
                }
            `);
        this.Add_This_CSS(`
                .Body {
                    width: 100vw;
                    height: 100vh;

                    background-color: black;

                    font-family: sans-serif;
                }
            `);
        this.Window().addEventListener(`beforeunload`, function (event) {
            this.Die();
        }.bind(this));
        return [];
    }
    On_Refresh() {
        if (!this.Has_View()) {
            this.Abort_All_Children();
            new View.Instance({
                model: () => this.Model(),
                root: this,
            });
        }
    }
    On_Reclass() {
        return [`Body`];
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
        // Once we set up our save file structure, or at least prototype it,
        // we'll pull each window's model's data from there and pass it along.
        yield Promise.all([
            model.Add_Window({
                model_class: Browser_Model.Instance,
                view_class: Browser_View.Instance,
                model_data: {
                    selector_slot_order: Browser_Model.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
                },
            }),
            model.Add_Window({
                model_class: Browser_Model.Instance,
                view_class: Browser_View.Instance,
                model_data: {
                    selector_slot_order: Browser_Model.Selector.Slot.Order.BOOKS_VERSIONS_LANGUAGES,
                },
            }),
            model.Add_Window({
                model_class: Browser_Model.Instance,
                view_class: Browser_View.Instance,
                model_data: {
                    selector_slot_order: Browser_Model.Selector.Slot.Order.LANGUAGES_BOOKS_VERSIONS,
                },
            }),
            model.Add_Window({
                model_class: Browser_Model.Instance,
                view_class: Browser_View.Instance,
                model_data: {
                    selector_slot_order: Browser_Model.Selector.Slot.Order.LANGUAGES_VERSIONS_BOOKS,
                },
            }),
            model.Add_Window({
                model_class: Browser_Model.Instance,
                view_class: Browser_View.Instance,
                model_data: {
                    selector_slot_order: Browser_Model.Selector.Slot.Order.VERSIONS_BOOKS_LANGUAGES,
                },
            }),
            model.Add_Window({
                model_class: Browser_Model.Instance,
                view_class: Browser_View.Instance,
                model_data: {
                    selector_slot_order: Browser_Model.Selector.Slot.Order.VERSIONS_LANGUAGES_BOOKS,
                },
            }),
        ]);
        new Body({
            model: model,
        });
    });
}
Main();
