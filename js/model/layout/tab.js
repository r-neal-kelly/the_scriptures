import * as Entity from "../entity.js";
export class Instance extends Entity.Instance {
    constructor({ tabs, window }) {
        super();
        this.tabs = tabs;
        this.window = window;
        this.Is_Ready_After([]);
    }
    Tabs() {
        return this.tabs;
    }
    Window() {
        return this.window;
    }
}
