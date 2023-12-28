import * as Language from "../../model/language.js";

import { Key } from "../key.js";

import * as Layout from "./instance.js";
import * as Space from "./space.js";

const A_LIGATURES: [Array<Key>, Space.Combos] = [
    [Key.KEY_A],
    [
        // U+A733 LATIN SMALL LETTER AA, U+A732 LATIN CAPITAL LETTER AA
        [[Key.KEY_A], `ꜳ`, `Ꜳ`],
        // U+00E6 LATIN SMALL LETTER AE, U+00C6 LATIN CAPITAL LETTER AE
        [[Key.KEY_E], `æ`, `Æ`],
    ],
];

const O_LIGATURES: [Array<Key>, Space.Combos] = [
    [Key.KEY_O],
    [
        // U+0153 LATIN SMALL LIGATURE OE, U+0152 LATIN CAPITAL LIGATURE OE
        [[Key.KEY_E], `œ`, `Œ`],
    ],
];

const COMMAS: [Array<Key>, Space.Combos] = [
    [Key.COMMA],
    [
        [[Key.DIGIT_0], `🄁`, null], // U+1F101 DIGIT ZERO COMMA
        [[Key.DIGIT_1], `🄂`, null], // U+1F102 DIGIT ONE COMMA
        [[Key.DIGIT_2], `🄃`, null], // U+1F103 DIGIT TWO COMMA
        [[Key.DIGIT_3], `🄄`, null], // U+1F104 DIGIT THREE COMMA
        [[Key.DIGIT_4], `🄅`, null], // U+1F105 DIGIT FOUR COMMA
        [[Key.DIGIT_5], `🄆`, null], // U+1F106 DIGIT FIVE COMMA
        [[Key.DIGIT_6], `🄇`, null], // U+1F107 DIGIT SIX COMMA
        [[Key.DIGIT_7], `🄈`, null], // U+1F108 DIGIT SEVEN COMMA
        [[Key.DIGIT_8], `🄉`, null], // U+1F109 DIGIT EIGHT COMMA
        [[Key.DIGIT_9], `🄊`, null], // U+1F10A DIGIT NINE COMMA
    ],
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                name: Language.Name.LATIN,
                combos: [
                    [
                        [Key.BACKQUOTE],
                        [
                            A_LIGATURES,
                            O_LIGATURES,
                            COMMAS,
                        ],
                    ],
                ],
            },
        );
    }
}
