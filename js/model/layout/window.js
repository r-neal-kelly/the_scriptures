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
import * as Async from "../../async.js";
export var State;
(function (State) {
    State[State["_NONE_"] = 0] = "_NONE_";
    State[State["IS_ALIVE"] = 1] = "IS_ALIVE";
    State[State["IS_MINIMIZED"] = 2] = "IS_MINIMIZED";
    State[State["IS_MAXIMIZED"] = 4] = "IS_MAXIMIZED";
})(State || (State = {}));
export class Instance extends Async.Instance {
    static New_ID() {
        Utils.Assert(Instance.next_id + 1 < Infinity, `Can't make a new id!`);
        return Instance.next_id++;
    }
    constructor({ layout, program, }) {
        super();
        this.layout = layout;
        this.id = Instance.New_ID();
        this.state = State._NONE_;
        this.program = program;
        this.Is_Ready_After([
            program,
        ]);
    }
    Has_Layout() {
        Utils.Assert(this.Is_Alive(), `Cannot know if a dead window has a layout.`);
        return this.layout != null;
    }
    Layout() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to get a layout.`);
        Utils.Assert(this.Has_Layout(), `Doesn't have a layout.`);
        return this.layout;
    }
    Add_Layout(layout) {
        Utils.Assert(this.Is_Alive(), `Window must be alive to add a layout.`);
        Utils.Assert(!this.Has_Layout(), `Already has a layout.`);
        layout.Add_Window(this);
        this.layout = layout;
    }
    Remove_Layout() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to remove a layout.`);
        Utils.Assert(this.Has_Layout(), `Doesn't have a layout to remove.`);
        this.Layout().Remove_Window(this.ID());
        this.layout = null;
    }
    Change_Layout(layout) {
        Utils.Assert(this.Is_Alive(), `Window must be alive to change layout.`);
        if (this.Has_Layout()) {
            this.Remove_Layout();
        }
        if (layout != null) {
            this.Add_Layout(layout);
        }
    }
    ID() {
        return this.id;
    }
    State() {
        return this.state;
    }
    Program() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to get its program.`);
        return this.program;
    }
    Is_Alive() {
        return (this.state & State.IS_ALIVE) !== 0;
    }
    Live() {
        Utils.Assert(!this.Is_Alive(), `Window is already alive.`);
        this.state |= State.IS_ALIVE;
        if (this.layout != null) {
            const layout = this.layout;
            this.layout = null;
            this.Add_Layout(layout);
        }
    }
    Kill() {
        Utils.Assert(this.Is_Alive(), `Window is already dead.`);
        this.Change_Layout(null);
        this.state &= ~State.IS_ALIVE;
    }
    Is_Minimized() {
        Utils.Assert(this.Is_Alive(), `Cannot know if a dead window is minimized.`);
        return (this.state & State.IS_MINIMIZED) !== 0;
    }
    Minimize() {
        Utils.Assert(this.Is_Alive(), `Cannot minimize a dead window.`);
        this.state |= State.IS_MINIMIZED;
    }
    Unminimize() {
        Utils.Assert(this.Is_Alive(), `Cannot unminimize a dead window.`);
        this.state &= ~State.IS_MINIMIZED;
    }
    Toggle_Minimization() {
        Utils.Assert(this.Is_Alive(), `Cannot toggle minimization of a dead window.`);
        this.state ^= State.IS_MINIMIZED;
    }
    Is_Maximized() {
        Utils.Assert(this.Is_Alive(), `Cannot know if a dead window is maximized.`);
        return (this.state & State.IS_MAXIMIZED) !== 0;
    }
    Maximize() {
        Utils.Assert(this.Is_Alive(), `Cannot maximize a dead window.`);
        this.state |= State.IS_MAXIMIZED;
    }
    Unmaximize() {
        Utils.Assert(this.Is_Alive(), `Cannot unmaximize a dead window.`);
        this.state &= ~State.IS_MAXIMIZED;
    }
    Toggle_Maximization() {
        Utils.Assert(this.Is_Alive(), `Cannot toggle maximization of a dead window.`);
        this.state ^= State.IS_MAXIMIZED;
    }
    Ready() {
        const _super = Object.create(null, {
            Ready: { get: () => super.Ready }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.Is_Ready()) {
                yield _super.Ready.call(this);
                this.Live();
            }
        });
    }
}
Instance.next_id = 0;
