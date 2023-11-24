import * as Model from "../../../model/buffer/search/line.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Column from "./column.js";

export class Instance extends Text_Base.Line.Instance<
    Model.Instance,
    Buffer.Instance
>
{
    constructor(
        {
            buffer,
            model,
        }: {
            buffer: Buffer.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                buffer: buffer,
                model: model,
                column_class: Column.Instance,
            },
        );

        this.Live();
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = super.On_Reclass();

        classes.push(`Search_Line`);

        return classes;
    }
}
