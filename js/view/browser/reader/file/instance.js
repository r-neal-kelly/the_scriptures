import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Lines from "./lines.js";
export class Instance extends Entity.Instance {
    constructor({ model, reader, }) {
        super({
            element: `div`,
            parent: reader,
            event_grid: reader.Event_Grid()
        });
        this.model = model;
    }
    On_Refresh() {
        if (!this.Has_Lines()) {
            this.Abort_All_Children();
            new Lines.Instance({
                model: () => this.Model().Lines(),
                file: this,
            });
        }
    }
    On_Restyle() {
        return `
            width: 100%;
            padding: 0 4px;
        `;
    }
    Model() {
        return this.model();
    }
    Has_Lines() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Lines.Instance);
    }
    Lines() {
        Utils.Assert(this.Has_Lines(), `Doesn't have lines.`);
        return this.Child(0);
    }
}
