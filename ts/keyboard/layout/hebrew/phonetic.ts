import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const ACCENTS: Space.Combo = [
    [Key.SLASH],
    Common.ACCENTS,
    Space.MIRROR,
    Space.IGNORE_CAPS_LOCK,
];

const ALTERNATES_AND_WIDES: Space.Combo = [
    [Key.BACKSLASH],
    [
        // U+05C6 HEBREW PUNCTUATION NUN HAFUKHA
        [[Key.KEY_N], `׆`, false],
        // U+05E9 HEBREW LETTER SHIN
        [[Key.KEY_S], `ש`, false],
        // U+05C7 HEBREW POINT QAMATS QATAN
        [[Key.KEY_V], `ׇ`, false],
    ],
    [
        // U+FB21 HEBREW LETTER WIDE ALEF
        [[Key.KEY_F], `ﬡ`, false],
        // U+FB22 HEBREW LETTER WIDE DALET
        [[Key.KEY_D], `ﬢ`, false],
        // U+FB23 HEBREW LETTER WIDE HE
        [[Key.KEY_H], `ﬣ`, false],
        // U+FB24 HEBREW LETTER WIDE KAF
        [[Key.KEY_K], `ﬤ`, false],
        // U+FB25 HEBREW LETTER WIDE LAMED
        [[Key.KEY_L], `ﬥ`, false],
        // U+FB26 HEBREW LETTER WIDE FINAL MEM
        [[Key.KEY_M], false, `ﬦ`],
        // U+FB27 HEBREW LETTER WIDE RESH
        [[Key.KEY_R], `ﬧ`, false],
        // U+FB28 HEBREW LETTER WIDE TAV
        [[Key.KEY_T], `ﬨ`, false],
    ],
    Space.IGNORE_CAPS_LOCK,
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.HEBREW,
                subset_name: `Phonetic`,
                is_language_default: true,
                combos_or_space: [
                    // U+05D0 HEBREW LETTER ALEF, U+05E2 HEBREW LETTER AYIN
                    [[Key.KEY_F], `א`, `ע`],
                    // U+05D1 HEBREW LETTER BET
                    [[Key.KEY_B], `ב`, false],
                    // U+05D2 HEBREW LETTER GIMEL
                    [[Key.KEY_G], `ג`, false],
                    // U+05D3 HEBREW LETTER DALET
                    [[Key.KEY_D], `ד`, false],
                    // U+05D4 HEBREW LETTER HE
                    [[Key.KEY_H], `ה`, false],
                    // U+05D5 HEBREW LETTER VAV
                    [[Key.KEY_W], `ו`, false],
                    // U+05D6 HEBREW LETTER ZAYIN
                    [[Key.KEY_Z], `ז`, false],
                    // U+05D7 HEBREW LETTER HET, U+05B0 HEBREW POINT SHEVA
                    [[Key.KEY_J], `ח`, `ְ`],
                    // U+05EA HEBREW LETTER TAV, U+05D8 HEBREW LETTER TET
                    [[Key.KEY_T], `ת`, `ט`],
                    // U+05D9 HEBREW LETTER YOD
                    [[Key.KEY_Y], `י`, false],
                    // U+05DB HEBREW LETTER KAF, U+05DA HEBREW LETTER FINAL KAF
                    [[Key.KEY_K], `כ`, `ך`],
                    // U+05DC HEBREW LETTER LAMED
                    [[Key.KEY_L], `ל`, false],
                    // U+05DE HEBREW LETTER MEM, U+05DD HEBREW LETTER FINAL MEM
                    [[Key.KEY_M], `מ`, `ם`],
                    // U+05E0 HEBREW LETTER NUN, U+05DF HEBREW LETTER FINAL NUN
                    [[Key.KEY_N], `נ`, `ן`],
                    // U+05E1 HEBREW LETTER SAMEKH
                    [[Key.KEY_X], `ס`, false],
                    // U+05E4 HEBREW LETTER PE, U+05E3 HEBREW LETTER FINAL PE
                    [[Key.KEY_P], `פ`, `ף`],
                    // U+05E6 HEBREW LETTER TSADI, U+05E5 HEBREW LETTER FINAL TSADI
                    [[Key.KEY_C], `צ`, `ץ`],
                    // U+05E7 HEBREW LETTER QOF
                    [[Key.KEY_Q], `ק`, false],
                    // U+05E8 HEBREW LETTER RESH, U+05BF HEBREW POINT RAFE
                    [[Key.KEY_R], `ר`, `ֿ`],
                    // U+05E9 HEBREW LETTER SHIN + U+05C1 HEBREW POINT SHIN DOT,
                    // U+05E9 HEBREW LETTER SHIN + U+05C2 HEBREW POINT SIN DOT
                    [[Key.KEY_S], `שׁ`, `שׂ`],

                    // U+05C1 HEBREW POINT SHIN DOT
                    [[Key.BRACKET_LEFT], `ׁ`, false],
                    // U+05C2 HEBREW POINT SIN DOT
                    [[Key.BRACKET_RIGHT], `ׂ`, false],
                    // U+05BC HEBREW POINT DAGESH OR MAPIQ, U+05BB HEBREW POINT QUBUTS
                    [[Key.KEY_U], `ּ`, `ֻ`],
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

                    // U+05BE HEBREW PUNCTUATION MAQAF
                    [[Key.MINUS], `־`, false],
                    // U+05C0 HEBREW PUNCTUATION PASEQ, U+05C3 HEBREW PUNCTUATION SOF PASUQ
                    [[Key.SEMICOLON], `׀`, `׃`],
                    // U+05F3 HEBREW PUNCTUATION GERESH, U+05F4 HEBREW PUNCTUATION GERSHAYIM
                    [[Key.QUOTE], `׳`, `״`],
                    // U+FB29 HEBREW LETTER ALTERNATIVE PLUS SIGN
                    [[Key.EQUAL], false, `﬩`],
                    // U+20AA NEW SHEQEL SIGN
                    [[Key.DIGIT_4], false, `₪`],

                    ACCENTS,
                    ALTERNATES_AND_WIDES,
                ],
            },
        );
    }
}
