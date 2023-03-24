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
    constructor() {
        super({
            element: document.body,
            parent: null,
            event_grid: new Event.Grid(),
        });
        this.model = null;
        this.view = null;
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Abort_All_Children();
            this.model = new Model.Instance();
            yield this.model.Ready();
            this.view = new View.Instance({
                model: this.model,
                root: this,
            });
        });
    }
    Window() {
        return window;
    }
    Document() {
        return document;
    }
    View() {
        Utils.Assert(this.view != null, `Does not have a view.`);
        return this.view;
    }
}
new Body();
// these placeholder classes will be for the currently open file
// we'll also need classes for the tabs.
// the tabs will have rows, one for each: books, languages, versions, maybe even files.
// you can close a book and the languages and versions will auto update
class File extends Entity.Instance {
    constructor() {
        super({
            element: `div`,
            parent: null,
            event_grid: new Event.Grid(),
        });
    }
}
class Lines extends Entity.Instance {
    constructor() {
        super({
            element: `div`,
            parent: null,
            event_grid: new Event.Grid(),
        });
    }
}
class Line extends Entity.Instance {
    constructor() {
        super({
            element: `div`,
            parent: null,
            event_grid: new Event.Grid(),
        });
    }
}
class Word extends Entity.Instance {
    constructor() {
        super({
            element: `span`,
            parent: null,
            event_grid: new Event.Grid(),
        });
    }
}
class Letter extends Entity.Instance {
    constructor() {
        super({
            element: `span`,
            parent: null,
            event_grid: new Event.Grid(),
        });
    }
}
class Break extends Entity.Instance {
    constructor() {
        super({
            element: `span`,
            parent: null,
            event_grid: new Event.Grid(),
        });
    }
}
class Marker extends Entity.Instance {
    constructor() {
        super({
            element: `span`,
            parent: null,
            event_grid: new Event.Grid(),
        });
    }
}
