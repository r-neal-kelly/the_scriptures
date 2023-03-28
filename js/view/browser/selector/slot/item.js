var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../../../../entity.js";
import * as Event from "../../../../event.js";
export class Instance extends Entity.Instance {
    constructor({ model, items, }) {
        super({
            element: `div`,
            parent: items,
            event_grid: items.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.ON, "Selector_Slot_Item_Select", this.ID().toString()),
                event_handler: this.On_Selector_Slot_Item_Select.bind(this),
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        this.Element().textContent = this.Model().Title();
    }
    On_Restyle() {
        let color;
        let background_color;
        if (this.Model().Is_Selected()) {
            color = `black`;
            background_color = `white`;
        }
        else {
            color = `white`;
            background_color = `black`;
        }
        return `
            width: 100%;
            padding: 2px 2px;
            
            overflow-x: hidden;
            overflow-y: hidden;

            background-color: ${background_color};
            color: ${color};

            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        `;
    }
    On_Click(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Send(new Event.Info({
                affix: `Selector_Slot_Item_Select`,
                suffixes: [
                    this.ID().toString(),
                ],
                type: Event.Type.EXCLUSIVE,
                data: {},
            }));
        });
    }
    On_Selector_Slot_Item_Select() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Model().Select();
        });
    }
    Model() {
        return this.model;
    }
    Items() {
        return this.Parent();
    }
}
