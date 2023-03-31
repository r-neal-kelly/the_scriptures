import * as Entity from "../../../../entity.js";
import * as Sub_Item from "./sub_item.js";
export class Instance extends Entity.Instance {
    constructor({ model, line, }) {
        super({
            element: `div`,
            parent: line,
            event_grid: line.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        const element = this.Element();
        const target = model.Sub_Item_Count();
        const count = this.Child_Count();
        const delta = target - count;
        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;
                this.Abort_Child(this.Child(idx));
            }
            if (target === 0) {
                element.textContent = model.Value();
            }
        }
        else if (delta > 0) {
            if (count === 0) {
                element.textContent = ``;
            }
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Sub_Item.Instance({
                    model: () => this.Model().Sub_Item_At(idx),
                    item: this,
                });
            }
        }
        else {
            if (target === 0) {
                element.textContent = model.Value();
            }
        }
    }
    On_Reclass() {
        const model = this.Model();
        const classes = [];
        if (model.Has_Part()) {
            classes.push(`Part`);
            if (model.Is_Blank()) {
                classes.push(`Blank`);
            }
            else {
                if (model.Is_Indented()) {
                    classes.push(`Indented_Part`);
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
        }
        else {
            classes.push(`Segment`);
            if (model.Is_Blank()) {
                classes.push(`Blank`);
            }
        }
        return classes;
    }
    Model() {
        return this.model();
    }
    Line() {
        return this.Parent();
    }
}
