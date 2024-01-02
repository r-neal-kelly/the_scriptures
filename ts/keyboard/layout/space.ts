import * as Utils from "../../utils.js";

import { Key } from "../key.js";
import * as Reserved_Keys from "../reserved_keys.js";
import * as Held_Keys from "../held_keys.js";

export type Lower_Case =
    string;

export type Upper_Case =
    string;

export type Combo =
    [Array<Key>, Lower_Case | Combos | boolean, Upper_Case | Combos | boolean];

export type Combos =
    Array<Combo>;

export type Lookup = {
    [key: string]:
    Lookup | [Lower_Case | Instance | null, Upper_Case | Instance | null],
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

            const lower: Lower_Case | Combos | boolean = combo[1];
            const upper: Upper_Case | Combos | boolean = combo[2];

            lookup[last_key] = [
                null,
                null,
            ];

            if (Utils.Is.String(lower)) {
                lookup[last_key][0] = lower as string;
                if (Utils.Is.String(upper)) {
                    lookup[last_key][1] = upper as string;
                } else if (Utils.Is.Array(upper)) {
                    lookup[last_key][1] = new Instance(upper as Combos);
                } else if (upper as boolean) {
                    lookup[last_key][1] = lookup[last_key][0];
                }
            } else if (Utils.Is.Array(lower)) {
                lookup[last_key][0] = new Instance(lower as Combos);
                if (Utils.Is.String(upper)) {
                    lookup[last_key][1] = upper as string;
                } else if (Utils.Is.Array(upper)) {
                    lookup[last_key][1] = new Instance(upper as Combos);
                } else if (upper as boolean) {
                    lookup[last_key][1] = lookup[last_key][0];
                }
            } else if (Utils.Is.String(upper)) {
                lookup[last_key][1] = upper as string;
                if (lower as boolean) {
                    lookup[last_key][0] = lookup[last_key][1];
                }
            } else if (Utils.Is.Array(upper)) {
                lookup[last_key][1] = new Instance(upper as Combos);
                if (lower as boolean) {
                    lookup[last_key][0] = lookup[last_key][1];
                }
            }

            Object.freeze(lookup[last_key]);

            Utils.Assert(
                lookup[last_key][0] != null ||
                lookup[last_key][1] != null,
                `Cannot have a combo with only booleans.\n` +
                `It must have at least one string or combos.`,
            );
        }
    }

    Maybe_Space(
        held_keys: Held_Keys.Instance,
        is_shifted: boolean,
        is_caps_locked: boolean,
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
            if (Utils.Is.Array(lookup[key])) {
                if (key_idx === key_end - 1) {
                    if (is_shifted && is_caps_locked) {
                        if (lookup[key][0] instanceof Instance) {
                            return lookup[key][0] as Instance;
                        } else {
                            return false;
                        }
                    } else if (is_shifted || is_caps_locked) {
                        if (lookup[key][1] instanceof Instance) {
                            return lookup[key][1] as Instance;
                        } else {
                            return false;
                        }
                    } else {
                        if (lookup[key][0] instanceof Instance) {
                            return lookup[key][0] as Instance;
                        } else {
                            return false;
                        }
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
        is_shifted: boolean,
        is_caps_locked: boolean,
    ):
        Lower_Case | Upper_Case | boolean
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
                    if (is_shifted && is_caps_locked) {
                        if (Utils.Is.String(lookup[key][0])) {
                            return lookup[key][0] as Lower_Case;
                        } else {
                            return false;
                        }
                    } else if (is_shifted || is_caps_locked) {
                        if (Utils.Is.String(lookup[key][1])) {
                            return lookup[key][1] as Upper_Case;
                        } else {
                            return false;
                        }
                    } else {
                        if (Utils.Is.String(lookup[key][0])) {
                            return lookup[key][0] as Lower_Case;
                        } else {
                            return false;
                        }
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
}
