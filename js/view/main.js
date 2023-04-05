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
import * as Entity from "./entity.js";
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
        const view = new Body({
            model: model,
        });
        const data = [
            [
                Browser_Model.Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
                `Genesis`,
                `English`,
                `KJV 1872-1888+`,
                `Chapter 01.txt`,
            ],
            [
                Browser_Model.Body.Selector.Slot.Order.VERSIONS_LANGUAGES_BOOKS,
                `Jubilees`,
                `English`,
                `R. H. Charles 1913`,
                `Chapter 01.txt`,
            ],
        ];
        for (const [order, book_name, language_name, version_name, file_name] of data) {
            model.Add_Program(new Model.Window.Program.Instance({
                model_class: Browser_Model.Instance,
                model_data: {
                    selection: new Browser_Model.Selection.Name({
                        book: book_name,
                        language: language_name,
                        version: version_name,
                        file: file_name,
                    }),
                    selector_slot_order: order,
                    is_selector_open: false,
                },
                view_class: Browser_View.Instance,
            }));
        }
    });
}
Main();
