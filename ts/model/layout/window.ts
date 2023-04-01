import { ID } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Async from "../../async.js";
import * as Entity from "../../entity.js";

import * as Wall from "./wall.js";

export { ID } from "../../types.js";

export type Model_Data = any;

export interface Model_Class
{
    new(
        data: Model_Data,
    ): Model_Instance;
}

export interface Model_Instance extends Async.Instance
{
}

export interface View_Class
{
    new(
        {
            model,
            root,
        }: {
            // Not sure how to avoid using any here. It think
            // because we store the model instance on window,
            // when we pass it to the view class, it gets
            // a model instance instead of the actual type.
            // What we could do is change browser to accept the
            // model_instance and then it can cast it. But if we
            // do that we should move these interfaces out of window
            // so that they remain generic. Possibly we can pass
            // template parameters or whatever they're called in typescript.
            model: () => Model_Instance | any,
            root: View_Instance,
        },
    ): View_Instance;
}

export interface View_Instance extends Entity.Instance
{
}

export enum State
{
    _NONE_ = 0,

    IS_ALIVE = 1 << 0,
    IS_MINIMIZED = 1 << 1,
    IS_MAXIMIZED = 1 << 2,
}

export class Instance extends Async.Instance
{
    private static next_id: ID = 0;

    private static New_ID():
        ID
    {
        Utils.Assert(
            Instance.next_id + 1 < Infinity,
            `Can't make a new id!`,
        );

        return Instance.next_id++;
    }

    private wall: Wall.Instance | null;
    private id: ID;
    private state: State;
    private model_class: Model_Class;
    private view_class: View_Class;
    private model: Model_Instance;

    constructor(
        {
            wall,
            model_class,
            view_class,
            model_data = undefined,
        }: {
            wall: Wall.Instance | null,
            model_class: Model_Class,
            view_class: View_Class,
            model_data?: Model_Data,
        },
    )
    {
        super();

        this.wall = wall;
        this.id = Instance.New_ID();
        this.state = State._NONE_;
        this.model_class = model_class;
        this.view_class = view_class;
        this.model = new model_class(model_data);

        this.Is_Ready_After(
            [
                this.model,
            ],
        );
    }

    Is_In_Wall():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window is in a wall.`,
        );

        return this.wall != null;
    }

    Wall():
        Wall.Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its wall.`,
        );
        Utils.Assert(
            this.Is_In_Wall(),
            `Isn't in a wall.`,
        );

        return this.wall as Wall.Instance;
    }

    Add_To_Wall(
        wall: Wall.Instance,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to be added to a wall.`,
        );
        Utils.Assert(
            !this.Is_In_Wall(),
            `Is already in a wall.`,
        );

        wall.Add(this);
        this.wall = wall;
    }

    Remove_From_Wall():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to be removed from a wall.`,
        );
        Utils.Assert(
            this.Is_In_Wall(),
            `Isn't in a wall.`,
        );

        this.Wall().Remove(this.ID());
        this.wall = null;
    }

    Move_To_Wall(
        wall: Wall.Instance | null,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to be moved to a wall.`,
        );

        if (this.Is_In_Wall()) {
            this.Remove_From_Wall();
        }
        if (wall != null) {
            this.Add_To_Wall(wall);
        }
    }

    ID():
        ID
    {
        return this.id;
    }

    State():
        State
    {
        return this.state;
    }

    Model_Class():
        Model_Class
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its model_class.`,
        );

        return this.model_class;
    }

    View_Class():
        View_Class
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its view_class.`,
        );

        return this.view_class;
    }

    Model():
        Model_Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its model.`,
        );

        return this.model;
    }

    Is_Alive():
        boolean
    {
        return (this.state & State.IS_ALIVE) !== 0;
    }

    private Live():
        void
    {
        Utils.Assert(
            !this.Is_Alive(),
            `Window is already alive.`,
        );

        this.state |= State.IS_ALIVE;

        if (this.wall != null) {
            const wall = this.wall;
            this.wall = null;
            this.Add_To_Wall(wall);
        }
    }

    Kill():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window is already dead.`,
        );

        this.Move_To_Wall(null);
        this.state &= ~State.IS_ALIVE;
    }

    Is_Minimized():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window is minimized.`,
        );

        return (this.state & State.IS_MINIMIZED) !== 0;
    }

    Minimize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot minimize a dead window.`,
        );

        this.state |= State.IS_MINIMIZED;
    }

    Unminimize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot unminimize a dead window.`,
        );

        this.state &= ~State.IS_MINIMIZED;
    }

    Toggle_Minimization():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot toggle minimization of a dead window.`,
        );

        this.state ^= State.IS_MINIMIZED;
    }

    Is_Maximized():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window is maximized.`,
        );

        return (this.state & State.IS_MAXIMIZED) !== 0;
    }

    Maximize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot maximize a dead window.`,
        );

        this.state |= State.IS_MAXIMIZED;
    }

    Unmaximize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot unmaximize a dead window.`,
        );

        this.state &= ~State.IS_MAXIMIZED;
    }

    Toggle_Maximization():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot toggle maximization of a dead window.`,
        );

        this.state ^= State.IS_MAXIMIZED;
    }

    override async Ready():
        Promise<void>
    {
        if (!this.Is_Ready()) {
            await super.Ready();
            this.Live();
        }
    }
}
