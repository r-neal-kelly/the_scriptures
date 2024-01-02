import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const SEPARATES: Space.Combos = [
    // U+0384 GREEK TONOS
    [[Key.SEMICOLON], `΄`, false],
    // U+00A8 DIAERESIS
    [[Key.BRACKET_LEFT], `¨`, false],
    // U+0385 GREEK DIALYTIKA TONOS
    [[Key.BRACKET_RIGHT], `΅`, false],

    // U+00AF MACRON
    [[Key.EQUAL], `¯`, false],
    // U+02D8 BREVE
    [[Key.MINUS], `˘`, false],
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
                    [[Key.SEMICOLON], `́`, false],
                    // U+0308 COMBINING DIAERESIS
                    [[Key.BRACKET_LEFT], `̈`, false],
                    // U+0344 COMBINING GREEK DIALYTIKA TONOS
                    [[Key.BRACKET_RIGHT], `̈́`, false],

                    // U+0304 COMBINING MACRON
                    [[Key.EQUAL], `̄`, false],
                    // U+0306 COMBINING BREVE
                    [[Key.MINUS], `̆`, false],

                    // Separates
                    [[Key.BACKQUOTE], SEPARATES, false],
                ],
            },
        );
    }
}
