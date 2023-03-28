import * as Entity from "../../../../entity.js";
import * as Item from "./item.js";
export class Instance extends Entity.Instance {
    constructor({ model, slot, }) {
        super({
            element: `div`,
            parent: slot,
            event_grid: slot.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        if (this.Child_Count() !== model.Count()) {
            this.Abort_All_Children();
            for (const item_model of this.Model().Array()) {
                new Item.Instance({
                    model: item_model,
                    items: this,
                });
            }
        }
        /*
        const model: Model.Instance = this.Model();
        const count: Count = this.Child_Count();
        const delta: Delta = model.Count() - count;

        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        } else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Line.Instance(
                    {
                        model: () => this.Model().At(idx),
                        lines: this,
                    },
                );
            }
        }
        */
    }
    On_Restyle() {
        return `
            width: 100%;

            padding: 2px 2px;

            overflow-x: auto;
            overflow-y: auto;
        `;
    }
    Model() {
        return this.model;
    }
    Slot() {
        return this.Parent();
    }
}
