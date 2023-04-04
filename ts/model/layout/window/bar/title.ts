import { Name } from "../../../../types.js";

import * as Entity from "../../../entity.js";
import * as Bar from "./instance.js";

export class Instance extends Entity.Instance
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
        super();

        this.bar = bar;

        this.Is_Ready_After(
            [
            ],
        );
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
