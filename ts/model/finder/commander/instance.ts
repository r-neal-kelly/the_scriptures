import * as Entity from "../../entity.js";
import * as Finder from "../instance.js";
import * as Filter_Visibility from "./filter_visibility.js";

export class Instance extends Entity.Instance
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
        super();

        this.finder = finder;
        this.filter_visibility = new Filter_Visibility.Instance();

        this.Add_Dependencies(
            [
                this.filter_visibility,
            ],
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
