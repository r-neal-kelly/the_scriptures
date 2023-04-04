import * as Utils from "../../utils.js";
import * as Entity from "../entity.js";
import * as Tab from "./tab.js";
export class Instance extends Entity.Instance {
    constructor({ bar, }) {
        super();
        this.bar = bar;
        this.window_ids = [];
        this.tabs = [];
        this.Is_Ready_After(this.tabs);
    }
    Bar() {
        return this.bar;
    }
    Count() {
        return this.tabs.length;
    }
    Has(tab) {
        return this.tabs.indexOf(tab) > -1;
    }
    Has_At(index) {
        return (index > -1 &&
            index < this.tabs.length);
    }
    At(index) {
        Utils.Assert(index > -1, `index must be greater than -1.`);
        Utils.Assert(index < this.Count(), `index must be less than count.`);
        return this.tabs[index];
    }
    Tabs() {
        return Array.from(this.tabs);
    }
    Has_Window(window) {
        return this.window_ids.indexOf(window.ID()) > -1;
    }
    Add_Window(window) {
        Utils.Assert(!this.Has_Window(window), `Already has window with id of ${window.ID()}.`);
        this.window_ids.push(window.ID());
        this.tabs.push(new Tab.Instance({
            tabs: this,
            window: window,
        }));
    }
    Remove_Window(window) {
        const index = this.window_ids.indexOf(window.ID());
        Utils.Assert(index > -1, `Does not have window with id of ${window.ID()}.`);
        this.window_ids.splice(index, 1);
        this.tabs.splice(index, 1);
    }
    Windows() {
        const windows = [];
        for (const tab of this.tabs) {
            windows.push(tab.Window());
        }
        return windows;
    }
}
