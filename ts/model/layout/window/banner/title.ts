import { Name } from "../../../../types.js";

import * as Banner from "./instance.js";

export class Instance
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
        this.banner = banner;
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
