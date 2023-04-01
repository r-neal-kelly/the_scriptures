import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";
import * as Tabs from "./tabs.js";
export class Instance extends Entity.Instance {
    constructor({ model, layout, }) {
        super({
            element: `div`,
            parent: layout,
            event_grid: layout.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        if (!this.Has_Tabs()) {
            this.Abort_All_Children();
            new Tabs.Instance({
                model: () => this.Model().Tabs(),
                bar: this,
            });
        }
    }
    On_Reclass() {
        return [`Bar`];
    }
    Model() {
        return this.model();
    }
    Layout() {
        return this.Parent();
    }
    Has_Tabs() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Tabs.Instance);
    }
    Tabs() {
        Utils.Assert(this.Has_Tabs(), `Does not have tabs.`);
        return this.Child(0);
    }
}
