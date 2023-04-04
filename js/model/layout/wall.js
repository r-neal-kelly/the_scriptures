var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../utils.js";
import * as Entity from "../entity.js";
import * as Window from "./window.js";
export class Instance extends Entity.Instance {
    constructor({ layout, }) {
        super();
        this.layout = layout;
        this.windows = new Map();
        this.Is_Ready_After([]);
    }
    Layout() {
        return this.layout;
    }
    Count() {
        return this.windows.size;
    }
    Has(window) {
        return this.Has_ID(window.ID());
    }
    Has_ID(window_id) {
        return this.windows.has(window_id);
    }
    From_ID(window_id) {
        Utils.Assert(this.Has_ID(window_id), `Does not have window with id ${window_id}.`);
        return this.windows.get(window_id);
    }
    Has_At(index) {
        return this.Layout().Bar().Tabs().Has_At(index);
    }
    At(index) {
        Utils.Assert(this.Has_At(index), `Has no window at index ${index}.`);
        return this.Layout().Bar().Tabs().At(index).Window();
    }
    Iterator() {
        return this.windows.values();
    }
    Array() {
        return Array.from(this.Iterator());
    }
    Add(window) {
        const window_id = window.ID();
        Utils.Assert(!this.Has_ID(window_id), `Already has a window with id of ${window_id}.`);
        Utils.Assert(window.Is_Alive(), `A window must be alive to be added.`);
        Utils.Assert(!window.Is_In_Wall(), `Window is already in a wall.`);
        this.windows.set(window_id, window);
        this.Layout().Bar().Tabs().Add_Window(window);
    }
    Remove(window_id) {
        Utils.Assert(this.Has_ID(window_id), `Doesn't have window with id of ${window_id}.`);
        Utils.Assert(this.From_ID(window_id).Is_Alive(), `A window must be alive to be removed.`);
        Utils.Assert(this.From_ID(window_id).Wall() === this, `Window wall mismatch!`);
        this.Layout().Bar().Tabs().Remove_Window(this.From_ID(window_id));
        this.windows.delete(window_id);
    }
    Add_Program(program) {
        return __awaiter(this, void 0, void 0, function* () {
            const window = new Window.Instance({
                wall: this,
                program: program,
            });
            yield window.Ready();
            return window.ID();
        });
    }
}
