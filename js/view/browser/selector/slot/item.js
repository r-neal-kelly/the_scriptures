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
    constructor({ model, slot, }) {
        super({
            element: `div`,
            parent: slot,
            event_grid: slot.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Element().addEventListener(`click`, this.On_Click.bind(this));
            return [
                new Event.Listener_Info({
                    event_name: new Event.Name(Event.Prefix.ON, "Selector_Slot_Item_Select", this.ID().toString()),
                    event_handler: this.On_Select.bind(this),
                    event_priority: 0,
                }),
            ];
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Abort_All_Children();
            this.Element().textContent = this.Model().Name();
        });
    }
    On_Click(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.Send(new Event.Info({
                affix: `Selector_Slot_Item_Select`,
                suffixes: [
                    this.ID().toString(),
                ],
                type: Event.Type.EXCLUSIVE,
                data: {
                    item: this,
                },
            }));
        });
    }
    On_Select({ item, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model();
            yield model.Select();
            // Might make this a function on item model. Essentially,
            // the less model types any view entity knows about the better.
            if (model.Slot().Selector().Browser().Reader().Has_File()) {
                this.Send(new Event.Info({
                    affix: `Reader_Has_File`,
                    suffixes: [],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                }));
            }
        });
    }
    Model() {
        return this.model;
    }
    Slot() {
        return this.Parent();
    }
}
