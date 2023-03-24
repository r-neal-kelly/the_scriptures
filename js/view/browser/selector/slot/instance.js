var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
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
