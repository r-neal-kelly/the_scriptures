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
    private is_info_waiting: boolean;

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
                filter_slot_order: this.filter.Slot_Order(),
                versions_results: new Map(),
                is_showing_commands: false,
            },
        );
        this.is_info_waiting = false;

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

    Has_Empty_Results():
        boolean
    {
        return this.Results().Tree().Root().Is_Empty()
    }

    Is_Info_Waiting():
        boolean
    {
        return this.is_info_waiting;
    }

    Set_Is_Info_Waiting(
        is_info_waiting: boolean,
    ):
        void
    {
        this.is_info_waiting = is_info_waiting;
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
                versions_results = new Map();
                if (file_results.length > 0) {
                    const version_result: Search.Result.Version = new Map();
                    version_result.set(file, file_results);
                    versions_results.set(file.Version(), version_result);
                }
            }
        } else {
            // It might be good to async iterate and wait a bit, that way
            // the view can actually render what it has after each iteration.
            // If we hit a parser error, we simply stop the iteration.
            versions_results = await Search.Singleton().Data_Versions(
                filter_file_or_versions as Array<Data.Version.Instance>,
                expression_value,
            );
        }

        if (versions_results instanceof Search.Parser.Help) {
            this.expression.Set_Help(versions_results);
            this.results = new Results.Instance(
                {
                    body: this,
                    filter_slot_order: this.filter.Slot_Order(),
                    versions_results: new Map(),
                    is_showing_commands: false,
                },
            );
        } else {
            const expression_has_command: boolean =
                Text.Part.Command.Maybe_Valid_Value_From(expression_value) !== null;

            this.expression.Set_Help(null);
            this.results = new Results.Instance(
                {
                    body: this,
                    filter_slot_order: this.filter.Slot_Order(),
                    versions_results: versions_results,
                    is_showing_commands: expression_has_command,
                },
            );
        }
    }
}
