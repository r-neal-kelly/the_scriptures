import * as Entity from "../../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, segment, }) {
        super({
            element: `div`,
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
        classes.push(`Item`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        }
        else {
            if (model.Is_Indented()) {
                classes.push(`Indented_Item`);
            }
            if (model.Has_Italic_Style()) {
                classes.push(`Italic`);
            }
            if (model.Has_Bold_Style()) {
                classes.push(`Bold`);
            }
            if (model.Has_Underline_Style()) {
                classes.push(`Underline`);
            }
            if (model.Has_Small_Caps_Style()) {
                classes.push(`Small_Caps`);
            }
            if (model.Is_Error() ||
                model.Has_Error_Style()) {
                classes.push(`Error`);
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
