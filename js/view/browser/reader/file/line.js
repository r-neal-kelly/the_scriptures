import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Segments from "./segments.js";
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
        if (!this.Has_Segments()) {
            this.Abort_All_Children();
            new Segments.Instance({
                model: () => this.Model().Segments(),
                line: this,
            });
        }
    }
    On_Restyle() {
        const model = this.Model();
        const is_blank = model.Is_Blank();
        const display = is_blank ?
            `none` :
            model.Text().Is_Centered() ?
                `flex` :
                `block`;
        const color = is_blank || model.Text().Value() === `` ?
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
    Has_Segments() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Segments.Instance);
    }
    Segments() {
        Utils.Assert(this.Has_Segments(), `Doesn't have segments.`);
        return this.Child(0);
    }
}
