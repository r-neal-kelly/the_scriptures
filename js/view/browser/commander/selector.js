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
import * as Entity from "../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, commander, }) {
        super({
            element: `div`,
            parent: commander,
            event_grid: commander.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.ON, `Selector_Toggle`, this.ID()),
                event_handler: this.On,
                event_priority: 0,
            }),
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Toggle`, this.ID()),
                event_handler: this.After,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        this.Element().textContent = this.Model().Symbol();
    }
    On_Reclass() {
        return [`Commander_Selector`];
    }
    On_Click(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Send(new Event.Info({
                affix: `Selector_Toggle`,
                suffixes: [
                    this.ID(),
                    this.Commander().ID(),
                    this.Commander().Browser().ID(),
                    this.Commander().Browser().Root().ID(),
                ],
                type: Event.Type.EXCLUSIVE,
                data: {},
            }));
        });
    }
    On() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Model().Toggle();
        });
    }
    After() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Refresh();
        });
    }
    Model() {
        return this.model();
    }
    Commander() {
        return this.Parent();
    }
}
