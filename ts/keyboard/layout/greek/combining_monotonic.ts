import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const SEPARATES: Space.Combos = [
    // U+0384 GREEK TONOS
    [[Key.SEMICOLON], `΄`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
    // U+00A8 DIAERESIS
    [[Key.BRACKET_LEFT], `¨`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
    // U+0385 GREEK DIALYTIKA TONOS
    [[Key.BRACKET_RIGHT], `΅`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],

    // U+00AF MACRON
    [[Key.EQUAL], `¯`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
    // U+02D8 BREVE
    [[Key.MINUS], `˘`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.GREEK,
                subset_name: `Combining Monotonic`,
                is_language_default: false,
                combos_or_space: [
                    ...Common.LETTERS_AND_PUNCTUATION,

                    // U+0301 COMBINING ACUTE ACCENT
                    [[Key.SEMICOLON], `́`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
                    // U+0308 COMBINING DIAERESIS
                    [[Key.BRACKET_LEFT], `̈`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
                    // U+0344 COMBINING GREEK DIALYTIKA TONOS
                    [[Key.BRACKET_RIGHT], `̈́`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],

                    // U+0304 COMBINING MACRON
                    [[Key.EQUAL], `̄`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
                    // U+0306 COMBINING BREVE
                    [[Key.MINUS], `̆`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],

                    // Separates
                    [[Key.BACKQUOTE], SEPARATES, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],
                ],
            },
        );
    }
}
