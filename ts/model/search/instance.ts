/*  
    Add look-ahead and look-behind.
    Also need to add in delimiters.
*/

import { Count } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";

import * as Parser from "./parser.js";
import * as Node from "./node.js";
import * as Executor from "./executor.js";
import * as Result from "./result.js";
import * as Percent_Done from "./percent_done.js";

export class Instance extends Entity.Instance
{
    private executor: Executor.Instance;

    constructor()
    {
        super();

        this.executor = new Executor.Instance();

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    private Executor():
        Executor.Instance
    {
        return this.executor;
    }

    Value(
        value: Text.Value,
        dictionary: Text.Dictionary.Instance,
        expression: string,
    ):
        Array<Result.Instance> | Parser.Help
    {
        return this.Text(
            new Text.Instance(
                {
                    dictionary: dictionary,
                    value: value,
                },
            ),
            expression,
        );
    }

    Text(
        text: Text.Instance,
        expression: string,
    ):
        Array<Result.Instance> | Parser.Help
    {
        return this.Executor().Execute(
            text,
            expression,
        );
    }

    async Data_File(
        data_file: Data.File.Instance,
        expression: string,
    ):
        Promise<Array<Result.Instance> | Parser.Help>
    {
        return this.Text(await data_file.Text(), expression);
    }

    async Data_File_With_Node(
        data_file: Data.File.Instance,
        node: Node.Instance,
    ):
        Promise<Array<Result.Instance>>
    {
        return this.Executor().Execute_With_Node(
            await data_file.Text(),
            node,
        );
    }

    async Data_File_Concurrently(
        data_file: Data.File.Instance,
        expression: string,
        worker: Worker,
    ):
        Promise<Array<Result.Instance>>
    {
        return new Promise<Array<Result.Instance>>(
            async function (
                this: Instance,
                resolve: (result: Array<Result.Instance>) => void,
            ):
                Promise<void>
            {
                worker.onmessage = function (
                    event: MessageEvent<Array<Result.Instance>>,
                ):
                    void
                {
                    resolve(event.data);
                };

                worker.postMessage(
                    {
                        file_transfer: await data_file.Transfer(),
                        expression: expression,
                    },
                );
            }.bind(this),
        );
    }

    async Data_Version(
        data_version: Data.Version.Instance,
        expression: string,
        wait_per_file_millisecond_interval: Count,
        percent_done: Percent_Done.Instance,
        workers: Array<Worker> = [],
    ):
        Promise<Result.Version | Parser.Help>
    {
        // It might be nice to have a terminate option to cancel the search.
        // for workers we could use terminate and for non-workers
        // we could just check after each file is done and return if canceled.

        const node_or_help: Node.Instance | Parser.Help = this.Executor().Node_Or_Help(
            await data_version.Dictionary(),
            expression,
        );

        if (node_or_help instanceof Parser.Help) {
            return node_or_help as Parser.Help;
        } else {
            const version_result: Result.Version = new Map();

            if (!percent_done.Has_Total_Count()) {
                percent_done.Set_Total_Count(data_version.File_Count());
            }
            await data_version.Cache_Files();

            if (Utils.Can_Use_Workers()) {
                while (workers.length < 4) {
                    workers.push(
                        new Worker(
                            `js/model/search/worker.js`,
                            {
                                type: `module`,
                            },
                        ),
                    );
                }
                for (
                    let file_idx = 0, file_end = data_version.File_Count();
                    file_idx < file_end;
                    file_idx += workers.length
                ) {
                    const usable_worker_count: Count =
                        Math.min(file_end - file_idx, workers.length);
                    const worker_promises: Array<Promise<Array<Result.Instance>>> =
                        [];
                    for (
                        let worker_idx = 0, worker_end = usable_worker_count;
                        worker_idx < worker_end;
                        worker_idx += 1
                    ) {
                        worker_promises.push(
                            this.Data_File_Concurrently(
                                data_version.File_At(file_idx + worker_idx),
                                expression,
                                workers[worker_idx],
                            ),
                        );
                    }
                    const file_results: Array<Array<Result.Instance>> =
                        await Promise.all(worker_promises);
                    for (
                        let file_results_idx = 0, file_results_end = file_results.length;
                        file_results_idx < file_results_end;
                        file_results_idx += 1
                    ) {
                        const file_result: Array<Result.Instance> =
                            file_results[file_results_idx];
                        if (file_result.length > 0) {
                            for (const result of file_result) {
                                Object.setPrototypeOf(result, Result.Instance.prototype);
                            }
                            version_result.set(
                                data_version.File_At(file_idx + file_results_idx),
                                file_result,
                            );
                        }
                        percent_done.Increment_Done_Count();
                    }
                }
            } else {
                const node: Node.Instance = node_or_help as Node.Instance;
                for (let idx = 0, end = data_version.File_Count(); idx < end; idx += 1) {
                    const file_result: Array<Result.Instance> =
                        await this.Data_File_With_Node(
                            data_version.File_At(idx),
                            node,
                        );
                    if (file_result.length > 0) {
                        version_result.set(data_version.File_At(idx), file_result);
                    }
                    percent_done.Increment_Done_Count();
                    await Utils.Wait_Milliseconds(wait_per_file_millisecond_interval);
                }
            }

            return version_result;
        }
    }

    async Data_Versions(
        data_versions: Array<Data.Version.Instance>,
        expression: string,
        wait_per_version_millisecond_interval: Count,
        percent_done: Percent_Done.Instance,
    ):
        Promise<Result.Versions | Parser.Help>
    {
        const versions_result: Result.Versions = new Map();
        const workers: Array<Worker> = [];

        if (!percent_done.Has_Total_Count()) {
            let total_file_count: Count = 0;
            for (const data_version of data_versions) {
                total_file_count += data_version.File_Count();
            }

            percent_done.Set_Total_Count(total_file_count);
        }

        for (const data_version of data_versions) {
            const version_result: Result.Version | Parser.Help =
                await this.Data_Version(
                    data_version,
                    expression,
                    Math.round(wait_per_version_millisecond_interval / data_version.File_Count()),
                    percent_done,
                    workers,
                );
            if (version_result instanceof Parser.Help) {
                return version_result as Parser.Help;
            } else if (version_result.size > 0) {
                versions_result.set(data_version, version_result);
            }
        }

        return versions_result;
    }
}

let singleton: Instance | null = null;

export function Singleton():
    Instance
{
    if (singleton == null) {
        singleton = new Instance();
    }

    return singleton;
}
