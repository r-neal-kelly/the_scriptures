import { Name } from "../../../../../types.js";

import * as Utils from "../../../../../utils.js";

import * as Entity from "../../../../entity.js";
import * as Slot from "./instance.js";
import { Type } from "./type.js";

export class Instance extends Entity.Instance
{
    private slot: Slot.Instance;
    private value: Name;

    constructor(
        {
            slot,
            type,
        }: {
            slot: Slot.Instance,
            type: Type,
        },
    )
    {
        super();

        this.slot = slot;

        if (type === Type.BOOKS) {
            this.value = `Books`;
        } else if (type === Type.LANGUAGES) {
            this.value = `Languages`;
        } else if (type === Type.VERSIONS) {
            this.value = `Versions`;
        } else if (type === Type.FILES) {
            this.value = `Files`;
        } else {
            Utils.Assert(
                false,
                `Invalid type.`,
            );

            this.value = ``;
        }

        this.Add_Dependencies(
            [
            ],
        );
    }

    Slot():
        Slot.Instance
    {
        return this.slot;
    }

    Value():
        Name
    {
        return this.value;
    }
}
