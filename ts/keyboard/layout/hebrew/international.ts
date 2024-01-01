import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const VOWEL_POINTS_AND_ACCENTS: [Array<Key>, Space.Combos | boolean, Space.Combos | boolean] = [
    [Key.SLASH],
    [
        // U+05C1 HEBREW POINT SHIN DOT
        [[Key.KEY_Q], `ׁ`, false],
        // U+05C1 HEBREW POINT SHIN DOT
        [[Key.BRACKET_LEFT], `ׁ`, false],
        // U+05C2 HEBREW POINT SIN DOT
        [[Key.KEY_W], `ׂ`, false],
        // U+05C2 HEBREW POINT SIN DOT
        [[Key.BRACKET_RIGHT], `ׂ`, false],
        // U+05BC HEBREW POINT DAGESH OR MAPIQ, U+05BB HEBREW POINT QUBUTS
        [[Key.KEY_U], `ּ`, `ֻ`],
        // U+05B0 HEBREW POINT SHEVA
        [[Key.KEY_J], `ְ`, false],
        // U+05B0 HEBREW POINT SHEVA
        [[Key.COMMA], `ְ`, false],
        // U+05B7 HEBREW POINT PATAH, U+05B2 HEBREW POINT HATAF PATAH
        [[Key.KEY_A], `ַ`, `ֲ`],
        // U+05B6 HEBREW POINT SEGOL, U+05B1 HEBREW POINT HATAF SEGOL
        [[Key.KEY_E], `ֶ`, `ֱ`],
        // U+05B4 HEBREW POINT HIRIQ, U+05B5 HEBREW POINT TSERE
        [[Key.KEY_I], `ִ`, `ֵ`],
        // U+05B9 HEBREW POINT HOLAM, U+05BA HEBREW POINT HOLAM HASER FOR VAV
        [[Key.KEY_O], `ֹ`, `ֺ`],
        // U+05B8 HEBREW POINT QAMATS, U+05B3 HEBREW POINT HATAF QAMATS
        [[Key.KEY_V], `ָ`, `ֳ`],
        // U+05BF HEBREW POINT RAFE
        [[Key.KEY_R], `ֿ`, false],
    ],
    Common.ACCENTS,
];

const ALTERNATES_AND_WIDES: [Array<Key>, Space.Combos | boolean, Space.Combos | boolean] = [
    [Key.BACKSLASH],
    [
        // U+05C6 HEBREW PUNCTUATION NUN HAFUKHA
        [[Key.KEY_B], `׆`, false],
    ],
    [
        // U+FB21 HEBREW LETTER WIDE ALEF
        [[Key.KEY_T], `ﬡ`, false],
        // U+FB22 HEBREW LETTER WIDE DALET
        [[Key.KEY_S], `ﬢ`, false],
        // U+FB23 HEBREW LETTER WIDE HE
        [[Key.KEY_V], `ﬣ`, false],
        // U+FB24 HEBREW LETTER WIDE KAF
        [[Key.KEY_F], `ﬤ`, false],
        // U+FB25 HEBREW LETTER WIDE LAMED
        [[Key.KEY_K], `ﬥ`, false],
        // U+FB26 HEBREW LETTER WIDE FINAL MEM
        [[Key.KEY_O], `ﬦ`, false],
        // U+FB27 HEBREW LETTER WIDE RESH
        [[Key.KEY_R], `ﬧ`, false],
        // U+FB28 HEBREW LETTER WIDE TAV
        [[Key.COMMA], `ﬨ`, false],
    ],
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.HEBREW,
                subset_name: `International`,
                is_language_default: false,
                combos_or_space: [
                    // U+05D0 HEBREW LETTER ALEF
                    [[Key.KEY_T], `א`, false],
                    // U+05D1 HEBREW LETTER BET
                    [[Key.KEY_C], `ב`, false],
                    // U+05D2 HEBREW LETTER GIMEL
                    [[Key.KEY_D], `ג`, false],
                    // U+05D3 HEBREW LETTER DALET
                    [[Key.KEY_S], `ד`, false],
                    // U+05D4 HEBREW LETTER HE
                    [[Key.KEY_V], `ה`, false],
                    // U+05D5 HEBREW LETTER VAV
                    [[Key.KEY_U], `ו`, false],
                    // U+05D6 HEBREW LETTER ZAYIN
                    [[Key.KEY_Z], `ז`, false],
                    // U+05D7 HEBREW LETTER HET
                    [[Key.KEY_J], `ח`, false],
                    // U+05D8 HEBREW LETTER TET
                    [[Key.KEY_Y], `ט`, false],
                    // U+05D9 HEBREW LETTER YOD
                    [[Key.KEY_H], `י`, false],
                    // U+05DB HEBREW LETTER KAF
                    [[Key.KEY_F], `כ`, false],
                    // U+05DC HEBREW LETTER LAMED
                    [[Key.KEY_K], `ל`, false],
                    // U+05DE HEBREW LETTER MEM
                    [[Key.KEY_N], `מ`, false],
                    // U+05E0 HEBREW LETTER NUN, U+05C6 HEBREW PUNCTUATION NUN HAFUKHA
                    [[Key.KEY_B], `נ`, `׆`],
                    // U+05E1 HEBREW LETTER SAMEKH
                    [[Key.KEY_X], `ס`, false],
                    // U+05E2 HEBREW LETTER AYIN
                    [[Key.KEY_G], `ע`, false],
                    // U+05E4 HEBREW LETTER PE
                    [[Key.KEY_P], `פ`, false],
                    // U+05E6 HEBREW LETTER TSADI
                    [[Key.KEY_M], `צ`, false],
                    // U+05E7 HEBREW LETTER QOF
                    [[Key.KEY_E], `ק`, false],
                    // U+05E8 HEBREW LETTER RESH
                    [[Key.KEY_R], `ר`, false],
                    // U+05E9 HEBREW LETTER SHIN
                    [[Key.KEY_A], `ש`, false],
                    // U+05EA HEBREW LETTER TAV
                    [[Key.COMMA], `ת`, false],
                    // U+05DA HEBREW LETTER FINAL KAF
                    [[Key.KEY_L], `ך`, false],
                    // U+05DD HEBREW LETTER FINAL MEM
                    [[Key.KEY_O], `ם`, false],
                    // U+05DF HEBREW LETTER FINAL NUN
                    [[Key.KEY_I], `ן`, false],
                    // U+05E3 HEBREW LETTER FINAL PE, U+05C3 HEBREW PUNCTUATION SOF PASUQ
                    [[Key.SEMICOLON], `ף`, `׃`],
                    // U+05E5 HEBREW LETTER FINAL TSADI
                    [[Key.PERIOD], `ץ`, false],

                    // U+05BE HEBREW PUNCTUATION MAQAF
                    [[Key.KEY_W], `־`, false],
                    // U+05C0 HEBREW PUNCTUATION PASEQ
                    [[Key.KEY_Q], `׀`, false],
                    // U+05F3 HEBREW PUNCTUATION GERESH, U+05F4 HEBREW PUNCTUATION GERSHAYIM
                    [[Key.QUOTE], `׳`, `״`],
                    // U+FB29 HEBREW LETTER ALTERNATIVE PLUS SIGN
                    [[Key.EQUAL], false, `﬩`],
                    // U+20AA NEW SHEQEL SIGN
                    [[Key.DIGIT_4], false, `₪`],

                    VOWEL_POINTS_AND_ACCENTS,
                    ALTERNATES_AND_WIDES,
                ],
            },
        );
    }
}
