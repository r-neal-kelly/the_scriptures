import * as Entity from "../entity.js";
import * as Tab from "./tab.js";
export class Instance extends Entity.Instance {
    constructor({ model, bar, }) {
        super({
            element: `div`,
            parent: bar,
            event_grid: bar.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        const target = model.Count();
        const count = this.Child_Count();
        const delta = target - count;
        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;
                this.Abort_Child(this.Child(idx));
            }
        }
        else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Tab.Instance({
                    model: () => this.Model().At(idx),
                    tabs: this,
                });
            }
        }
    }
    On_Reclass() {
        return [`Tabs`];
    }
    Model() {
        return this.model();
    }
    Bar() {
        return this.Parent();
    }
}
