import * as Entity from "../../../entity.js";
import * as Banner from "./instance.js";
import * as Minimize from "./minimize.js";
import * as Maximize from "./maximize.js";
import * as Close from "./close.js";

export class Instance extends Entity.Instance
{
    private banner: Banner.Instance;
    private minimize: Minimize.Instance;
    private maximize: Maximize.Instance;
    private close: Close.Instance;

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
        this.minimize = new Minimize.Instance(
            {
                commands: this,
            },
        );
        this.maximize = new Maximize.Instance(
            {
                commands: this,
            },
        );
        this.close = new Close.Instance(
            {
                commands: this,
            },
        );

        this.Add_Dependencies(
            [
                this.minimize,
                this.maximize,
                this.close,
            ],
        );
    }

    Banner():
        Banner.Instance
    {
        return this.banner;
    }

    Minimize():
        Minimize.Instance
    {
        return this.minimize;
    }

    Maximize():
        Maximize.Instance
    {
        return this.maximize;
    }

    Close():
        Close.Instance
    {
        return this.close;
    }
}
