import * as Utils from "./utils.js";

export class Instance
{
    private is_ready: boolean;
    private is_readying: boolean;
    private dependencies: Array<Instance>;

    constructor()
    {
        this.is_ready = false;
        this.is_readying = false;
        this.dependencies = [];
    }

    Add_Dependencies(
        dependencies: Array<Instance>,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Ready(),
            `Cannot add dependencies after being ready.`,
        );
        Utils.Assert(
            !this.is_readying,
            `Cannot add dependencies while readying.`,
        );

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

    async Before_Dependencies_Are_Ready():
        Promise<void>
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );
    }

    async After_Dependencies_Are_Ready():
        Promise<void>
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );
    }

    async Ready():
        Promise<void>
    {
        while (this.is_readying) {
            await Utils.Wait_Milliseconds(1);
        }
        this.is_readying = true;

        if (this.is_ready === false) {
            if (Object.getPrototypeOf(this).hasOwnProperty(`Before_Dependencies_Are_Ready`)) {
                await this.Before_Dependencies_Are_Ready();
            }

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

            if (Object.getPrototypeOf(this).hasOwnProperty(`After_Dependencies_Are_Ready`)) {
                await this.After_Dependencies_Are_Ready();
            }

            this.is_ready = true;
        }

        this.is_readying = false;
    }
}
