import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Data from "../../data.js";
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

    private is_waiting: boolean;
    private waiting_milliseconds_interval: Count;
    private waiting_percent_done: Search.Percent_Done.Instance | null;
    private waiting_message_index: Index | null;
    private waiting_message_count: Count | null;

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
                filter_slot_order: this.filter.Settings().Current_Slot_Order().Value(),
                versions_results: new Map(),
                is_showing_commands: false,
            },
        );
        this.is_waiting = false;
        this.waiting_milliseconds_interval = 200;
        this.waiting_percent_done = null;
        this.waiting_message_index = null;
        this.waiting_message_count = null;

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

    Is_Waiting():
        boolean
    {
        return this.is_waiting;
    }

    private Set_Is_Waiting(
        is_waiting: boolean,
    ):
        void
    {
        this.is_waiting = is_waiting;

        if (this.is_waiting) {
            this.waiting_percent_done = new Search.Percent_Done.Instance();
            this.waiting_message_index = 0;
            this.waiting_message_count = 8;
        } else {
            this.waiting_percent_done = null;
            this.waiting_message_index = null;
            this.waiting_message_count = null;
        }
    }

    Waiting_Milliseconds_Interval():
        Count
    {
        return this.waiting_milliseconds_interval;
    }

    Waiting_Percent_Done():
        Search.Percent_Done.Instance
    {
        Utils.Assert(
            this.Is_Waiting(),
            `does not have percent_done when not waiting`,
        );
        Utils.Assert(
            this.waiting_percent_done != null,
            `waiting_percent_done should not be null`,
        );

        return this.waiting_percent_done as Search.Percent_Done.Instance;
    }

    Waiting_Message():
        string
    {
        Utils.Assert(
            this.Is_Waiting(),
            `does not have message when not waiting`,
        );
        Utils.Assert(
            this.waiting_message_index != null,
            `waiting_message_index should not be null`,
        );
        Utils.Assert(
            this.waiting_message_count != null,
            `waiting_message_count should not be null`,
        );

        const animation: Array<string> =
            new Array(this.waiting_message_count as Count);

        animation.fill(`.`, 0, animation.length);
        animation[this.waiting_message_index as Index] = `📝`; // 📝, ✎
        (this.waiting_message_index as Index) += 1;
        if ((this.waiting_message_index as Index) >= (this.waiting_message_count as Count)) {
            this.waiting_message_index = 0;
        }

        return `Searching ${animation.join(``)} ${this.Waiting_Percent_Done().Value()}%`;
    }

    async Search():
        Promise<void>
    {
        this.Set_Is_Waiting(true);

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
            versions_results = await Search.Singleton().Data_Versions(
                filter_file_or_versions as Array<Data.Version.Instance>,
                expression_value,
                this.Waiting_Milliseconds_Interval(),
                this.Waiting_Percent_Done(),
            );
        }

        if (versions_results instanceof Search.Parser.Help) {
            this.expression.Set_Help(versions_results);
            this.results = new Results.Instance(
                {
                    body: this,
                    filter_slot_order: this.filter.Settings().Current_Slot_Order().Value(),
                    versions_results: new Map(),
                    is_showing_commands: false,
                },
            );
        } else {
            const expression_has_command: boolean =
                expression_value.includes(Search.Operator.META);

            this.expression.Set_Help(null);
            this.results = new Results.Instance(
                {
                    body: this,
                    filter_slot_order: this.filter.Settings().Current_Slot_Order().Value(),
                    versions_results: versions_results,
                    is_showing_commands: expression_has_command,
                },
            );
        }

        this.Set_Is_Waiting(false);
    }
}
