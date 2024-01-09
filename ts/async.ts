import * as Utils from "./utils.js";

enum Status
{
    _NONE_ = 0,

    READY = 1 << 0,
    READYING = 1 << 1,
}

export class Instance
{
    private status: Status;
    private dependencies: Array<Instance> | null;

    constructor()
    {
        this.status = Status._NONE_;
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
            !this.Is_Readying(),
            `Cannot add dependencies while readying.`,
        );

        for (const dependency of dependencies) {
            Utils.Assert(
                this.Dependencies().indexOf(dependency) < 0,
                `A dependency can only be added once.`,
            );

            this.Dependencies().push(dependency);
        }
    }

    Is_Ready():
        boolean
    {
        return (this.status & Status.READY) > 0;
    }

    private Toggle_Ready():
        void
    {
        this.status ^= Status.READY;
    }

    private Is_Readying():
        boolean
    {
        return (this.status & Status.READYING) > 0;
    }

    private Toggle_Readying():
        void
    {
        this.status ^= Status.READYING;
    }

    private Dependencies():
        Array<Instance>
    {
        Utils.Assert(
            this.dependencies != null,
            `Dependencies should not be null at this point!`,
        );

        return (this.dependencies as Array<Instance>);
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
        if (this.Is_Readying()) {
            while (this.Is_Readying()) {
                // We wait until the first context that started
                // readying is finished so that the caller knows
                // this async is actually ready on return.
                await Utils.Wait_Milliseconds(1);
            }
        } else if (!this.Is_Ready()) {
            this.Toggle_Readying();

            if (
                Object.getPrototypeOf(this).Before_Dependencies_Are_Ready !==
                Instance.prototype.Before_Dependencies_Are_Ready
            ) {
                await this.Before_Dependencies_Are_Ready();
            }

            if (this.Dependencies().length > 0) {
                await Promise.all(
                    this.Dependencies().map(
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
            this.dependencies = null;

            if (
                Object.getPrototypeOf(this).After_Dependencies_Are_Ready !==
                Instance.prototype.After_Dependencies_Are_Ready
            ) {
                await this.After_Dependencies_Are_Ready();
            }

            this.Toggle_Ready();
            this.Toggle_Readying();
        }
    }
}
