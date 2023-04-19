import * as Entity from "../../entity.js";
import * as Filter_Visibility from "./filter_visibility.js";

export class Instance extends Entity.Instance
{
    private filter_visibility: Filter_Visibility.Instance;

    constructor()
    {
        super();

        this.filter_visibility = new Filter_Visibility.Instance();

        this.Add_Dependencies(
            [
                this.filter_visibility,
            ],
        );
    }

    Filter_Visibility():
        Filter_Visibility.Instance
    {
        return this.filter_visibility;
    }
}
