import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, wall, }) {
        super({
            element: `div`,
            parent: wall,
            event_grid: wall.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        if (!this.Has_View()) {
            this.Abort_All_Children();
            new (this.Model().View_Class())({
                model: () => this.Model().Model(),
                root: this,
            });
        }
    }
    On_Reclass() {
        return [`Window`];
    }
    Model() {
        return this.model();
    }
    Wall() {
        return this.Parent();
    }
    Has_View() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof this.Model().View_Class());
    }
    View() {
        Utils.Assert(this.Has_View(), `Does not have a view.`);
        return this.Child(0);
    }
}
