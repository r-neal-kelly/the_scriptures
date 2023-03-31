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
                new Item.Instance({
                    model: model.At(idx),
                    items: this,
                });
            }
        }
    }
    On_Reclass() {
        return [`Slot_Items`];
    }
    Model() {
        return this.model;
    }
    Slot() {
        return this.Parent();
    }
}
