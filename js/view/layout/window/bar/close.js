var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Event from "../../../../event.js";
import * as Entity from "../../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, commands, }) {
        super({
            element: `div`,
            parent: commands,
            event_grid: commands.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.ON, `Window_Close`, `${this.ID()}`),
                event_handler: this.On_Window_Close,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        const model = this.Model();
        this.Element().textContent = model.Symbol();
    }
    On_Reclass() {
        return [`Button`];
    }
    On_Click(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Send(new Event.Info({
                affix: `Window_Close`,
                suffixes: [
                    `${this.Commands().Bar().Window().Wall().Layout().ID()}`,
                    `${this.ID()}`,
                ],
                type: Event.Type.EXCLUSIVE,
                data: {},
            }));
        });
    }
    On_Window_Close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Model().Click();
        });
    }
    Model() {
        return this.model();
    }
    Commands() {
        return this.Parent();
    }
}
