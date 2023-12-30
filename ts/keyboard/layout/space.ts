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
    [Array<Key>, Combos]
>;

export type Lookup = {
    [key: string]:
    Lookup | [Lower_Case | null, Upper_Case | null] | Instance,
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

            const lower_case_or_null_or_combos: Combos | Lower_Case | null = combo[1];

            if (Utils.Is.Array(lower_case_or_null_or_combos)) {
                const combos: Combos = lower_case_or_null_or_combos as Combos;

                lookup[last_key] = new Instance(combos);
            } else {
                const lower_case_or_null: Lower_Case | null =
                    lower_case_or_null_or_combos as Lower_Case | null;
                const upper_case_or_null: Upper_Case | null =
                    combo[2] as Upper_Case | null;
                Utils.Assert(
                    (lower_case_or_null !== null) || (upper_case_or_null !== null),
                    `Either lower_case or upper_case must not be null.`,
                );

                lookup[last_key] = [lower_case_or_null, upper_case_or_null];
                Object.freeze(lookup[last_key]);
            }
        }
    }

    Maybe_Space(
        held_keys: Held_Keys.Instance,
    ):
        Instance | boolean
    {
        let lookup: Lookup = this.lookup;
        for (
            let key_idx = 0, key_end = held_keys.Count();
            key_idx < key_end;
            key_idx += 1
        ) {
            const key = held_keys.At(key_idx);
            if (lookup[key] instanceof Instance) {
                if (key_idx === key_end - 1) {
                    return lookup[key] as Instance;
                } else {
                    return false;
                }
            } else if (Utils.Is.Array(lookup[key])) {
                return false;
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
                if (key_idx === key_end - 1) {
                    return lookup[key] as [Lower_Case | null, Upper_Case | null];
                } else {
                    return false;
                }
            } else if (lookup[key] instanceof Instance) {
                return false;
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
