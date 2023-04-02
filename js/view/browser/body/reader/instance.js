import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as File from "./file.js";
export class Instance extends Entity.Instance {
    constructor({ model, body, }) {
        super({
            element: `div`,
            parent: body,
            event_grid: body.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        if (!this.Has_File()) {
            this.Abort_All_Children();
            new File.Instance({
                model: () => this.Model().File(),
                reader: this,
            });
        }
        this.Element().scrollTo(0, 0);
    }
    On_Reclass() {
        return [`Reader`];
    }
    Model() {
        return this.model;
    }
    Body() {
        return this.Parent();
    }
    Has_File() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof File.Instance);
    }
    File() {
        Utils.Assert(this.Has_File(), `Doesn't have file.`);
        return this.Child(0);
    }
}
