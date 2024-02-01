import { Float } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Language from "../../language.js";
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
            size,
            language,
        }: {
            index: Index,
            value: Value,
            style: Style | Array<Style>,
            size: Float | null,
            language: Language.Name | null,
        },
    )
    {
        super(
            {
                part_type: Type.MARKER,
                index: index,
                value: value,
                status: Status.GOOD,
                style: style,
                size: size,
                language,
            }
        );
    }
}
