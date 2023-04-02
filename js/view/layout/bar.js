import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";
import * as Tabs from "./tabs.js";
export class Instance extends Entity.Instance {
    constructor({ model, layout, }) {
        super({
            element: `div`,
            parent: layout,
            event_grid: layout.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Add_This_CSS(`
                .Bar {
                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    border-color: white;
                    border-style: solid;
                    border-width: 1px 0 0 0;
                }
            `);
        this.Add_Children_CSS(`
                .Tabs {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;

                    width: 100%;
                    height: 100%;

                    overflow-x: auto;
                    overflow-y: hidden;
                }

                .Tab {
                    margin: 0 7px 0 0;
                    padding: 2px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 1px;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `);
        return [];
    }
    On_Refresh() {
        if (!this.Has_Tabs()) {
            this.Abort_All_Children();
            new Tabs.Instance({
                model: () => this.Model().Tabs(),
                bar: this,
            });
        }
    }
    On_Reclass() {
        return [`Bar`];
    }
    Model() {
        return this.model();
    }
    Layout() {
        return this.Parent();
    }
    Has_Tabs() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Tabs.Instance);
    }
    Tabs() {
        Utils.Assert(this.Has_Tabs(), `Does not have tabs.`);
        return this.Child(0);
    }
}
