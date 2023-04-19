import * as Entity from "../../entity.js";
import * as Selection from "../../data/selection.js";
import * as Slots from "./slots.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private slots: Slots.Instance;

    constructor(
        {
            slot_order = Slot.Order.LANGUAGES_VERSIONS_BOOKS,
            selection = null,
        }: {
            slot_order?: Slot.Order,
            selection?: Selection.Name | Selection.Index | null,
        },
    )
    {
        super();

        this.slots = new Slots.Instance(
            {
                selector: this,
                order: slot_order,
                selection: selection,
            }
        );

        this.Add_Dependencies(
            [
                this.slots,
            ],
        );
    }

    Slots():
        Slots.Instance
    {
        return this.slots;
    }
}
