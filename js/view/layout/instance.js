import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";
import * as Wall from "./wall.js";
import * as Bar from "./bar.js";
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
                .Layout {
                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    color: white;
                }
            `);
        this.Add_Children_CSS(`
                .Wall {

                }

                .Window {

                }

                .Bar {

                }

                .Tabs {

                }

                .Tab {

                }
            `);
        return [];
    }
    On_Refresh() {
        if (!this.Has_Wall() ||
            !this.Has_Bar()) {
            this.Abort_All_Children();
            new Wall.Instance({
                model: () => this.Model().Wall(),
                layout: this,
            });
            new Bar.Instance({
                model: () => this.Model().Bar(),
                layout: this,
            });
        }
    }
    On_Reclass() {
        return [`Layout`];
    }
    Model() {
        return this.model();
    }
    Root() {
        return this.Parent();
    }
    Has_Wall() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Wall.Instance);
    }
    Wall() {
        Utils.Assert(this.Has_Wall(), `Does not have a wall.`);
        return this.Child(0);
    }
    Has_Bar() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Bar.Instance);
    }
    Bar() {
        Utils.Assert(this.Has_Bar(), `Does not have a bar.`);
        return this.Child(1);
    }
}
