import * as Entity from "../../../entity.js";
import * as Slot from "./slot.js";
export class Instance extends Entity.Instance {
    constructor({ model, selector, }) {
        super({
            element: `div`,
            parent: selector,
            event_grid: selector.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        const target = model.Slot_Count();
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
                new Slot.Instance({
                    model: model.Slot(idx),
                    slots: this,
                });
            }
        }
    }
    On_Reclass() {
        return [`Slots`];
    }
    Model() {
        return this.model;
    }
    Selector() {
        return this.Parent();
    }
}
