import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Parts from "./parts.js";
export class Instance extends Entity.Instance {
    constructor({ model, lines, }) {
        super({
            element: `div`,
            parent: lines,
            event_grid: lines.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        if (!this.Has_Parts()) {
            this.Abort_All_Children();
            new Parts.Instance({
                model: () => this.Model().Parts(),
                line: this,
            });
        }
    }
    On_Restyle() {
        const model = this.Model();
        const display = model.Text().Is_Centered() ?
            `flex` :
            `block`;
        const color = model.Text().Value() === `` ?
            `transparent` :
            `inherit`;
        return `
            display: ${display};
            flex-wrap: wrap;
            justify-content: center;

            color: ${color};
        `;
    }
    Model() {
        return this.model();
    }
    Lines() {
        return this.Parent();
    }
    Has_Parts() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Parts.Instance);
    }
    Parts() {
        Utils.Assert(this.Has_Parts(), `Doesn't have parts.`);
        return this.Child(0);
    }
}
