import * as Entity from "../../../../entity.js";
import * as Part from "./part.js";
export class Instance extends Entity.Instance {
    constructor({ model, line, }) {
        super({
            element: `div`,
            parent: line,
            event_grid: line.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        const target = model.Count();
        const current = this.Child_Count();
        const delta = target - current;
        if (delta < 0) {
            for (let idx = current, end = current + delta; idx > end;) {
                idx -= 1;
                this.Abort_Child(this.Child(idx));
            }
        }
        else if (delta > 0) {
            for (let idx = current, end = current + delta; idx < end; idx += 1) {
                new Part.Instance({
                    model: () => this.Model().At(idx),
                    parts: this,
                });
            }
        }
    }
    On_Restyle() {
        return ``;
    }
    Model() {
        return this.model();
    }
    Line() {
        return this.Parent();
    }
}
