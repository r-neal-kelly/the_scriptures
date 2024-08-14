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
        return `<<`;
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

        if (files.Has_Selected_Item()) {
            const current_file: Selector.Slot.Item.Instance =
                files.Selected_Item();

            if (current_file.Index() > 0) {
                files.Item_At_Index(current_file.Index() - 1).Select();
            } else {
                const books: Selector.Slot.Instance =
                    files.Selector().Books();

                Utils.Assert(
                    books.Has_Selected_Item(),
                    `books should have a selected item, because there is a selected file!`,
                );

                const current_book: Selector.Slot.Item.Instance =
                    books.Selected_Item();

                if (current_book.Index() > 0) {
                    books.Item_At_Index(current_book.Index() - 1).Select();
                } else {
                    books.Last_Item().Select();
                }

                // We can actually loose files depending on the slot order,
                // if books is not second to last.
                if (books.Selector().Has_Files()) {
                    books.Selector().Files().Last_Item().Select();
                }
            }
        } else {
            files.Last_Item().Select();
        }
    }
}
