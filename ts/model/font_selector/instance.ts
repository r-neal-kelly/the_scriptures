import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Font from "../font.js";
import * as Language from "../language.js";
import * as Languages from "../languages.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private static MAX_SLOT_COUNT: Count = 2;

    static Max_Slot_Count():
        Count
    {
        return Instance.MAX_SLOT_COUNT;
    }

    private cached_font_slots: { [language_name: string]: Slot.Instance };
    private slots: Array<Slot.Instance>;

    constructor()
    {
        super();

        this.cached_font_slots = {};
        this.slots = [];

        this.Add_Dependencies(
            [
            ],
        );
    }

    Slot_Count():
        Count
    {
        return this.slots.length;
    }

    Has_Slot(
        slot: Slot.Instance,
    ):
        boolean
    {
        return this.slots.includes(slot);
    }

    Has_Slot_Type(
        slot_type: Slot.Type,
    ):
        boolean
    {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return true;
            }
        }

        return false;
    }

    Slot_From_Type(
        slot_type: Slot.Type,
    ):
        Slot.Instance
    {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return slot;
            }
        }

        Utils.Assert(
            false,
            `Does not have slot with that type.`,
        );

        return this.slots[0];
    }

    Has_Slot_At_Index(
        slot_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            slot_index > -1,
            `slot_index must be greater than -1.`,
        );

        return slot_index < this.Slot_Count();
    }

    Slot_At_Index(
        slot_index: Index,
    ):
        Slot.Instance
    {
        Utils.Assert(
            slot_index > -1,
            `slot_index must be greater than -1.`,
        );
        Utils.Assert(
            slot_index < this.Slot_Count(),
            `slot_index must be less than slot_count.`,
        );

        return this.slots[slot_index];
    }

    Slots():
        Array<Slot.Instance>
    {
        return Array.from(this.slots);
    }

    Slot_Types():
        Array<Slot.Type>
    {
        return [
            Slot.Type.LANGUAGES,
            Slot.Type.FONTS,
        ];
    }

    private Push_Slot():
        void
    {
        const slot_count: Count = this.Slot_Count();
        Utils.Assert(
            slot_count < Instance.Max_Slot_Count(),
            `All slots have been pushed already.`,
        );

        const slot_index: Index = slot_count;
        const slot_type: Slot.Type = this.Slot_Types()[slot_index];

        if (slot_type === Slot.Type.LANGUAGES) {
            this.slots.push(
                new Slot.Instance(
                    {
                        selector: this,
                        index: slot_index,
                        type: slot_type,
                        item_names: Languages.Singleton().Language_Names(),
                    },
                ),
            );
        } else if (slot_type === Slot.Type.FONTS) {
            this.slots.push(
                this.Fonts(this.Slot_At_Index(0).Selected_Item().Name() as Language.Name),
            );
        } else {
            Utils.Assert(
                false,
                `unknown slot_type`,
            );
        }
    }

    private Pop_Slot():
        void
    {
        this.slots.pop();
    }

    Fonts(
        language_name: Language.Name,
    ):
        Slot.Instance
    {
        Utils.Assert(
            this.cached_font_slots.hasOwnProperty(language_name),
            `does not have language_name: ${language_name}`,
        );

        return this.cached_font_slots[language_name];
    }

    Some_Selected_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return Languages.Singleton().Short_Font_Name_To_Font_Name(
            language_name,
            this.Fonts(language_name).Selected_Item().Name(),
        );
    }

    __Select_Item__(
        {
            slot,
            slot_item,
        }: {
            slot: Slot.Instance,
            slot_item: Slot.Item.Instance,
        },
    ):
        void
    {
        Utils.Assert(
            this.Has_Slot(slot),
            `The slot does not belong to this selector.`,
        );

        slot.__Select_Item__(
            {
                item: slot_item,
            },
        );

        if (slot.Type() !== Slot.Type.FONTS) {
            if (this.Slot_At_Index(this.Slot_Count() - 1) === slot) {
                this.Push_Slot();
            } else {
                while (this.Slot_Count() > slot.Index() + 1) {
                    this.Pop_Slot();
                }
                this.Push_Slot();
            }
        }
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        const languages: Languages.Instance = Languages.Singleton();
        const language_names: Array<Language.Name> = languages.Language_Names();
        for (const language_name of language_names) {
            this.cached_font_slots[language_name] = new Slot.Instance(
                {
                    selector: this,
                    index: 1,
                    type: Slot.Type.FONTS,
                    item_names: languages.Global_Short_Font_Names(language_name),
                    selected_item_name: languages.Current_Global_Short_Font_Name(language_name),
                },
            );
        }

        this.Push_Slot();
    }
}
