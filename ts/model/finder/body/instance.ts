import * as Entity from "../../entity.js";
import * as Data from "../../data.js";
import * as Text from "../../text.js";
import * as Search from "../../search.js";
import * as Selector from "../../selector.js";
import * as Finder from "../instance.js";
import * as Expression from "./expression.js";
import * as Results from "./results.js";

export class Instance extends Entity.Instance
{
    private finder: Finder.Instance;
    private filter: Selector.Instance;
    private expression: Expression.Instance;
    private results: Results.Instance;

    constructor(
        {
            finder,
        }: {
            finder: Finder.Instance,
        },
    )
    {
        super();

        this.finder = finder;
        this.filter = new Selector.Instance(
            {
                does_smart_item_selection: false,
            },
        );
        this.expression = new Expression.Instance(
            {
                body: this,
            },
        );
        this.results = new Results.Instance(
            {
                body: this,
            },
        );

        this.Add_Dependencies(
            [
                Data.Singleton(),
                Search.Singleton(),
                this.filter,
                this.expression,
                this.results,
            ],
        );
    }

    Finder():
        Finder.Instance
    {
        return this.finder;
    }

    Filter():
        Selector.Instance
    {
        return this.filter;
    }

    Expression():
        Expression.Instance
    {
        return this.expression;
    }

    Results():
        Results.Instance
    {
        return this.results;
    }

    async Search():
        Promise<void>
    {
        const filter_file_or_versions: Data.File.Instance | Array<Data.Version.Instance> =
            this.Filter().File_Or_Versions();
        const expression_value: string =
            this.Expression().Value();

        let versions_results: Search.Result.Versions | Search.Parser.Help;
        if (filter_file_or_versions instanceof Data.File.Instance) {
            const file: Data.File.Instance =
                filter_file_or_versions as Data.File.Instance;
            const file_results: Array<Search.Result.Instance> | Search.Parser.Help =
                await Search.Singleton().Data_File(
                    file,
                    expression_value,
                );
            if (file_results instanceof Search.Parser.Help) {
                versions_results = file_results as Search.Parser.Help;
            } else {
                const version_result: Search.Result.Version = new Map();
                version_result.set(file, file_results);
                versions_results = new Map();
                versions_results.set(file.Version(), version_result);
            }
        } else {
            versions_results = await Search.Singleton().Data_Versions(
                filter_file_or_versions as Array<Data.Version.Instance>,
                expression_value,
            );
        }

        // now that the async part is out of the way, we can just pass all this stuff
        // to the results type and it can delegate any further setup to get all of its
        // types in order. also, we'll need to give results the slot order of filter.
        // We'll need to create results with default values if it's a parser help.

        if (versions_results instanceof Search.Parser.Help) {

        } else {

        }

        // this might be done in results ctor
        const expression_has_command: boolean =
            Text.Part.Command.Maybe_Valid_Value_From(expression_value) !== null;
    }
}
