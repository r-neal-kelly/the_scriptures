import { Value } from "../value.js";

import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";

export class Instance extends Part.Instance
{
    constructor(
        {
            value,
            status,
            style,
        }: {
            value: Value,
            status: Status,
            style: Style | Array<Style>,
        },
    )
    {
        super(
            {
                part_type: Type.BREAK,
                value: value,
                status: status,
                style: style,
            }
        );
    }
}
