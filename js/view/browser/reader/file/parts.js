import * as Entity from "../../../../entity.js";
import * as Model from "../../../../model/browser/reader/file/parts.js";
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
        const model_count = Math.max(Model.Instance.Min_Count(), model.Count());
        const view_count = this.Child_Count();
        for (let idx = view_count, end = model_count; idx < end; idx += 1) {
            new Part.Instance({
                model: () => this.Model().At(idx),
                parts: this,
            });
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
