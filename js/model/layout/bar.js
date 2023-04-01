import * as Tabs from "./tabs.js";
export class Instance {
    constructor({ layout, }) {
        this.layout = layout;
        this.tabs = new Tabs.Instance({
            bar: this,
        });
    }
    Layout() {
        return this.layout;
    }
    Tabs() {
        return this.tabs;
    }
}
