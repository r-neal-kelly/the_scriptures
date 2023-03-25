export var Boundary;
(function (Boundary) {
    Boundary["START"] = "START";
    Boundary["MIDDLE"] = "MIDDLE";
    Boundary["END"] = "END";
})(Boundary || (Boundary = {}));
;
export class Instance {
    constructor({ json = null, }) {
        if (json != null) {
            this.info = JSON.parse(json);
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
    }
    Info() {
        return this.info;
    }
}
