import * as Entity from "../../entity.js";
import * as Window from "./window.js";
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
                new Window.Instance({
                    model: () => this.Model().At(idx),
                    wall: this,
                });
            }
        }
    }
    On_Reclass() {
        return [`Wall`];
    }
    Model() {
        return this.model();
    }
    Layout() {
        return this.Parent();
    }
}
