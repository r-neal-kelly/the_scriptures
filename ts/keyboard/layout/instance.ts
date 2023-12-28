import { Name } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Held_Keys from "../held_keys.js";

import * as Space from "./space.js";

export class Instance
{
    private name: Name;
    private top_space: Space.Instance;
    private current_space: Space.Instance;

    constructor(
        {
            name,
            combos,
        }: {
            name: Name,
            combos: Space.Combos,
        },
    )
    {
        this.name = name;
        this.top_space = new Space.Instance(combos);
        this.current_space = this.top_space;
    }

    Name():
        Name
    {
        return this.name;
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
    ):
        Space.Instance | boolean
    {
        const maybe_output: Space.Instance | boolean =
            this.Current_Space().Maybe_Space(held_keys);

        if (maybe_output instanceof Space.Instance) {
            this.Set_Current_Space(maybe_output as Space.Instance);
        }

        return maybe_output;
    }

    Maybe_Output(
        held_keys: Held_Keys.Instance,
        is_shifted: boolean,
        is_caps_locked: boolean,
    ):
        string | boolean
    {
        const maybe_output: [Space.Lower_Case, Space.Upper_Case | null] | boolean =
            this.Current_Space().Maybe_Output(held_keys);

        if (Utils.Is.Boolean(maybe_output)) {
            if (!(maybe_output as boolean)) {
                this.Reset_Current_Space();
            }

            return maybe_output as boolean;
        } else {
            const output: [Space.Lower_Case, Space.Upper_Case | null] =
                maybe_output as [Space.Lower_Case, Space.Upper_Case | null];
            const lower_case: Space.Lower_Case =
                output[0];
            const upper_case_or_null: Space.Upper_Case | null =
                output[1];

            this.Reset_Current_Space();

            if (upper_case_or_null != null) {
                const upper_case: Space.Upper_Case =
                    upper_case_or_null as Space.Upper_Case;

                if (is_shifted && is_caps_locked) {
                    return lower_case;
                } else if (is_shifted || is_caps_locked) {
                    return upper_case;
                } else {
                    return lower_case;
                }
            } else {
                return lower_case;
            }
        }
    }
}
