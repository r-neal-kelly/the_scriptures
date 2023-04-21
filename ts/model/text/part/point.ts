import { Index } from "../../../types.js";

import { Value } from "../value.js";

import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";

export class Instance extends Part.Instance
{
    constructor(
        {
            index,
            value,
            style,
        }: {
            index: Index,
            value: Value,
            style: Style | Array<Style>,
        },
    )
    {
        super(
            {
                part_type: Type.POINT,
                index: index,
                value: value,
                status: Status.UNKNOWN,
                style: style,
            }
        );
    }
}
