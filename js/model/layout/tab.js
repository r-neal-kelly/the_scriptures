export class Instance {
    constructor({ tabs, window }) {
        this.tabs = tabs;
        this.window = window;
    }
    Tabs() {
        return this.tabs;
    }
    ID() {
        return this.window.ID();
    }
    Window() {
        return this.window;
    }
}
