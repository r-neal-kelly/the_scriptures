import { Name } from "../../types.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Search from "../search.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";

export class Instance extends Entity.Instance
{
    private search_results: Array<Search.Result.Instance> | null;
    private commander: Commander.Instance;
    private body: Body.Instance;

    constructor()
    {
        super();

        this.search_results = null;

        this.commander = new Commander.Instance(
            {
                finder: this,
            },
        );
        this.body = new Body.Instance(
            {
                finder: this,
            },
        );

        this.Add_Dependencies(
            [
                Data.Singleton(),
                Search.Singleton(),
                this.commander,
                this.body,
            ],
        );
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

    Commander():
        Commander.Instance
    {
        return this.commander;
    }

    Body():
        Body.Instance
    {
        return this.body;
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
