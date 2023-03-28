import { Count } from "./types.js";

import * as Utils from "./utils.js";

// I think we can use a promise chain instead of an array,
// such that each execution calls the next execution.
export class Instance
{
    private slots: Array<() => Promise<void>>;
    private is_executing: boolean;
    private is_paused: boolean;

    constructor()
    {
        this.slots = [];
        this.is_executing = false;
        this.is_paused = false;
    }

    Count():
        Count
    {
        return this.slots.length;
    }

    async Enqueue(
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

    Is_Executing():
        boolean
    {
        return this.is_executing;
    }

    private async Execute():
        Promise<void>
    {
        if (
            this.is_executing === false &&
            this.is_paused === false
        ) {
            this.is_executing = true;

            // the way this while loop is ordered allows
            // cleanly cutting off execution when a
            // pause or flush occurs, because the await
            // is at the end of the loop
            while (
                this.slots.length > 0 &&
                this.is_paused === false
            ) {
                const callback: () => Promise<void> = this.slots[0];
                this.slots = this.slots.slice(1); // inefficient.

                await callback();
            }

            this.is_executing = false;
        }
    }

    Is_Paused():
        boolean
    {
        return (
            this.is_executing === false &&
            this.is_paused === true
        );
    }

    async Pause():
        Promise<void>
    {
        if (this.is_paused === false) {
            this.is_paused = true;

            while (
                this.is_executing === true &&
                this.is_paused === true
            ) {
                await Utils.Wait_Milliseconds(1);
            }
        }
    }

    Unpause():
        void
    {
        if (this.is_paused === true) {
            this.is_paused = false;
            this.Execute();
        }
    }

    Flush():
        void
    {
        this.slots = [];
    }
}
