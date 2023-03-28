import * as Entity from "../../../../entity.js";
import * as Model from "../../../../model/browser/reader/file/lines.js";
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
        const target = Math.max(Model.Instance.Min_Count(), model.Count());
        const count = this.Child_Count();
        for (let idx = count, end = target; idx < end; idx += 1) {
            new Line.Instance({
                model: () => this.Model().At(idx),
                lines: this,
            });
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
