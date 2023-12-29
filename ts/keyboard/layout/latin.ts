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

const LIGATURES: [Array<Key>, Space.Combos] = [
    [Key.BACKSLASH],
    [
        A_LIGATURES,
        O_LIGATURES,
    ],
];

const LETTERS: [Array<Key>, Space.Combos] = [
    [Key.QUOTE],
    [
        // U+017F LATIN SMALL LETTER LONG S
        [[Key.KEY_S], `ſ`, null],
        // U+00DF LATIN SMALL LETTER SHARP S, U+1E9E LATIN CAPITAL LETTER SHARP S
        [[Key.KEY_B], `ß`, `ẞ`],
    ],
];

const SYMBOLS: [Array<Key>, Space.Combos] = [
    [Key.SEMICOLON],
    [
        // U+00B6 PILCROW SIGN
        [[Key.KEY_P], `¶`, null],
        // U+00A7 SECTION SIGN
        [[Key.KEY_S], `§`, null],
        // U+2E3F CAPITULUM
        [[Key.KEY_C], `⸿`, null],
        // U+2116 NUMERO SIGN
        [[Key.KEY_N], `№`, null],
        // U+00A3 POUND SIGN
        [[Key.DIGIT_3], `£`, null],
        // U+00D7 MULTIPLICATION SIGN
        [[Key.KEY_X], `×`, null],
        // U+00F7 DIVISION SIGN
        [[Key.KEY_D], `÷`, null],
        // U+2011 NON-BREAKING HYPHEN
        [[Key.MINUS], `‑`, null],
        // U+2013 EN DASH, U+2014 EM DASH
        [[Key.EQUAL], `–`, `—`],
        // U+02BC MODIFIER LETTER APOSTROPHE
        [[Key.QUOTE], `ʼ`, null],
        // U+2018 LEFT SINGLE QUOTATION MARK, U+201C LEFT DOUBLE QUOTATION MARK
        [[Key.BRACKET_LEFT], `‘`, `“`],
        // U+2019 RIGHT SINGLE QUOTATION MARK, U+201D RIGHT DOUBLE QUOTATION MARK
        [[Key.BRACKET_RIGHT], `’`, `”`],
        // U+2020 DAGGER, U+2021 DOUBLE DAGGER
        [[Key.KEY_T], `†`, `‡`],
        // U+00B7 MIDDLE DOT, U+27E8 MATHEMATICAL LEFT ANGLE BRACKET
        [[Key.COMMA], `·`, `⟨`],
        // U+2E3C STENOGRAPHIC FULL STOP, U+27E9 MATHEMATICAL RIGHT ANGLE BRACKET
        [[Key.PERIOD], `⸼`, `⟩`],
        // U+2026 HORIZONTAL ELLIPSIS
        [[Key.BACKSLASH], `…`, null],
        // U+27E6 MATHEMATICAL LEFT WHITE SQUARE BRACKET, U+2E28 LEFT DOUBLE PARENTHESIS
        [[Key.DIGIT_9], `⟦`, `⸨`],
        // U+27E7 MATHEMATICAL RIGHT WHITE SQUARE BRACKET, U+2E29 RIGHT DOUBLE PARENTHESIS
        [[Key.DIGIT_0], `⟧`, `⸩`],
        // U+1FBF GREEK PSILI, U+1FFE GREEK DASIA
        [[Key.SEMICOLON], `᾿`, `῾`],
        // U+23DE TOP CURLY BRACKET, U+23DF BOTTOM CURLY BRACKET
        [[Key.KEY_M], `⏞`, `⏟`],
    ],
];

const COMMAS: [Array<Key>, Space.Combos] = [
    [Key.COMMA],
    [
        // U+1F101 DIGIT ZERO COMMA
        [[Key.DIGIT_0], `🄁`, null],
        // U+1F102 DIGIT ONE COMMA
        [[Key.DIGIT_1], `🄂`, null],
        // U+1F103 DIGIT TWO COMMA
        [[Key.DIGIT_2], `🄃`, null],
        // U+1F104 DIGIT THREE COMMA
        [[Key.DIGIT_3], `🄄`, null],
        // U+1F105 DIGIT FOUR COMMA
        [[Key.DIGIT_4], `🄅`, null],
        // U+1F106 DIGIT FIVE COMMA
        [[Key.DIGIT_5], `🄆`, null],
        // U+1F107 DIGIT SIX COMMA
        [[Key.DIGIT_6], `🄇`, null],
        // U+1F108 DIGIT SEVEN COMMA
        [[Key.DIGIT_7], `🄈`, null],
        // U+1F109 DIGIT EIGHT COMMA
        [[Key.DIGIT_8], `🄉`, null],
        // U+1F10A DIGIT NINE COMMA
        [[Key.DIGIT_9], `🄊`, null],
    ],
];

const SPECIALS: [Array<Key>, Space.Combos] = [
    [Key.BACKQUOTE],
    [
        LETTERS,
        SYMBOLS,
        COMMAS,
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
                    LIGATURES,
                    SPECIALS,
                ],
            },
        );
    }
}
