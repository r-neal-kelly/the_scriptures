import { Key } from "./key.js";

export const RESERVED_KEYS: Array<Key> = [
    Key.TAB,
    Key.CAPS_LOCK,
    Key.BACKSPACE,
    Key.ENTER,
    Key.SHIFT_LEFT,
    Key.SHIFT_RIGHT,
    Key.CONTROL_LEFT,
    Key.CONTROL_RIGHT,
    Key.ALT_LEFT,
    Key.ALT_RIGHT,
    Key.META_LEFT,
    Key.META_RIGHT,
];
Object.freeze(RESERVED_KEYS);

export const META_KEY: Key = RESERVED_KEYS[0];

export function Has(
    key: Key,
):
    boolean
{
    return RESERVED_KEYS.indexOf(key) > -1;
}
