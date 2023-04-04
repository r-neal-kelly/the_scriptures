import * as Entity from "../../../entity.js";
import * as Body from "../instance.js";
import * as Selection from "../../selection.js";
import * as Slots from "./slots.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private body: Body.Instance;
    private slots: Slots.Instance;

    constructor(
        {
            body,
            selection = null,
            slot_order,
        }: {
            body: Body.Instance,
            selection?: Selection.Name | Selection.Index | null,
            slot_order: Slot.Order,
        },
    )
    {
        super();

        this.body = body;
        this.slots = new Slots.Instance(
            {
                selector: this,
                order: slot_order,
                selection: selection,
            }
        );

        this.Is_Ready_After(
            [
                this.slots,
            ],
        );
    }

    Body():
        Body.Instance
    {
        return this.body;
    }

    Slots():
        Slots.Instance
    {
        return this.slots;
    }
}
