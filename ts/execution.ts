import { Count } from "./types.js";

import * as Utils from "./utils.js";
import * as Queue from "./queue.js";

export enum Type
{
    /* Immediately executes, even if queued executors are executing. */
    IMMEDIATE,

    /* Waits to execute until previous executors in the queue finish. */
    QUEUED,

    /*
        Waits to execute when no other executors are executing,
        makes subsequent immediate and queued executors wait,
        and discards other exclusive executors while its executing.
    */
    EXCLUSIVE,
}

export class Frame
{
    private immediate_count: Count;
    private queued: Queue.Instance;
    private has_exclusive: boolean;

    constructor()
    {
        this.immediate_count = 0;
        this.queued = new Queue.Instance();
        this.has_exclusive = false;
    }

    async Execute(
        type: Type,
        executor: () => void | Promise<void>,
    ):
        Promise<void>
    {
        if (type === Type.IMMEDIATE) {
            while (this.has_exclusive === true) {
                await Utils.Wait_Milliseconds(1);
            }

            this.immediate_count += 1;
            await executor();
            this.immediate_count -= 1;
        } else if (type === Type.QUEUED) {
            while (this.has_exclusive === true) {
                await Utils.Wait_Milliseconds(1);
            }

            await this.queued.Enqueue(executor);
        } else if (type === Type.EXCLUSIVE) {
            if (this.has_exclusive === false) {
                this.has_exclusive = true;

                await Promise.all(
                    [
                        (
                            async function (
                                this: Frame,
                            ):
                                Promise<void>
                            {
                                while (this.immediate_count > 0) {
                                    await Utils.Wait_Milliseconds(1);
                                }
                            }.bind(this)
                        )(),
                        this.queued.Pause(),
                    ],
                );
                await executor();
                this.queued.Unpause();

                this.has_exclusive = false;
            }
        } else {
            Utils.Assert(
                false,
                `Unknown type.`,
            );
        }
    }
}
