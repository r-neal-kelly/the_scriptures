/*  
    Add look-ahead and look-behind.
    Also need to add in delimiters.
*/

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";
import * as Parser from "./parser.js";
import * as Executor from "./executor.js";
import * as Result from "./result.js";

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
}
