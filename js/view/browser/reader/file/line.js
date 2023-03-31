import * as Entity from "../../../../entity.js";
import * as Model from "../../../../model/browser/reader/file/line.js";
import * as Item from "./item.js";
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
        const target = Math.max(Model.Instance.Min_Item_Count(), model.Item_Count());
        const count = this.Child_Count();
        for (let idx = count, end = target; idx < end; idx += 1) {
            new Item.Instance({
                model: () => this.Model().Item_At(idx),
                line: this,
            });
        }
    }
    On_Reclass() {
        const model = this.Model();
        const classes = [];
        classes.push(`Line`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        }
        else if (model.Text().Value() === ``) {
            classes.push(`Transparent`);
        }
        else if (model.Text().Is_Centered()) {
            classes.push(`Centered_Line`);
        }
        return classes;
    }
    Model() {
        return this.model();
    }
    File() {
        return this.Parent();
    }
}
