import { Name } from "../../types.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Search from "../search.js";

export class Instance extends Entity.Instance
{
    private selector: Data.Selector.Instance;
    private search: Search.Instance;
    private search_expression: string | null;
    private search_help: Search.Parser.Help | null;
    private search_results: Array<Search.Result.Instance> | null;

    constructor(
        // I would like to be able to pass in a version so
        // we can open a finder for a browser with a version open.
        {
        }: {},
    )
    {
        super();

        this.selector = new Data.Selector.Instance({});
        this.search = new Search.Instance();
        this.search_expression = null;
        this.search_help = null;
        this.search_results = null;

        this.Add_Dependencies(
            [
                Data.Singleton(),
                this.search,
            ],
        );
    }

    Selector():
        Data.Selector.Instance
    {
        return this.selector;
    }

    Search():
        Search.Instance
    {
        return this.search;
    }

    Maybe_Search_Expression():
        string | null
    {
        return this.search_expression;
    }

    Maybe_Search_Help():
        Search.Parser.Help | null
    {
        return this.search_help;
    }

    Maybe_Search_Results():
        Array<Search.Result.Instance> | null
    {
        if (this.search_results != null) {
            return Array.from(this.search_results);
        } else {
            return null;
        }
    }

    Title():
        Name
    {
        return `Finder`;
    }

    Short_Title():
        Name
    {
        return `Finder`;
    }
}
