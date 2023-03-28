import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Title from "./title.js";
import * as Items from "./items.js";
export class Instance extends Entity.Instance {
    constructor({ model, selector, }) {
        super({
            element: `div`,
            parent: selector,
            event_grid: selector.Event_Grid(),
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
    On_Restyle() {
        return `
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: 1fr;
            align-content: start;

            width: 100%;
            height: 100%;
            padding: 0 3px;

            border-color: white;
            border-style: solid;
            border-width: 0 1px 0 0;

            overflow-x: hidden;
            overflow-y: hidden;
        `;
    }
    Model() {
        return this.model;
    }
    Selector() {
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
