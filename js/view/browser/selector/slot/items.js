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
