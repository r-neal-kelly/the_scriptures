import * as Entity from "./entity.js";

import * as Layout from "./layout.js";

export class Instance extends Entity.Instance
{
    private layout: Layout.Instance;

    constructor()
    {
        super();

        this.layout = new Layout.Instance();

        this.Add_Dependencies(
            [
                this.layout,
            ],
        );
    }

    Layout():
        Layout.Instance
    {
        return this.layout;
    }
}
