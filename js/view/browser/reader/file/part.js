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
        const is_blank = model.Is_Blank();
        if (is_blank || model.Text().Is_Command()) {
            this.Element().textContent = ``;
        }
        else {
            // Doing this in reader causes the dictionary to think some things are
            // errors, because the dictionary doesn't recognize the non-breaking space.
            // So we're currently doing it here, although we could move it to model I suppose.
            this.Element().textContent = model.Text().Value().replace(/ /g, ` `);
        }
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
