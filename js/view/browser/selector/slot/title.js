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
    On_Restyle() {
        return `
            width: 100%;
                
            overflow-x: hidden;
            overflow-y: hidden;

            background-color: black;
            color: white;

            border-color: white;
            border-style: solid;
            border-width: 0 0 1px 0;

            font-variant: small-caps;

            cursor: default;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        `;
    }
    Model() {
        return this.model;
    }
    Slot() {
        return this.Parent();
    }
}
