import{Key}from"./key.js";export const META_KEY=Key.TAB;export const RESERVED_KEYS=[META_KEY,Key.SHIFT_LEFT,Key.SHIFT_RIGHT,Key.CONTROL_LEFT,Key.CONTROL_RIGHT,Key.ALT_LEFT,Key.ALT_RIGHT];Object.freeze(RESERVED_KEYS);export function Has(E){return RESERVED_KEYS.indexOf(E)>-1}