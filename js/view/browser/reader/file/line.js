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
    On_Reclass() {
        const model = this.Model();
        const classes = [];
        classes.push(`Line`);
        if (model.Is_Blank()) {
            classes.push(`Blank_Line`);
        }
        else if (model.Text().Value() === ``) {
            classes.push(`New_Line`);
        }
        else if (model.Text().Is_Centered()) {
            classes.push(`Centered_Line`);
        }
        return classes;
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
