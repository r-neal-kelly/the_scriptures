import * as Utils from "./utils.js";

export class Instance
{
    private is_ready: boolean;
    private dependencies: Array<Instance>;

    constructor()
    {
        this.is_ready = false;
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
        if (this.is_ready === false) {
            // Might as well set this first, just in case this is somehow called again.
            this.is_ready = true;

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
    }
}
