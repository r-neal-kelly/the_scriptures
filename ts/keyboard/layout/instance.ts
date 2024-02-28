import { Name } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Language from "../../model/language.js";

import * as Held_Keys from "../held_keys.js";

import * as Space from "./space.js";

export class Instance
{
    private language_name: Language.Name;
    private subset_name: Name | null;
    private is_language_default: boolean;
    private top_space: Space.Instance;
    private current_space: Space.Instance;

    constructor(
        {
            language_name,
            subset_name,
            is_language_default,
            combos_or_space,
        }: {
            language_name: Language.Name,
            subset_name: Name | null,
            is_language_default: boolean,
            combos_or_space: Space.Combos | Space.Instance,
        },
    )
    {
        this.language_name = language_name;
        this.subset_name = subset_name;
        this.is_language_default = is_language_default;
        this.top_space = combos_or_space instanceof Space.Instance ?
            combos_or_space as Space.Instance :
            new Space.Instance(combos_or_space as Space.Combos);
        this.current_space = this.top_space;
    }

    Language_Name():
        Language.Name
    {
        return this.language_name;
    }

    Subset_Name():
        Name | null
    {
        return this.subset_name;
    }

    Full_Name():
        Name
    {
        if (this.subset_name != null) {
            return `${this.Language_Name()} - ${this.Subset_Name()}`;
        } else {
            return this.Language_Name();
        }
    }

    Is_Language_Default():
        boolean
    {
        return this.is_language_default;
    }

    Top_Space():
        Space.Instance
    {
        return this.top_space;
    }

    Current_Space():
        Space.Instance
    {
        return this.current_space;
    }

    private Set_Current_Space(
        space: Space.Instance,
    ):
        void
    {
        this.current_space = space;
    }

    private Reset_Current_Space():
        void
    {
        this.Set_Current_Space(this.Top_Space());
    }

    Maybe_Space(
        held_keys: Held_Keys.Instance,
        is_shifted: boolean,
        is_caps_locked: boolean,
    ):
        Space.Instance | boolean
    {
        const maybe_space: Space.Instance | boolean =
            this.Current_Space().Maybe_Space(
                held_keys,
                is_shifted,
                is_caps_locked,
            );

        if (Utils.Is.Boolean(maybe_space)) {
            return maybe_space as boolean;
        } else {
            this.Set_Current_Space(maybe_space as Space.Instance);

            return maybe_space as Space.Instance;
        }
    }

    Maybe_Output(
        held_keys: Held_Keys.Instance,
        is_shifted: boolean,
        is_caps_locked: boolean,
    ):
        string | boolean
    {
        const maybe_output: Space.Lower_Case | Space.Upper_Case | boolean =
            this.Current_Space().Maybe_Output(
                held_keys,
                is_shifted,
                is_caps_locked,
            );

        if (Utils.Is.Boolean(maybe_output)) {
            if (!(maybe_output as boolean)) {
                this.Reset_Current_Space();
            }

            return maybe_output as boolean;
        } else {
            this.Reset_Current_Space();

            return maybe_output as string;
        }
    }

    Reset():
        void
    {
        this.Reset_Current_Space();
    }
}
