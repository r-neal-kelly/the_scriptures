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
import * as Event from "./event.js";
import * as Entity from "./entity.js";
import * as Model from "./model/browser.js";
import * as View from "./view/browser.js";
class Body extends Entity.Instance {
    constructor() {
        super(document.body, new Event.Grid());
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
            this.Element().addEventListener(`click`, function () {
                this.Send({
                    affix: "Test",
                    type: Event.Type.EXCLUSIVE,
                });
            }.bind(this));
            return [
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before Infinity"),
                    event_priority: Infinity,
                },
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: function (data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.log("before 3");
                            yield Utils.Wait_Seconds(1);
                            console.log(Event.Instance.From(data));
                        });
                    },
                    event_priority: 3,
                },
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before 2"),
                    event_priority: 2,
                },
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before 1"),
                    event_priority: 1,
                },
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before -Infinity"),
                    event_priority: -Infinity,
                },
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Test"),
                    event_handler: () => console.log("on 3"),
                    event_priority: 3,
                },
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Test"),
                    event_handler: () => console.log("on 2"),
                    event_priority: 2,
                },
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Test"),
                    event_handler: () => console.log("on 1"),
                    event_priority: 1,
                },
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Test"),
                    event_handler: () => console.log("after 3"),
                    event_priority: 3,
                },
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Test"),
                    event_handler: () => console.log("after 2"),
                    event_priority: 2,
                },
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Test"),
                    event_handler: () => console.log("after 1"),
                    event_priority: 1,
                },
            ];
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.view = new View.Instance({
                model: new Model.Instance(),
                root: this,
            });
            this.Add_Child(this.view);
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
        super(`div`, new Event.Grid());
    }
}
class Lines extends Entity.Instance {
    constructor() {
        super(`div`, new Event.Grid());
    }
}
class Line extends Entity.Instance {
    constructor() {
        super(`div`, new Event.Grid());
    }
}
class Word extends Entity.Instance {
    constructor() {
        super(`div`, new Event.Grid());
    }
}
class Letter extends Entity.Instance {
    constructor() {
        super(`div`, new Event.Grid());
    }
}
class Break extends Entity.Instance {
    constructor() {
        super(`div`, new Event.Grid());
    }
}
class Marker extends Entity.Instance {
    constructor() {
        super(`div`, new Event.Grid());
    }
}
