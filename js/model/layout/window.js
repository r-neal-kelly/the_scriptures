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
    constructor({ wall, model_class, view_class, }) {
        super();
        this.wall = wall;
        this.id = Instance.New_ID();
        this.state = State._NONE_;
        this.model_class = model_class;
        this.view_class = view_class;
        this.model = new model_class();
        this.Is_Ready_After([
            this.model,
        ]);
    }
    Is_In_Wall() {
        Utils.Assert(this.Is_Alive(), `Cannot know if a dead window is in a wall.`);
        return this.wall != null;
    }
    Wall() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to get its wall.`);
        Utils.Assert(this.Is_In_Wall(), `Isn't in a wall.`);
        return this.wall;
    }
    Add_To_Wall(wall) {
        Utils.Assert(this.Is_Alive(), `Window must be alive to be added to a wall.`);
        Utils.Assert(!this.Is_In_Wall(), `Is already in a wall.`);
        wall.Add(this);
        this.wall = wall;
    }
    Remove_From_Wall() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to be removed from a wall.`);
        Utils.Assert(this.Is_In_Wall(), `Isn't in a wall.`);
        this.Wall().Remove(this.ID());
        this.wall = null;
    }
    Move_To_Wall(wall) {
        Utils.Assert(this.Is_Alive(), `Window must be alive to be moved to a wall.`);
        if (this.Is_In_Wall()) {
            this.Remove_From_Wall();
        }
        if (wall != null) {
            this.Add_To_Wall(wall);
        }
    }
    ID() {
        return this.id;
    }
    State() {
        return this.state;
    }
    Model_Class() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to get its model_class.`);
        return this.model_class;
    }
    View_Class() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to get its view_class.`);
        return this.view_class;
    }
    Model() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to get its model.`);
        return this.model;
    }
    Is_Alive() {
        return (this.state & State.IS_ALIVE) !== 0;
    }
    Live() {
        Utils.Assert(!this.Is_Alive(), `Window is already alive.`);
        this.state |= State.IS_ALIVE;
        if (this.wall != null) {
            const wall = this.wall;
            this.wall = null;
            this.Add_To_Wall(wall);
        }
    }
    Kill() {
        Utils.Assert(this.Is_Alive(), `Window is already dead.`);
        this.Move_To_Wall(null);
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
