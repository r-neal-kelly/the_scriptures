import * as Utils from "./utils.js";

export class Instance
{
    private is_ready: boolean;
    protected is_readying: boolean;
    private dependencies: Array<Instance>;

    constructor()
    {
        this.is_ready = false;
        this.is_readying = false;
        this.dependencies = [];
    }

    Is_Ready_After(
        dependencies: Array<Instance>,
    ):
        void
    {
        for (const dependency of dependencies) {
            Utils.Assert(
                this.dependencies.indexOf(dependency) < 0,
                `A dependency can only be added once.`,
            );

            this.dependencies.push(dependency);
        }
    }

    Is_Ready():
        boolean
    {
        return this.is_ready;
    }

    async Ready():
        Promise<void>
    {
        while (this.is_readying) {
            await Utils.Wait_Milliseconds(1);
        }
        this.is_readying = true;

        if (this.is_ready === false) {
            if (this.dependencies.length > 0) {
                await Promise.all(
                    this.dependencies.map(
                        function (
                            dependency: Instance,
                        ):
                            Promise<void>
                        {
                            return dependency.Ready();
                        },
                    ),
                );
            }

            this.is_ready = true;
        }

        this.is_readying = false;
    }
}
