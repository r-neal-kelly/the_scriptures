import { Index } from "../../../types.js";

import * as Language from "../../language.js";
import * as Dictionary from "../dictionary.js";
import { Value } from "../value.js";
import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";

export class Instance extends Part.Instance
{
    private boundary: Dictionary.Boundary;

    constructor(
        {
            index,
            value,
            status,
            style,
            language,
            boundary,
        }: {
            index: Index,
            value: Value,
            status: Status,
            style: Style | Array<Style>,
            language: Language.Name | null,
            boundary: Dictionary.Boundary,
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

        this.boundary = boundary;
    }

    Boundary():
        Dictionary.Boundary
    {
        return this.boundary;
    }
}
