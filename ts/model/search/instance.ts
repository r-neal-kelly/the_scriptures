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
        return this.executor.Execute(
            expression,
            text,
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

    async Data_Version(
        data_version: Data.Version.Instance,
        expression: string,
        wait_per_file_millisecond_interval: Count,
        percent_done: Percent_Done.Instance,
    ):
        Promise<Result.Version | Parser.Help>
    {
        const version_result: Result.Version = new Map();

        if (!percent_done.Has_Total_Count()) {
            percent_done.Set_Total_Count(data_version.File_Count());
        }

        await data_version.Cache_Files();

        for (let idx = 0, end = data_version.File_Count(); idx < end; idx += 1) {
            const file_result: Array<Result.Instance> | Parser.Help =
                await this.Data_File(
                    data_version.File_At(idx),
                    expression,
                );
            if (file_result instanceof Parser.Help) {
                return file_result as Parser.Help;
            } else if (file_result.length > 0) {
                version_result.set(data_version.File_At(idx), file_result);
            }
            percent_done.Increment_Done_Count();
            await Utils.Wait_Milliseconds(wait_per_file_millisecond_interval);
        }

        return version_result;
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
