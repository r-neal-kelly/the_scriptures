import { Count } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Selector from "../../selector.js";
import * as Commander from "./instance.js";

export class Instance
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
        this.commander = commander;
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
        const selector: Selector.Instance =
            this.Commander().Browser().Body().Selector();

        return (
            selector.Has_Files() &&
            selector.Files().Item_Count() > 0
        );
    }

    async Activate():
        Promise<void>
    {
        Utils.Assert(
            this.Can_Activate(),
            `Cannot be activated right now.`,
        );

        const files: Selector.Slot.Instance =
            this.Commander().Browser().Body().Selector().Files();

        const file_count: Count = files.Item_Count();
        if (files.Has_Selected_Item()) {
            const current_file: Selector.Slot.Item.Instance =
                files.Selected_Item();
            if (current_file.Index() < file_count - 1) {
                files.Item_At_Index(current_file.Index() + 1).Select();
            } else {
                files.Item_At_Index(0).Select();
            }
        } else {
            files.Item_At_Index(0).Select();
        }
    }
}
