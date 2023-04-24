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
        const expression_value: string = this.Body().Expression().Value();
        if (
            expression_value.length > 0 &&
            /\S/.test(expression_value)
        ) {
            return `Finder: ${expression_value}`;
        } else {
            return `Finder: (empty expression)`;
        }
    }

    Short_Title():
        Name
    {
        const expression_value: string = this.Body().Expression().Value();
        if (
            expression_value.length > 0 &&
            /\S/.test(expression_value)
        ) {
            if (expression_value.length > 7) {
                return `Finder: ${expression_value.slice(0, 12)} ...`;
            } else {
                return `Finder: ${expression_value}`;
            }
        } else {
            return `Finder`;
        }
    }
}
