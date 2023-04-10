import { Count } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Commander from "./instance.js";
import * as Body from "../body.js";

export class Instance extends Entity.Instance
{
    private commander: Commander.Instance;

    constructor(
        {
            commander,
        }: {
            commander: Commander.Instance,
        },
    )
    {
        super();

        this.commander = commander;

        this.Add_Dependencies(
            [
            ],
        );
    }

    Commander():
        Commander.Instance
    {
        return this.commander;
    }

    Symbol():
        string
    {
        return `>>`;
    }

    Can_Activate():
        boolean
    {
        const slots: Body.Selector.Slots.Instance =
            this.Commander().Browser().Body().Selector().Slots();

        return (
            slots.Has_Files() &&
            slots.Files().Items().Count() > 0
        );
    }

    async Activate():
        Promise<void>
    {
        Utils.Assert(
            this.Can_Activate(),
            `Cannot be activated right now.`,
        );

        const files: Body.Selector.Slot.Items.Instance =
            this.Commander().Browser().Body().Selector().Slots().Files().Items();

        const file_count: Count = files.Count();
        if (files.Has_Selected()) {
            const current_file: Body.Selector.Slot.Item.Instance =
                files.Selected();
            if (current_file.Index() < file_count - 1) {
                await files.At(current_file.Index() + 1).Select();
            } else {
                await files.At(0).Select();
            }
        } else {
            await files.At(0).Select();
        }
    }
}
