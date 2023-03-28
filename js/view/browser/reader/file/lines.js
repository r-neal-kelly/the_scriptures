import * as Entity from "../../../../entity.js";
import * as Line from "./line.js";
export class Instance extends Entity.Instance {
    constructor({ model, file, }) {
        super({
            element: `div`,
            parent: file,
            event_grid: file.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        const count = this.Child_Count();
        const delta = model.Count() - count;
        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;
                this.Abort_Child(this.Child(idx));
            }
        }
        else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Line.Instance({
                    model: () => this.Model().At(idx),
                    lines: this,
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
    File() {
        return this.Parent();
    }
}
