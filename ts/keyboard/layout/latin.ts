import * as Language from "../../model/language.js";

import { Key } from "../key.js";

import * as Layout from "./instance.js";
import * as Space from "./space.js";

const _1_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.DIGIT_1],
    [
        // U+00BD VULGAR FRACTION ONE HALF
        [[Key.DIGIT_2], `½`, null],
        // U+00BC VULGAR FRACTION ONE QUARTER
        [[Key.DIGIT_4], `¼`, null],
    ],
];

const _3_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.DIGIT_3],
    [
        // U+00BE VULGAR FRACTION THREE QUARTERS
        [[Key.DIGIT_4], `¾`, null],
    ],
];

const A_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.KEY_A],
    [
        // U+A733 LATIN SMALL LETTER AA, U+A732 LATIN CAPITAL LETTER AA
        [[Key.KEY_A], `ꜳ`, `Ꜳ`],
        // U+00E6 LATIN SMALL LETTER AE, U+00C6 LATIN CAPITAL LETTER AE
        [[Key.KEY_E], `æ`, `Æ`],
        // U+A735 LATIN SMALL LETTER AO, U+A734 LATIN CAPITAL LETTER AO
        [[Key.KEY_O], `ꜵ`, `Ꜵ`],
        // U+A737 LATIN SMALL LETTER AU, U+A736 LATIN CAPITAL LETTER AU
        [[Key.KEY_U], `ꜷ`, `Ꜷ`],
        // U+A739 LATIN SMALL LETTER AV, U+A738 LATIN CAPITAL LETTER AV
        [[Key.KEY_V], `ꜹ`, `Ꜹ`],
        // U+A73D LATIN SMALL LETTER AY, U+A73C LATIN CAPITAL LETTER AY
        [[Key.KEY_Y], `ꜽ`, `Ꜽ`],
    ],
];

const O_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.KEY_O],
    [
        // U+0153 LATIN SMALL LIGATURE OE, U+0152 LATIN CAPITAL LIGATURE OE
        [[Key.KEY_E], `œ`, `Œ`],
        // U+A74F LATIN SMALL LETTER OO, U+A74E LATIN CAPITAL LETTER OO
        [[Key.KEY_O], `ꝏ`, `Ꝏ`],
        // U+0223 LATIN SMALL LETTER OU, U+0222 LATIN CAPITAL LETTER OU
        [[Key.KEY_U], `ȣ`, `Ȣ`],
    ],
];

const S_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.KEY_S],
    [
        // U+00DF LATIN SMALL LETTER SHARP S, U+1E9E LATIN CAPITAL LETTER SHARP S
        [[Key.KEY_Z], `ß`, `ẞ`],
    ],
];

const T_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.KEY_T],
    [
        // U+A729 LATIN SMALL LETTER TZ, U+A728 LATIN CAPITAL LETTER TZ
        [[Key.KEY_Z], `ꜩ`, `Ꜩ`],
    ],
];

const U_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.KEY_U],
    [
        // U+1D6B LATIN SMALL LETTER UE
        [[Key.KEY_E], `ᵫ`, null],
        // U+AB63 LATIN SMALL LETTER UO
        [[Key.KEY_O], `ꭣ`, null],
    ],
];

const V_LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.KEY_V],
    [
        // U+A761 LATIN SMALL LETTER VY, U+A760 LATIN CAPITAL LETTER VY
        [[Key.KEY_Y], `ꝡ`, `Ꝡ`],
    ],
];

const LIGATURES_AND_DIGRAPHS: [Array<Key>, Space.Combos] = [
    [Key.BACKSLASH],
    [
        _1_LIGATURES_AND_DIGRAPHS,
        _3_LIGATURES_AND_DIGRAPHS,
        A_LIGATURES_AND_DIGRAPHS,
        O_LIGATURES_AND_DIGRAPHS,
        S_LIGATURES_AND_DIGRAPHS,
        T_LIGATURES_AND_DIGRAPHS,
        U_LIGATURES_AND_DIGRAPHS,
        V_LIGATURES_AND_DIGRAPHS,
    ],
];

const LETTERS: [Array<Key>, Space.Combos] = [
    [Key.QUOTE],
    [
        // U+017F LATIN SMALL LETTER LONG S
        [[Key.KEY_S], `ſ`, null],
        // U+A75B LATIN SMALL LETTER R ROTUNDA, U+A75A LATIN CAPITAL LETTER R ROTUNDA
        [[Key.KEY_R], `ꝛ`, `Ꝛ`],
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
        // U+2026 HORIZONTAL ELLIPSIS, U+00A6 BROKEN BAR
        [[Key.BACKSLASH], `…`, `¦`],
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

const SUPERSCRIPTS: [Array<Key>, Space.Combos] = [
    [Key.EQUAL],
    [
        // U+1D43 MODIFIER LETTER SMALL A, U+1D2C MODIFIER LETTER CAPITAL A
        [[Key.KEY_A], `ᵃ`, `ᴬ`],
        // U+1D47 MODIFIER LETTER SMALL B, U+1D2E MODIFIER LETTER CAPITAL B
        [[Key.KEY_B], `ᵇ`, `ᴮ`],
        // U+1D9C MODIFIER LETTER SMALL C, U+A7F2 MODIFIER LETTER CAPITAL C
        [[Key.KEY_C], `ᶜ`, `ꟲ`],
        // U+1D48 MODIFIER LETTER SMALL D, U+1D30 MODIFIER LETTER CAPITAL D
        [[Key.KEY_D], `ᵈ`, `ᴰ`],
        // U+1D49 MODIFIER LETTER SMALL E, U+1D31 MODIFIER LETTER CAPITAL E
        [[Key.KEY_E], `ᵉ`, `ᴱ`],
        // U+1DA0 MODIFIER LETTER SMALL F, U+A7F3 MODIFIER LETTER CAPITAL F
        [[Key.KEY_F], `ᶠ`, `ꟳ`],
        // U+1D4D MODIFIER LETTER SMALL G, U+1D33 MODIFIER LETTER CAPITAL G
        [[Key.KEY_G], `ᵍ`, `ᴳ`],
        // U+02B0 MODIFIER LETTER SMALL H, U+1D34 MODIFIER LETTER CAPITAL H
        [[Key.KEY_H], `ʰ`, `ᴴ`],
        // U+2071 SUPERSCRIPT LATIN SMALL LETTER I, U+1D35 MODIFIER LETTER CAPITAL I
        [[Key.KEY_I], `ⁱ`, `ᴵ`],
        // U+02B2 MODIFIER LETTER SMALL J, U+1D36 MODIFIER LETTER CAPITAL J
        [[Key.KEY_J], `ʲ`, `ᴶ`],
        // U+1D4F MODIFIER LETTER SMALL K, U+1D37 MODIFIER LETTER CAPITAL K
        [[Key.KEY_K], `ᵏ`, `ᴷ`],
        // U+02E1 MODIFIER LETTER SMALL L, U+1D38 MODIFIER LETTER CAPITAL L
        [[Key.KEY_L], `ˡ`, `ᴸ`],
        // U+1D50 MODIFIER LETTER SMALL M, U+1D39 MODIFIER LETTER CAPITAL M
        [[Key.KEY_M], `ᵐ`, `ᴹ`],
        // U+207F SUPERSCRIPT LATIN SMALL LETTER N, U+1D3A MODIFIER LETTER CAPITAL N
        [[Key.KEY_N], `ⁿ`, `ᴺ`],
        // U+1D52 MODIFIER LETTER SMALL O, U+1D3C MODIFIER LETTER CAPITAL O
        [[Key.KEY_O], `ᵒ`, `ᴼ`],
        // U+1D56 MODIFIER LETTER SMALL P, U+1D3E MODIFIER LETTER CAPITAL P
        [[Key.KEY_P], `ᵖ`, `ᴾ`],
        // U+A7F4 MODIFIER LETTER CAPITAL Q
        [[Key.KEY_Q], null, `ꟴ`],
        // U+02B3 MODIFIER LETTER SMALL R, U+1D3F MODIFIER LETTER CAPITAL R
        [[Key.KEY_R], `ʳ`, `ᴿ`],
        // U+02E2 MODIFIER LETTER SMALL S
        [[Key.KEY_S], `ˢ`, null],
        // U+1D57 MODIFIER LETTER SMALL T, U+1D40 MODIFIER LETTER CAPITAL T
        [[Key.KEY_T], `ᵗ`, `ᵀ`],
        // U+1D58 MODIFIER LETTER SMALL U, U+1D41 MODIFIER LETTER CAPITAL U
        [[Key.KEY_U], `ᵘ`, `ᵁ`],
        // U+1D5B MODIFIER LETTER SMALL V, U+2C7D MODIFIER LETTER CAPITAL V
        [[Key.KEY_V], `ᵛ`, `ⱽ`],
        // U+02B7 MODIFIER LETTER SMALL W, U+1D42 MODIFIER LETTER CAPITAL W
        [[Key.KEY_W], `ʷ`, `ᵂ`],
        // U+02E3 MODIFIER LETTER SMALL X
        [[Key.KEY_X], `ˣ`, null],
        // U+02B8 MODIFIER LETTER SMALL Y
        [[Key.KEY_Y], `ʸ`, null],
        // U+1DBB MODIFIER LETTER SMALL Z
        [[Key.KEY_Z], `ᶻ`, null],
        // U+10783 MODIFIER LETTER SMALL AE, U+1D2D MODIFIER LETTER CAPITAL AE
        [[Key.BRACKET_LEFT], `𐞃`, `ᴭ`],
        // U+1D3D MODIFIER LETTER CAPITAL OU
        [[Key.BRACKET_RIGHT], null, `ᴽ`],
        // U+00B9 SUPERSCRIPT ONE
        [[Key.DIGIT_1], `¹`, null],
        // U+00B2 SUPERSCRIPT TWO
        [[Key.DIGIT_2], `²`, null],
        // U+00B3 SUPERSCRIPT THREE
        [[Key.DIGIT_3], `³`, null],
        // U+2074 SUPERSCRIPT FOUR
        [[Key.DIGIT_4], `⁴`, null],
        // U+2075 SUPERSCRIPT FIVE
        [[Key.DIGIT_5], `⁵`, null],
        // U+2076 SUPERSCRIPT SIX
        [[Key.DIGIT_6], `⁶`, null],
        // U+2077 SUPERSCRIPT SEVEN
        [[Key.DIGIT_7], `⁷`, null],
        // U+2078 SUPERSCRIPT EIGHT
        [[Key.DIGIT_8], `⁸`, null],
        // U+2079 SUPERSCRIPT NINE, U+207D SUPERSCRIPT LEFT PARENTHESIS
        [[Key.DIGIT_9], `⁹`, `⁽`],
        // U+2070 SUPERSCRIPT ZERO, U+207E SUPERSCRIPT RIGHT PARENTHESIS
        [[Key.DIGIT_0], `⁰`, `⁾`],
        // U+207B SUPERSCRIPT MINUS
        [[Key.MINUS], `⁻`, null],
        // U+207C SUPERSCRIPT EQUALS SIGN, U+207A SUPERSCRIPT PLUS SIGN
        [[Key.EQUAL], `⁼`, `⁺`],
        // U+02C8 MODIFIER LETTER VERTICAL LINE
        [[Key.BACKSLASH], null, `ˈ`],
    ],
];

const SUBSCRIPTS: [Array<Key>, Space.Combos] = [
    [Key.MINUS],
    [
        // U+2090 LATIN SUBSCRIPT SMALL LETTER A
        [[Key.KEY_A], `ₐ`, null],
        // U+2091 LATIN SUBSCRIPT SMALL LETTER E
        [[Key.KEY_E], `ₑ`, null],
        // U+2095 LATIN SUBSCRIPT SMALL LETTER H
        [[Key.KEY_H], `ₕ`, null],
        // U+1D62 LATIN SUBSCRIPT SMALL LETTER I
        [[Key.KEY_I], `ᵢ`, null],
        // U+2C7C LATIN SUBSCRIPT SMALL LETTER J
        [[Key.KEY_J], `ⱼ`, null],
        // U+2096 LATIN SUBSCRIPT SMALL LETTER K
        [[Key.KEY_K], `ₖ`, null],
        // U+2097 LATIN SUBSCRIPT SMALL LETTER L
        [[Key.KEY_L], `ₗ`, null],
        // U+2098 LATIN SUBSCRIPT SMALL LETTER M
        [[Key.KEY_M], `ₘ`, null],
        // U+2099 LATIN SUBSCRIPT SMALL LETTER N
        [[Key.KEY_N], `ₙ`, null],
        // U+2092 LATIN SUBSCRIPT SMALL LETTER O
        [[Key.KEY_O], `ₒ`, null],
        // U+209A LATIN SUBSCRIPT SMALL LETTER P
        [[Key.KEY_P], `ₚ`, null],
        // U+1D63 LATIN SUBSCRIPT SMALL LETTER R
        [[Key.KEY_R], `ᵣ`, null],
        // U+209B LATIN SUBSCRIPT SMALL LETTER S
        [[Key.KEY_S], `ₛ`, null],
        // U+209C LATIN SUBSCRIPT SMALL LETTER T
        [[Key.KEY_T], `ₜ`, null],
        // U+1D64 LATIN SUBSCRIPT SMALL LETTER U
        [[Key.KEY_U], `ᵤ`, null],
        // U+1D65 LATIN SUBSCRIPT SMALL LETTER V
        [[Key.KEY_V], `ᵥ`, null],
        // U+2093 LATIN SUBSCRIPT SMALL LETTER X
        [[Key.KEY_X], `ₓ`, null],
        // U+2081 SUBSCRIPT ONE
        [[Key.DIGIT_1], `₁`, null],
        // U+2082 SUBSCRIPT TWO
        [[Key.DIGIT_2], `₂`, null],
        // U+2083 SUBSCRIPT THREE
        [[Key.DIGIT_3], `₃`, null],
        // U+2084 SUBSCRIPT FOUR
        [[Key.DIGIT_4], `₄`, null],
        // U+2085 SUBSCRIPT FIVE
        [[Key.DIGIT_5], `₅`, null],
        // U+2086 SUBSCRIPT SIX
        [[Key.DIGIT_6], `₆`, null],
        // U+2087 SUBSCRIPT SEVEN
        [[Key.DIGIT_7], `₇`, null],
        // U+2088 SUBSCRIPT EIGHT
        [[Key.DIGIT_8], `₈`, null],
        // U+2089 SUBSCRIPT NINE
        [[Key.DIGIT_9], `₉`, null],
        // U+2080 SUBSCRIPT ZERO
        [[Key.DIGIT_0], `₀`, null],
    ],
];

const COMBINING_DIACRITICS: [Array<Key>, Space.Combos] = [
    [Key.SLASH],
    [
        // U+0300 COMBINING GRAVE ACCENT, U+030F COMBINING DOUBLE GRAVE ACCENT
        [[Key.KEY_A], `̀`, `̏`],
        // U+0301 COMBINING ACUTE ACCENT, U+030B COMBINING DOUBLE ACUTE ACCENT
        [[Key.KEY_S], `́`, `̋`],
        // U+0302 COMBINING CIRCUMFLEX ACCENT, U+030C COMBINING CARON
        [[Key.KEY_D], `̂`, `̌`],
        // U+0308 COMBINING DIAERESIS
        [[Key.KEY_F], `̈`, null],
        // U+0304 COMBINING MACRON
        [[Key.KEY_Q], `̄`, null],
        // U+0306 COMBINING BREVE, U+0311 COMBINING INVERTED BREVE
        [[Key.KEY_W], `̆`, `̑`],
        // U+030A COMBINING RING ABOVE
        [[Key.KEY_R], `̊`, null],
        // U+0303 COMBINING TILDE
        [[Key.KEY_T], `̃`, null],
        // U+0327 COMBINING CEDILLA, U+0328 COMBINING OGONEK
        [[Key.KEY_C], `̧`, `̨`],
        // U+0307 COMBINING DOT ABOVE, U+0323 COMBINING DOT BELOW
        [[Key.KEY_O], `̇`, `̣`],
        // U+0315 COMBINING COMMA ABOVE RIGHT
        [[Key.QUOTE], `̕`, null],
    ],
];

const SPECIALS: [Array<Key>, Space.Combos] = [
    [Key.BACKQUOTE],
    [
        LETTERS,
        SYMBOLS,
        COMMAS,
        SUPERSCRIPTS,
        SUBSCRIPTS,
        COMBINING_DIACRITICS,
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
                    LIGATURES_AND_DIGRAPHS,
                    SPECIALS,
                ],
            },
        );
    }
}
