var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Event from "../../../event.js";
import * as Entity from "../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, selector, }) {
        super({
            element: `div`,
            parent: selector,
            event_grid: selector.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.ON, `Selector_Toggle`, `${this.ID()}`),
                event_handler: this.On_Selector_Toggle,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        const model = this.Model();
        if (model.Is_Open()) {
            this.Element().textContent = `<<`;
        }
        else {
            this.Element().textContent = `>>`;
        }
    }
    On_Reclass() {
        return [`Toggle`];
    }
    On_Click(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Send(new Event.Info({
                affix: `Selector_Toggle`,
                suffixes: [
                    `${this.Selector().Browser().ID()}`,
                    `${this.ID()}`,
                ],
                type: Event.Type.EXCLUSIVE,
                data: {},
            }));
        });
    }
    On_Selector_Toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Model().Toggle();
        });
    }
    Model() {
        return this.model;
    }
    Selector() {
        return this.Parent();
    }
}
