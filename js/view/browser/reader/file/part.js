import * as Entity from "../../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, segment, }) {
        super({
            element: `span`,
            parent: segment,
            event_grid: segment.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        this.Element().textContent = model.Value();
    }
    On_Reclass() {
        const model = this.Model();
        const classes = [];
        classes.push(`Part`);
        if (model.Is_Blank()) {
            classes.push(`Blank_Part`);
        }
        else {
            if (model.Is_Indented()) {
                classes.push(`Indented_Part`);
            }
            if (model.Text().Has_Italic_Style()) {
                classes.push(`Italic_Part`);
            }
            if (model.Text().Has_Bold_Style()) {
                classes.push(`Bold_Part`);
            }
            if (model.Text().Has_Underline_Style()) {
                classes.push(`Underline_Part`);
            }
            if (model.Text().Has_Small_Caps_Style()) {
                classes.push(`Small_Caps_Part`);
            }
            if (model.Text().Is_Error() ||
                model.Text().Has_Error_Style()) {
                classes.push(`Error_Part`);
            }
        }
        return classes;
    }
    Model() {
        return this.model();
    }
    Segment() {
        return this.Parent();
    }
}
