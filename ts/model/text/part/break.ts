import { Index } from "../../../types.js";

import * as Languages from "../../languages.js";
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
            language,
        }: {
            index: Index,
            value: Value,
            status: Status,
            style: Style | Array<Style>,
            language: Languages.Name | null,
        },
    )
    {
        super(
            {
                part_type: Type.BREAK,
                index: index,
                value: value,
                status: status,
                style: style,
                language,
            }
        );
    }
}
