import { Name } from "../../../../types.js";

import * as Entity from "../../../entity.js";
import * as Banner from "./instance.js";

export class Instance extends Entity.Instance
{
    private banner: Banner.Instance;

    constructor(
        {
            banner,
        }: {
            banner: Banner.Instance,
        },
    )
    {
        super();

        this.banner = banner;

        this.Add_Dependencies(
            [
            ],
        );
    }

    Banner():
        Banner.Instance
    {
        return this.banner;
    }

    Value():
        Name
    {
        if (this.Banner().Window().Is_Ready()) {
            return this.Banner().Window().Program().Model_Instance().Title();
        } else {
            return ``;
        }
    }
}
