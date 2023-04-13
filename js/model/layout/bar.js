import * as Entity from "../entity.js";
import * as Tabs from "./tabs.js";
export class Instance extends Entity.Instance {
    constructor({ layout, }) {
        super();
        this.layout = layout;
        this.tabs = new Tabs.Instance({
            bar: this,
        });
        this.Add_Dependencies([
            this.tabs,
        ]);
    }
    Layout() {
        return this.layout;
    }
    Tabs() {
        return this.tabs;
    }
}
