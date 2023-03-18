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
import * as Entity from "./entity.js";
class Browser extends Entity.Instance {
    constructor() {
        super(`div`);
        this.book_info = null;
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            const info_response = yield fetch(Utils.Resolve_Path(`txt/Jubilees/English/R. H. Charles/Info.json`));
            if (info_response.ok) {
                this.book_info = JSON.parse(yield info_response.text());
            }
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return ({
                "display": `grid`,
                "width": `100%`,
                "height": `100%`,
                "overflow-x": `hidden`,
                "overflow-y": `auto`,
                "color": `white`,
            });
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.book_info) {
                yield this.Kill_All_Children();
                for (const file_name of this.book_info.file_names) {
                    const file_response = yield fetch(Utils.Resolve_Path(`txt/Jubilees/English/R. H. Charles/${file_name}`));
                    if (file_response.ok) {
                        const file_text = yield file_response.text();
                        for (const file_line of file_text.split(/\r?\n/g)) {
                            this.Add_Child(new Line(file_line));
                        }
                        this.Add_Child(new Line(``));
                    }
                }
            }
        });
    }
}
// temp
class Line extends Entity.Instance {
    constructor(text) {
        super(`div`);
        this.text = text;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return ({
                "color": this.text === `` ?
                    `transparent` :
                    `inherit`,
            });
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.text === ``) {
                this.Element().textContent = `_`;
            }
            else {
                this.Element().textContent = this.text.replaceAll(/  /g, `  `);
            }
        });
    }
}
class Body extends Entity.Instance {
    constructor() {
        super(document.body);
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
            this.Add_Child(new Browser());
        });
    }
}
const body = new Body();
