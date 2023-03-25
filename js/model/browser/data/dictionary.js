var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";
export var Boundary;
(function (Boundary) {
    Boundary["START"] = "START";
    Boundary["MIDDLE"] = "MIDDLE";
    Boundary["END"] = "END";
})(Boundary || (Boundary = {}));
;
export class Instance extends Async.Instance {
    constructor({ files, }) {
        super();
        this.files = files;
        this.name = `Dictionary.json`;
        this.path = `${files.Path()}/${this.name}`;
        this.title = this.name.replace(/\.[^.]*$/, ``);
        this.extension = this.name.replace(/^[^.]*\./, ``);
        this.info = null;
    }
    Files() {
        return this.files;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Title() {
        return this.title;
    }
    Extension() {
        return this.extension;
    }
    Info() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        Utils.Assert(this.info != null, `Info should not be null when dictionary is ready.`);
        return this.info;
    }
    // We should be able to pass some options probably,
    // like whether or not to parse commands literally,
    // so the caller doesn't have to manually remove them.
    // Another important thing is that we'll probably
    // want to send the complete text of a file and this
    // will automatically break it down into lines. That
    // way we can supply life information, e.g. for the
    // center command.
    Parse({ text, }) {
        return [];
    }
    Parse_As_Points({ text, }) {
        return [];
    }
    Ready() {
        const _super = Object.create(null, {
            Ready: { get: () => super.Ready }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.Ready.call(this);
            const response = yield fetch(Utils.Resolve_Path(this.Path()));
            if (response.ok) {
                this.info = JSON.parse(yield response.text());
            }
            else {
                this.info = {
                    letters: [],
                    markers: [],
                    words: {},
                    breaks: {
                        [Boundary.START]: {},
                        [Boundary.MIDDLE]: {},
                        [Boundary.END]: {},
                    },
                    word_errors: [],
                    break_errors: {
                        [Boundary.START]: [],
                        [Boundary.MIDDLE]: [],
                        [Boundary.END]: [],
                    },
                };
            }
        });
    }
}
