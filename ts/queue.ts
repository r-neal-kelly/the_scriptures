import { Count } from "./types.js";

export class Instance
{
    private slots: Array<any>;
    private is_executing: boolean;

    constructor()
    {
        this.slots = [];
        this.is_executing = false;
    }

    Count():
        Count
    {
        return this.slots.length;
    }

    Is_Executing():
        boolean
    {
        return this.is_executing;
    }

    private async Execute():
        Promise<void>
    {
        if (this.Is_Executing() === false) {
            this.is_executing = true;

            while (this.slots.length > 0) {
                await this.slots[0]();
                this.slots = this.slots.slice(1); // inefficient
            }

            this.is_executing = false;
        }
    }

    Enqueue(
        callback: () => void | Promise<void>,
    ):
        Promise<void>
    {
        return new Promise(
            function (
                this: Instance,
                resolve: () => void,
            ):
                void
            {
                this.slots.push(
                    async function ():
                        Promise<void>
                    {
                        await callback();
                        resolve();
                    },
                );

                this.Execute();
            }.bind(this),
        );
    }
}
