import * as Entity from "../../../entity.js";
import * as Minimize from "./minimize.js";
import * as Maximize from "./maximize.js";
import * as Close from "./close.js";
export class Instance extends Entity.Instance {
    constructor({ bar, }) {
        super();
        this.bar = bar;
        this.minimize = new Minimize.Instance({
            commands: this,
        });
        this.maximize = new Maximize.Instance({
            commands: this,
        });
        this.close = new Close.Instance({
            commands: this,
        });
        this.Is_Ready_After([
            this.minimize,
            this.maximize,
            this.close,
        ]);
    }
    Bar() {
        return this.bar;
    }
    Minimize() {
        return this.minimize;
    }
    Maximize() {
        return this.maximize;
    }
    Close() {
        return this.close;
    }
}
