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
        this.selector = null;
        this.reader = null;
    }
    On_Refresh() {
        this.Abort_All_Children();
        this.selector = new Selector.Instance({
            model: this.Model().Selector(),
            browser: this,
        });
        this.reader = new Reader.Instance({
            model: this.Model().Reader(),
            browser: this,
        });
    }
    On_Restyle() {
        return `
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: auto auto;
            justify-content: start;
        
            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;

            color: white;
        `;
    }
    Model() {
        return this.model;
    }
    Root() {
        return this.Parent();
    }
    Selector() {
        Utils.Assert(this.selector != null, `Does not have selector.`);
        return this.selector;
    }
    Reader() {
        Utils.Assert(this.reader != null, `Does not have reader.`);
        return this.reader;
    }
}
