import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const TONOS: Space.Combo = [
    [Key.SEMICOLON],
    [
        // U+0384 GREEK TONOS
        [[Key.SEMICOLON], `΄`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],

        // U+03AC GREEK SMALL LETTER ALPHA WITH TONOS,
        // U+0386 GREEK CAPITAL LETTER ALPHA WITH TONOS
        [[Key.KEY_A], `ά`, `Ά`],
        // U+03AD GREEK SMALL LETTER EPSILON WITH TONOS,
        // U+0388 GREEK CAPITAL LETTER EPSILON WITH TONOS
        [[Key.KEY_E], `έ`, `Έ`],
        // U+03AE GREEK SMALL LETTER ETA WITH TONOS,
        // U+0389 GREEK CAPITAL LETTER ETA WITH TONOS
        [[Key.KEY_H], `ή`, `Ή`],
        // U+03AF GREEK SMALL LETTER IOTA WITH TONOS,
        // U+038A GREEK CAPITAL LETTER IOTA WITH TONOS
        [[Key.KEY_I], `ί`, `Ί`],
        // U+03CC GREEK SMALL LETTER OMICRON WITH TONOS,
        // U+038C GREEK CAPITAL LETTER OMICRON WITH TONOS
        [[Key.KEY_O], `ό`, `Ό`],
        // U+03CD GREEK SMALL LETTER UPSILON WITH TONOS,
        // U+038E GREEK CAPITAL LETTER UPSILON WITH TONOS
        [[Key.KEY_U], `ύ`, `Ύ`],
        // U+03CE GREEK SMALL LETTER OMEGA WITH TONOS,
        // U+038F GREEK CAPITAL LETTER OMEGA WITH TONOS
        [[Key.KEY_V], `ώ`, `Ώ`],
    ],
    Space.MIRROR,
    Space.IGNORE_CAPS_LOCK,
];

const DIALYTIKA: Space.Combo = [
    [Key.BRACKET_LEFT],
    [
        // U+00A8 DIAERESIS
        [[Key.BRACKET_LEFT], `¨`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],

        // U+03CA GREEK SMALL LETTER IOTA WITH DIALYTIKA,
        // U+03AA GREEK CAPITAL LETTER IOTA WITH DIALYTIKA
        [[Key.KEY_I], `ϊ`, `Ϊ`],
        // U+03CB GREEK SMALL LETTER UPSILON WITH DIALYTIKA,
        // U+03AB GREEK CAPITAL LETTER UPSILON WITH DIALYTIKA
        [[Key.KEY_U], `ϋ`, `Ϋ`],
    ],
    Space.MIRROR,
    Space.IGNORE_CAPS_LOCK,
];

const DIALYTIKA_TONOS: Space.Combo = [
    [Key.BRACKET_RIGHT],
    [
        // U+0385 GREEK DIALYTIKA TONOS
        [[Key.BRACKET_RIGHT], `΅`, Space.DEFAULT, Space.IGNORE_CAPS_LOCK],

        // U+0390 GREEK SMALL LETTER IOTA WITH DIALYTIKA AND TONOS
        [[Key.KEY_I], `ΐ`, false],
        // U+03B0 GREEK SMALL LETTER UPSILON WITH DIALYTIKA AND TONOS
        [[Key.KEY_U], `ΰ`, false],
    ],
    Space.MIRROR,
    Space.IGNORE_CAPS_LOCK,
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.GREEK,
                subset_name: `Monotonic`,
                is_language_default: false,
                combos_or_space: [
                    ...Common.LETTERS_AND_PUNCTUATION,

                    TONOS,
                    DIALYTIKA,
                    DIALYTIKA_TONOS,
                ],
            },
        );
    }
}
