import * as Entity from "../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, tabs, }) {
        super({
            element: `div`,
            parent: tabs,
            event_grid: tabs.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        this.Element().textContent = `Tab`;
    }
    On_Reclass() {
        return [`Tab`];
    }
    Model() {
        return this.model();
    }
    Tabs() {
        return this.Parent();
    }
}
