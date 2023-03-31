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
            style,
        }: {
            value: Value,
            style: Style | Array<Style>,
        },
    )
    {
        super(
            {
                part_type: Type.MARKER,
                value: value,
                status: Status.GOOD,
                style: style,
            }
        );
    }
}
