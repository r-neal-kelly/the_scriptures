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
    Title() {
        if (this.Window().Is_Ready()) {
            return this.Window().Program().Model_Instance().Short_Title();
        }
        else {
            return `Loading`;
        }
    }
    Is_Active() {
        return this.Tabs().Bar().Layout().Maybe_Active_Window() === this.Window();
    }
}
