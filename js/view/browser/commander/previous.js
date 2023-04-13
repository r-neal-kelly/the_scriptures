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
import * as Events from "../../events.js";
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
                event_name: new Event.Name(Event.Prefix.ON, Events.BROWSER_COMMANDER_PREVIOUS, this.ID()),
                event_handler: this.On,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        this.Element().textContent = this.Model().Symbol();
    }
    On_Reclass() {
        return [`Commander_Previous`];
    }
    On_Click(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Model().Can_Activate()) {
                yield this.Send(new Event.Info({
                    affix: Events.BROWSER_COMMANDER_PREVIOUS,
                    suffixes: [
                        this.ID(),
                        this.Commander().ID(),
                        this.Commander().Browser().ID(),
                        this.Commander().Browser().Root().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                }));
            }
        });
    }
    On() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Model().Activate();
        });
    }
    Model() {
        return this.model();
    }
    Commander() {
        return this.Parent();
    }
}
