import * as Utils from "../../utils.js";

import { Key } from "../key.js";
import * as Reserved_Keys from "../reserved_keys.js";
import * as Held_Keys from "../held_keys.js";

export type Lower_Case =
    string;

export type Upper_Case =
    string;

export type Combos = Array<
    [Array<Key>, Lower_Case | null, Upper_Case | null] |
    [Array<Key>, Combos | boolean, Combos | boolean]
>;

export type Lookup = {
    [key: string]:
    Lookup | [Lower_Case | null, Upper_Case | null] | [Instance | null, Instance | null],
};

export class Instance
{
    private lookup: Lookup;

    constructor(
        combos: Combos,
    )
    {
        this.lookup = Object.create(null);

        for (const combo of combos) {
            const keys: Array<Key> = combo[0];
            Utils.Assert(
                keys.length > 0,
                `there must be at least one key in every array of keys`,
            );

            let lookup: Lookup = this.lookup;
            for (const key of keys.slice(0, keys.length - 1)) {
                Utils.Assert(
                    !Reserved_Keys.Has(key),
                    `You cannot use a reserved key: ${key}`,
                );
                if (lookup[key] != null) {
                    Utils.Assert(
                        !Utils.Is.Array(lookup[key]) &&
                        !(lookup[key] instanceof Instance),
                        `Cannot have combos that override or shadow other combos.\n` +
                        `Check your combos to make sure that one doesn't override another.`,
                    );
                    lookup = lookup[key] as Lookup;
                } else {
                    lookup[key] = Object.create(null);
                    lookup = lookup[key] as Lookup;
                }
            }

            const last_key: Key = keys[keys.length - 1];
            Utils.Assert(
                !Reserved_Keys.Has(last_key),
                `You cannot use a reserved key: ${last_key}`,
            );
            Utils.Assert(
                lookup[last_key] == null,
                `Cannot have combos that override or shadow other combos.\n` +
                `Check your combos to make sure that one doesn't override another.`,
            );

            const lower_case_or_null_or_combos_or_boolean:
                Lower_Case | null | Combos | boolean = combo[1];
            const upper_case_or_null_or_combos_or_boolean:
                Upper_Case | null | Combos | boolean = combo[2];

            if (
                Utils.Is.Array(lower_case_or_null_or_combos_or_boolean) ||
                Utils.Is.Boolean(lower_case_or_null_or_combos_or_boolean) ||
                Utils.Is.Array(upper_case_or_null_or_combos_or_boolean) ||
                Utils.Is.Boolean(upper_case_or_null_or_combos_or_boolean)
            ) {
                const lower_combos_or_boolean: Combos | boolean =
                    lower_case_or_null_or_combos_or_boolean as Combos | boolean;
                const upper_combos_or_boolean: Combos | boolean =
                    upper_case_or_null_or_combos_or_boolean as Combos | boolean;

                let lower_space: Instance | null;
                let upper_space: Instance | null;

                if (Utils.Is.Array(lower_combos_or_boolean)) {
                    lower_space = new Instance(lower_combos_or_boolean as Combos);
                    if (Utils.Is.Array(upper_combos_or_boolean)) {
                        upper_space = new Instance(upper_combos_or_boolean as Combos);
                    } else if (upper_combos_or_boolean as boolean) {
                        upper_space = lower_space;
                    } else {
                        upper_space = null;
                    }
                } else if (Utils.Is.Array(upper_combos_or_boolean)) {
                    upper_space = new Instance(upper_combos_or_boolean as Combos);
                    if (lower_combos_or_boolean as boolean) {
                        lower_space = upper_space;
                    } else {
                        lower_space = null;
                    }
                } else {
                    Utils.Assert(
                        false,
                        `At least one slot in the combo must be combos.`,
                    );

                    lower_space = null;
                    upper_space = null;
                }

                lookup[last_key] = [
                    lower_space,
                    upper_space,
                ];
                Object.freeze(lookup[last_key]);
            } else if (
                Utils.Is.String(lower_case_or_null_or_combos_or_boolean) ||
                Utils.Is.String(upper_case_or_null_or_combos_or_boolean)
            ) {
                const lower_case_or_null: Lower_Case | null =
                    lower_case_or_null_or_combos_or_boolean as Lower_Case | null;
                const upper_case_or_null: Upper_Case | null =
                    upper_case_or_null_or_combos_or_boolean as Upper_Case | null;

                lookup[last_key] = [
                    lower_case_or_null,
                    upper_case_or_null,
                ];
                Object.freeze(lookup[last_key]);
            } else {
                Utils.Assert(
                    false,
                    `Cannot have a combo of with only null.\n` +
                    `It must have at least one string or combos.`,
                );
            }
        }
    }

    Maybe_Space(
        held_keys: Held_Keys.Instance,
    ):
        [Instance | null, Instance | null] | boolean
    {
        let lookup: Lookup = this.lookup;
        for (
            let key_idx = 0, key_end = held_keys.Count();
            key_idx < key_end;
            key_idx += 1
        ) {
            const key = held_keys.At(key_idx);
            if (Utils.Is.Array(lookup[key])) {
                if (
                    lookup[key][0] instanceof Instance ||
                    lookup[key][1] instanceof Instance
                ) {
                    if (key_idx === key_end - 1) {
                        return lookup[key] as [Instance | null, Instance | null];
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                if (lookup[key] != null) {
                    lookup = lookup[key] as Lookup;
                } else {
                    return false;
                }
            }
        }

        return true;
    }

    Maybe_Output(
        held_keys: Held_Keys.Instance,
    ):
        [Lower_Case | null, Upper_Case | null] | boolean
    {
        let lookup: Lookup = this.lookup;
        for (
            let key_idx = 0, key_end = held_keys.Count();
            key_idx < key_end;
            key_idx += 1
        ) {
            const key = held_keys.At(key_idx);
            if (Utils.Is.Array(lookup[key])) {
                if (
                    lookup[key][0] instanceof Instance ||
                    lookup[key][1] instanceof Instance
                ) {
                    return false;
                } else {
                    if (key_idx === key_end - 1) {
                        return lookup[key] as [Lower_Case | null, Upper_Case | null];
                    } else {
                        return false;
                    }
                }
            } else {
                if (lookup[key] != null) {
                    lookup = lookup[key] as Lookup;
                } else {
                    return false;
                }
            }
        }

        return true;
    }
}
