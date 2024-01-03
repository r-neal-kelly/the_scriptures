import { Key } from "../../key.js";

import * as Space from "../space.js";

export const DIGITS_AND_PUNCTUATION_AND_DIACRITICS: Space.Combos = [
    // U+1369 ETHIOPIC DIGIT ONE,
    // U+1372 ETHIOPIC NUMBER TEN
    [[Key.DIGIT_1], `፩`, `፲`, Space.IGNORE_CAPS_LOCK],
    // U+136A ETHIOPIC DIGIT TWO,
    // U+1373 ETHIOPIC NUMBER TWENTY
    [[Key.DIGIT_2], `፪`, `፳`, Space.IGNORE_CAPS_LOCK],
    // U+136B ETHIOPIC DIGIT THREE,
    // U+1374 ETHIOPIC NUMBER THIRTY
    [[Key.DIGIT_3], `፫`, `፴`, Space.IGNORE_CAPS_LOCK],
    // U+136C ETHIOPIC DIGIT FOUR,
    // U+1375 ETHIOPIC NUMBER FORTY
    [[Key.DIGIT_4], `፬`, `፵`, Space.IGNORE_CAPS_LOCK],
    // U+136D ETHIOPIC DIGIT FIVE,
    // U+1376 ETHIOPIC NUMBER FIFTY
    [[Key.DIGIT_5], `፭`, `፶`, Space.IGNORE_CAPS_LOCK],
    // U+136E ETHIOPIC DIGIT SIX,
    // U+1377 ETHIOPIC NUMBER SIXTY
    [[Key.DIGIT_6], `፮`, `፷`, Space.IGNORE_CAPS_LOCK],
    // U+136F ETHIOPIC DIGIT SEVEN,
    // U+1378 ETHIOPIC NUMBER SEVENTY
    [[Key.DIGIT_7], `፯`, `፸`, Space.IGNORE_CAPS_LOCK],
    // U+1370 ETHIOPIC DIGIT EIGHT,
    // U+1379 ETHIOPIC NUMBER EIGHTY
    [[Key.DIGIT_8], `፰`, `፹`, Space.IGNORE_CAPS_LOCK],
    // U+1371 ETHIOPIC DIGIT NINE,
    // U+137A ETHIOPIC NUMBER NINETY
    [[Key.DIGIT_9], `፱`, `፺`, Space.IGNORE_CAPS_LOCK],
    // U+137B ETHIOPIC NUMBER HUNDRED,
    // U+137C ETHIOPIC NUMBER TEN THOUSAND
    [[Key.DIGIT_0], `፻`, `፼`, Space.IGNORE_CAPS_LOCK],

    // U+1363 ETHIOPIC COMMA,
    // U+1368 ETHIOPIC PARAGRAPH SEPARATOR
    [[Key.COMMA], `፣`, `፨`, Space.IGNORE_CAPS_LOCK],
    // U+1362 ETHIOPIC FULL STOP,
    // U+1360 ETHIOPIC SECTION MARK
    [[Key.PERIOD], `።`, `፠`, Space.IGNORE_CAPS_LOCK],
    // U+1364 ETHIOPIC SEMICOLON,
    // U+1365 ETHIOPIC COLON
    [[Key.SEMICOLON], `፤`, `፥`, Space.IGNORE_CAPS_LOCK],
    // U+1361 ETHIOPIC WORDSPACE,
    // U+1367 ETHIOPIC QUESTION MARK
    [[Key.SLASH], `፡`, `፧`, Space.IGNORE_CAPS_LOCK],
    // U+1366 ETHIOPIC PREFACE COLON
    [[Key.QUOTE], `፦`, Space.MIRROR, Space.IGNORE_CAPS_LOCK],

    // U+135E ETHIOPIC COMBINING VOWEL LENGTH MARK
    [[Key.BRACKET_LEFT], `፞`, Space.MIRROR, Space.IGNORE_CAPS_LOCK],
    // U+135F ETHIOPIC COMBINING GEMINATION MARK
    [[Key.BRACKET_RIGHT], `፟`, Space.MIRROR, Space.IGNORE_CAPS_LOCK],
    // U+135D ETHIOPIC COMBINING GEMINATION AND VOWEL LENGTH MARK
    [[Key.BACKSLASH], `፝`, Space.MIRROR, Space.IGNORE_CAPS_LOCK],
];

export const HOY_KEY: Key =
    Key.KEY_H; // Hoy
export const LAWE_KEY: Key =
    Key.KEY_L; // Läwe
export const HAWT_KEY: Key =
    Key.KEY_U; // Ḥäwt
export const MAY_KEY: Key =
    Key.KEY_M; // May
export const SAWT_KEY: Key =
    Key.KEY_S; // Śäwt
export const RES_KEY: Key =
    Key.KEY_R; // Rəʾs
export const SAT_KEY: Key =
    Key.KEY_X; // Sat
export const QAF_KEY: Key =
    Key.KEY_Q; // Ḳaf
export const BET_KEY: Key =
    Key.KEY_B; // Bet
export const TAWE_KEY: Key =
    Key.KEY_T; // Täwe
export const HARM_KEY: Key =
    Key.KEY_J; // Ḫarm
export const NAHAS_KEY: Key =
    Key.KEY_N; // Nähas
export const ALF_KEY: Key =
    Key.KEY_A; // ʾÄlf
export const KAF_KEY: Key =
    Key.KEY_K; // Kaf
export const WAWE_KEY: Key =
    Key.KEY_W; // Wäwe
export const AYN_KEY: Key =
    Key.KEY_O; // ʿÄyn
export const ZAY_KEY: Key =
    Key.KEY_Z; // Zäy
export const YAMAN_KEY: Key =
    Key.KEY_Y; // Yämän
export const DANT_KEY: Key =
    Key.KEY_D; // Dänt
export const GAML_KEY: Key =
    Key.KEY_G; // Gäml
export const TAYT_KEY: Key =
    Key.KEY_E; // Ṭäyt
export const PAYT_KEY: Key =
    Key.KEY_I; // P̣äyt
export const SADAY_KEY: Key =
    Key.KEY_C; // Ṣädäy
export const SAPPA_KEY: Key =
    Key.KEY_V; // Ṣ́äppä
export const AF_KEY: Key =
    Key.KEY_F; // Äf
export const PSA_KEY: Key =
    Key.KEY_P; // Psa
