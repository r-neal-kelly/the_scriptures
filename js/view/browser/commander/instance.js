import * as Utils from "../../../utils.js";
import * as Entity from "../../entity.js";
import * as Previous from "./previous.js";
import * as Selector from "./selector.js";
import * as Next from "./next.js";
export class Instance extends Entity.Instance {
    constructor({ model, browser, }) {
        super({
            element: `div`,
            parent: browser,
            event_grid: browser.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Add_This_CSS(`
                .Commander {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    justify-items: center;
                    align-content: space-around;
                    align-items: center;

                    padding: 4px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 1px 0 0;

                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `);
        this.Add_Children_CSS(`
                .Commander_Previous {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }

                .Commander_Selector {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }

                .Commander_Next {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }
            `);
        return [];
    }
    On_Refresh() {
        if (!this.Has_Previous() ||
            !this.Has_Selector() ||
            !this.Has_Next()) {
            this.Abort_All_Children();
            new Previous.Instance({
                model: () => this.Model().Previous(),
                commander: this,
            });
            new Selector.Instance({
                model: () => this.Model().Selector(),
                commander: this,
            });
            new Next.Instance({
                model: () => this.Model().Next(),
                commander: this,
            });
        }
    }
    On_Reclass() {
        return [`Commander`];
    }
    Model() {
        return this.model();
    }
    Browser() {
        return this.Parent();
    }
    Has_Previous() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Previous.Instance);
    }
    Previous() {
        Utils.Assert(this.Has_Previous(), `Doesn't have previous.`);
        return this.Child(0);
    }
    Has_Selector() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Selector.Instance);
    }
    Selector() {
        Utils.Assert(this.Has_Selector(), `Doesn't have selector.`);
        return this.Child(1);
    }
    Has_Next() {
        return (this.Has_Child(2) &&
            this.Child(2) instanceof Next.Instance);
    }
    Next() {
        Utils.Assert(this.Has_Next(), `Doesn't have next.`);
        return this.Child(2);
    }
}
