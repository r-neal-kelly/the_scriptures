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
            status,
            style,
            size,
            language,
        }: {
            index: Index,
            value: Value,
            status: Status,
            style: Style | Array<Style>,
            size: Float | null,
            language: Language.Name | null,
        },
    )
    {
        super(
            {
                part_type: Type.WORD,
                index: index,
                value: value,
                status: status,
                style: style,
                size: size,
                language,
            }
        );
    }
}
