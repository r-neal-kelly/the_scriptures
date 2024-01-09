import * as Finder from "../instance.js";
import * as Filter_Visibility from "./filter_visibility.js";

export class Instance
{
    private finder: Finder.Instance;
    private filter_visibility: Filter_Visibility.Instance;

    constructor(
        {
            finder,
        }: {
            finder: Finder.Instance,
        },
    )
    {
        this.finder = finder;
        this.filter_visibility = new Filter_Visibility.Instance(
            {
                commander: this,
            },
        );
    }

    Finder():
        Finder.Instance
    {
        return this.finder;
    }

    Filter_Visibility():
        Filter_Visibility.Instance
    {
        return this.filter_visibility;
    }
}
