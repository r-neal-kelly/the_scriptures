import * as Utils from "./utils.js";

export class Instance
{
    private is_ready: boolean;
    private dependents: Array<Instance>;

    constructor()
    {
        this.is_ready = false;
        this.dependents = [];
    }

    Add_Dependent(
        dependent: Instance,
    ):
        void
    {
        Utils.Assert(
            this.dependents.indexOf(dependent) < 0,
            `A dependent can only be added once.`,
        );

        this.dependents.push(dependent);
    }

    Is_Ready():
        boolean
    {
        return this.is_ready;
    }

    async Ready():
        Promise<void>
    {
        if (this.is_ready === false) {
            this.is_ready = true;

            await Promise.all(
                this.dependents.map(
                    function (
                        dependent: Instance,
                    ):
                        Promise<void>
                    {
                        return dependent.Ready();
                    },
                ),
            );
        }
    }
}
