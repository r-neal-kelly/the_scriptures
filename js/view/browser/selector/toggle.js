import * as Entity from "../../../entity.js";
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
        if (model.Is_Open()) {
            this.Element().textContent = `<<`;
        }
        else {
            this.Element().textContent = `>>`;
        }
    }
    On_Reclass() {
        return [`Toggle`];
    }
    Model() {
        return this.model;
    }
    Selector() {
        return this.Parent();
    }
}
