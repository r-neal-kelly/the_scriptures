import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Title from "./title.js";
import * as Items from "./items.js";
export class Instance extends Entity.Instance {
    constructor({ model, slots, }) {
        super({
            element: `div`,
            parent: slots,
            event_grid: slots.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        if (!this.Has_Title() ||
            !this.Has_Items()) {
            this.Abort_All_Children();
            new Title.Instance({
                model: model.Title(),
                slot: this,
            });
            new Items.Instance({
                model: model.Items(),
                slot: this,
            });
        }
    }
    On_Reclass() {
        return [`Slot`];
    }
    Model() {
        return this.model;
    }
    Slots() {
        return this.Parent();
    }
    Has_Title() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Title.Instance);
    }
    Title() {
        Utils.Assert(this.Has_Title(), `Does not have title.`);
        return this.Child(0);
    }
    Has_Items() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Items.Instance);
    }
    Items() {
        Utils.Assert(this.Has_Items(), `Does not have items.`);
        return this.Child(1);
    }
}
