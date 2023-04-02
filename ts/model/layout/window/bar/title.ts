import { Name } from "../../../../types.js";

import * as Bar from "./instance.js";

export class Instance
{
    private bar: Bar.Instance;

    constructor(
        {
            bar,
        }: {
            bar: Bar.Instance,
        },
    )
    {
        this.bar = bar;
    }

    Bar():
        Bar.Instance
    {
        return this.bar;
    }

    Value():
        Name
    {
        if (this.Bar().Window().Is_Ready()) {
            return this.Bar().Window().Program().Model_Instance().Title();
        } else {
            return ``;
        }
    }
}
