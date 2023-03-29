import * as Entity from "../../../../entity.js";
import * as Model from "../../../../model/browser/reader/file/segments.js";
import * as Segment from "./segment.js";
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
        const target = Math.max(Model.Instance.Min_Count(), model.Count());
        const count = this.Child_Count();
        for (let idx = count, end = target; idx < end; idx += 1) {
            new Segment.Instance({
                model: () => this.Model().At(idx),
                segments: this,
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
