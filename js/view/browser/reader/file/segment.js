import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Parts from "./parts.js";
export class Instance extends Entity.Instance {
    constructor({ model, segments, }) {
        super({
            element: `div`,
            parent: segments,
            event_grid: segments.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        if (!this.Has_Parts()) {
            this.Abort_All_Children();
            new Parts.Instance({
                model: () => this.Model().Parts(),
                segment: this,
            });
        }
    }
    On_Restyle() {
        const model = this.Model();
        const is_blank = model.Is_Blank();
        const display = is_blank ?
            `none` :
            `inline-block`;
        const color = is_blank ?
            `transparent` :
            `inherit`;
        return `
            display: ${display};

            color: ${color};
        `;
    }
    Model() {
        return this.model();
    }
    Segments() {
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
