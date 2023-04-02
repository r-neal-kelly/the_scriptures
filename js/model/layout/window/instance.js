var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";
import { State } from "./state.js";
export class Instance extends Async.Instance {
    static New_ID() {
        Utils.Assert(Instance.next_id + 1 < Infinity, `Can't make a new id!`);
        return Instance.next_id++;
    }
    constructor({ wall, program, }) {
        super();
        this.wall = wall;
        this.id = Instance.New_ID();
        this.state = State._NONE_;
        this.program = program;
        this.Is_Ready_After([
            this.program,
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
    Program() {
        Utils.Assert(this.Is_Alive(), `Window must be alive to get its model.`);
        Utils.Assert(this.Is_Ready(), `Window does not have a ready program, it's probably still loading in.`);
        return this.program;
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
                this.Live();
                // We do this after Live so that the window can
                // get anchored to its wall synchronously.
                yield _super.Ready.call(this);
            }
        });
    }
}
Instance.next_id = 0;
