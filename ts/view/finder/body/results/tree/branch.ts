import * as Utils from "../../../../../utils.js";
import * as Event from "../../../../../event.js";

import * as Model from "../../../../../model/finder/body/results/tree/branch.js";

import * as Entity from "../../../../entity.js";
import * as Tree from "./instance.js";
import * as Branch_Name from "./branch_name.js";
import * as Branches from "./branches.js";
import * as Leaves from "./leaves.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            parent,
            model,
        }: {
            parent: Tree.Instance | Branches.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: parent,
                event_grid: parent.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Has_Branches()) {
            if (
                !this.Has_Branch_Name() ||
                !this.Has_Branches()
            ) {
                this.Abort_All_Children();

                new Branch_Name.Instance(
                    {
                        branch: this,
                        model: () => this.Model(),
                    },
                );
                new Branches.Instance(
                    {
                        branch: this,
                        model: () => this.Model(),
                    },
                );
            }
        } else {
            if (
                !this.Has_Branch_Name() ||
                !this.Has_Leaves()
            ) {
                this.Abort_All_Children();

                new Branch_Name.Instance(
                    {
                        branch: this,
                        model: () => this.Model(),
                    },
                );
                new Leaves.Instance(
                    {
                        branch: this,
                        model: () => this.Model(),
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Branch`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Tree():
        Tree.Instance
    {
        let parent: Entity.Instance = this.Parent();
        while (!(parent instanceof Tree.Instance)) {
            parent = parent.Parent();
        }

        return parent as Tree.Instance;
    }

    Has_Branch_Name():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Branch_Name.Instance
        );
    }

    Branch_Name():
        Branch_Name.Instance
    {
        Utils.Assert(
            this.Has_Branch_Name(),
            `Does not have Branch_Name.`,
        );

        return this.Child(0) as Branch_Name.Instance;
    }

    Has_Branches():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Branches.Instance
        );
    }

    Branches():
        Branches.Instance
    {
        Utils.Assert(
            this.Has_Branches(),
            `Does not have Branches.`,
        );

        return this.Child(1) as Branches.Instance;
    }

    Has_Leaves():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Leaves.Instance
        );
    }

    Leaves():
        Leaves.Instance
    {
        Utils.Assert(
            this.Has_Leaves(),
            `Does not have Leaves.`,
        );

        return this.Child(1) as Leaves.Instance;
    }
}
