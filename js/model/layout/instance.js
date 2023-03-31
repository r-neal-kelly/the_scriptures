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
import * as Taskbar from "./taskbar.js";
import * as Window from "./window.js";
export class Instance {
    constructor() {
        this.windows = new Map();
        this.taskbar = new Taskbar.Instance();
    }
    Has_Window(window_id) {
        return this.windows.has(window_id);
    }
    Window(window_id) {
        Utils.Assert(this.Has_Window(window_id), `Does not have window with the id ${window_id}.`);
        return this.windows.get(window_id);
    }
    Add_Window(window) {
        const window_id = window.ID();
        Utils.Assert(!this.Has_Window(window_id), `Already has a window with id of ${window_id}.`);
        Utils.Assert(window.Is_Alive(), `A window must be alive to be added.`);
        Utils.Assert(!window.Has_Layout(), `Window already has a layout.`);
        this.windows.set(window_id, window);
        this.taskbar.Add_Window_ID(window_id);
        return window_id;
    }
    Remove_Window(window_id) {
        Utils.Assert(this.Has_Window(window_id), `Doesn't have window with id of ${window_id}.`);
        Utils.Assert(this.Window(window_id).Is_Alive(), `A window must be alive to be removed.`);
        Utils.Assert(this.Window(window_id).Layout() === this, `Window layout mismatch!`);
        this.taskbar.Remove_Window_ID(window_id);
        this.windows.delete(window_id);
    }
    Taskbar() {
        return this.taskbar;
    }
    Add_Program(program) {
        return __awaiter(this, void 0, void 0, function* () {
            const window = new Window.Instance({
                layout: this,
                program: program,
            });
            yield window.Ready();
            return window.ID();
        });
    }
}
