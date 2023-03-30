import * as Entity from "../../../../entity.js";
import * as Model from "../../../../model/browser/reader/file/segment.js";
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
        const target = Math.max(Model.Instance.Min_Part_Count(), model.Part_Count());
        const count = this.Child_Count();
        for (let idx = count, end = target; idx < end; idx += 1) {
            new Part.Instance({
                model: () => this.Model().Part_At(idx),
                segment: this,
            });
        }
    }
    On_Reclass() {
        const model = this.Model();
        const classes = [];
        classes.push(`Segment`);
        if (model.Is_Blank()) {
            classes.push(`Blank_Segment`);
        }
        return classes;
    }
    Model() {
        return this.model();
    }
    Line() {
        return this.Parent();
    }
}
