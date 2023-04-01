import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";
import * as Selector from "./selector.js";
import * as Reader from "./reader.js";
export class Instance extends Entity.Instance {
    constructor({ model, root, }) {
        super({
            element: `div`,
            parent: root,
            event_grid: root.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Add_This_CSS(`
                .Browser {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: auto auto;
                    justify-content: start;
                
                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    color: white;
                }
            `);
        return [];
    }
    On_Refresh() {
        if (!this.Has_Selector() ||
            !this.Has_Reader()) {
            this.Abort_All_Children();
            new Selector.Instance({
                model: this.Model().Selector(),
                browser: this,
            });
            new Reader.Instance({
                model: this.Model().Reader(),
                browser: this,
            });
        }
    }
    On_Reclass() {
        return [`Browser`];
    }
    Model() {
        return this.model();
    }
    Root() {
        return this.Parent();
    }
    Has_Selector() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Selector.Instance);
    }
    Selector() {
        Utils.Assert(this.Has_Selector(), `Does not have a selector.`);
        return this.Child(0);
    }
    Has_Reader() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Reader.Instance);
    }
    Reader() {
        Utils.Assert(this.Has_Reader(), `Does not have a reader.`);
        return this.Child(0);
    }
}
