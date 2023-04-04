import * as Entity from "../../../../entity.js";
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
        this.Element().textContent = model.Value();
    }
    On_Reclass() {
        return [`Slot_Title`];
    }
    Model() {
        return this.model();
    }
    Slot() {
        return this.Parent();
    }
}
