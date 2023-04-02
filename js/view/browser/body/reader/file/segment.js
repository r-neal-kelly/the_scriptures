import * as Entity from "../../../../../entity.js";
import * as Model from "../../../../../model/browser/body/reader/file/segment.js";
import * as Item from "./item.js";
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
        if (model.Is_Blank()) {
            this.Skip_Children();
            if (this.Element().classList.contains(`Blank`)) {
                this.Skip_Remaining_Siblings();
            }
        }
        else {
            const target = Math.max(Model.Instance.Min_Item_Count(), model.Item_Count());
            const count = this.Child_Count();
            for (let idx = count, end = target; idx < end; idx += 1) {
                new Item.Instance({
                    model: () => this.Model().Item_At(idx),
                    segment: this,
                });
            }
        }
    }
    On_Reclass() {
        const model = this.Model();
        const classes = [];
        classes.push(`Segment`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
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
