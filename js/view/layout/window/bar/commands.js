import * as Utils from "../../../../utils.js";
import * as Entity from "../../../entity.js";
import * as Minimize from "./minimize.js";
import * as Maximize from "./maximize.js";
import * as Close from "./close.js";
export class Instance extends Entity.Instance {
    constructor({ model, bar, }) {
        super({
            element: `div`,
            parent: bar,
            event_grid: bar.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        return [];
    }
    On_Refresh() {
        if (!this.Has_Minimize() ||
            !this.Has_Maximize() ||
            !this.Has_Close()) {
            this.Abort_All_Children();
            new Minimize.Instance({
                model: () => this.Model().Minimize(),
                commands: this,
            });
            new Maximize.Instance({
                model: () => this.Model().Maximize(),
                commands: this,
            });
            new Close.Instance({
                model: () => this.Model().Close(),
                commands: this,
            });
        }
    }
    On_Reclass() {
        return [`Commands`];
    }
    Model() {
        return this.model();
    }
    Bar() {
        return this.Parent();
    }
    Has_Minimize() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Minimize.Instance);
    }
    Minimize() {
        Utils.Assert(this.Has_Minimize(), `Does not have a minimize.`);
        return this.Child(0);
    }
    Has_Maximize() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Maximize.Instance);
    }
    Maximize() {
        Utils.Assert(this.Has_Maximize(), `Does not have a maximize.`);
        return this.Child(1);
    }
    Has_Close() {
        return (this.Has_Child(2) &&
            this.Child(2) instanceof Close.Instance);
    }
    Close() {
        Utils.Assert(this.Has_Close(), `Does not have a close.`);
        return this.Child(2);
    }
}
