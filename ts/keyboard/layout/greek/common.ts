import { Key } from "../../key.js";

import * as Space from "../space.js";

export const ARCHAIC_OR_VARIANT_LETTERS: Space.Combos = [
    // U+03DB GREEK SMALL LETTER STIGMA, U+03DA GREEK LETTER STIGMA
    [[Key.KEY_S], `ϛ`, `Ϛ`],
    // U+03D7 GREEK KAI SYMBOL, U+03CF GREEK CAPITAL KAI SYMBOL
    [[Key.DIGIT_7], `ϗ`, `Ϗ`],
];

export const LETTERS_AND_PUNCTUATION: Space.Combos = [
    // U+03B1 GREEK SMALL LETTER ALPHA, U+0391 GREEK CAPITAL LETTER ALPHA
    [[Key.KEY_A], `α`, `Α`],
    // U+03B2 GREEK SMALL LETTER BETA, U+0392 GREEK CAPITAL LETTER BETA
    [[Key.KEY_B], `β`, `Β`],
    // U+03B3 GREEK SMALL LETTER GAMMA, U+0393 GREEK CAPITAL LETTER GAMMA
    [[Key.KEY_G], `γ`, `Γ`],
    // U+03B4 GREEK SMALL LETTER DELTA, U+0394 GREEK CAPITAL LETTER DELTA
    [[Key.KEY_D], `δ`, `Δ`],
    // U+03B5 GREEK SMALL LETTER EPSILON, U+0395 GREEK CAPITAL LETTER EPSILON
    [[Key.KEY_E], `ε`, `Ε`],
    // U+03B6 GREEK SMALL LETTER ZETA, U+0396 GREEK CAPITAL LETTER ZETA
    [[Key.KEY_Z], `ζ`, `Ζ`],
    // U+03B7 GREEK SMALL LETTER ETA, U+0397 GREEK CAPITAL LETTER ETA
    [[Key.KEY_H], `η`, `Η`],
    // U+03B8 GREEK SMALL LETTER THETA, U+0398 GREEK CAPITAL LETTER THETA
    [[Key.KEY_Y], `θ`, `Θ`],
    // U+03B9 GREEK SMALL LETTER IOTA, U+0399 GREEK CAPITAL LETTER IOTA
    [[Key.KEY_I], `ι`, `Ι`],
    // U+03BA GREEK SMALL LETTER KAPPA, U+039A GREEK CAPITAL LETTER KAPPA
    [[Key.KEY_K], `κ`, `Κ`],
    // U+03BB GREEK SMALL LETTER LAMDA, U+039B GREEK CAPITAL LETTER LAMDA
    [[Key.KEY_L], `λ`, `Λ`],
    // U+03BC GREEK SMALL LETTER MU, U+039C GREEK CAPITAL LETTER MU
    [[Key.KEY_M], `μ`, `Μ`],
    // U+03BD GREEK SMALL LETTER NU, U+039D GREEK CAPITAL LETTER NU
    [[Key.KEY_N], `ν`, `Ν`],
    // U+03BE GREEK SMALL LETTER XI, U+039E GREEK CAPITAL LETTER XI
    [[Key.KEY_X], `ξ`, `Ξ`],
    // U+03BF GREEK SMALL LETTER OMICRON, U+039F GREEK CAPITAL LETTER OMICRON
    [[Key.KEY_O], `ο`, `Ο`],
    // U+03C0 GREEK SMALL LETTER PI, U+03A0 GREEK CAPITAL LETTER PI
    [[Key.KEY_P], `π`, `Π`],
    // U+03C1 GREEK SMALL LETTER RHO, U+03A1 GREEK CAPITAL LETTER RHO
    [[Key.KEY_R], `ρ`, `Ρ`],
    // U+03C3 GREEK SMALL LETTER SIGMA, U+03A3 GREEK CAPITAL LETTER SIGMA
    [[Key.KEY_S], `σ`, `Σ`],
    // U+03C2 GREEK SMALL LETTER FINAL SIGMA, U+03A3 GREEK CAPITAL LETTER SIGMA
    [[Key.KEY_W], `ς`, `Σ`],
    // U+03C4 GREEK SMALL LETTER TAU, U+03A4 GREEK CAPITAL LETTER TAU
    [[Key.KEY_T], `τ`, `Τ`],
    // U+03C5 GREEK SMALL LETTER UPSILON, U+03A5 GREEK CAPITAL LETTER UPSILON
    [[Key.KEY_U], `υ`, `Υ`],
    // U+03C6 GREEK SMALL LETTER PHI, U+03A6 GREEK CAPITAL LETTER PHI
    [[Key.KEY_F], `φ`, `Φ`],
    // U+03C7 GREEK SMALL LETTER CHI, U+03A7 GREEK CAPITAL LETTER CHI
    [[Key.KEY_J], `χ`, `Χ`],
    // U+03C8 GREEK SMALL LETTER PSI, U+03A8 GREEK CAPITAL LETTER PSI
    [[Key.KEY_C], `ψ`, `Ψ`],
    // U+03C9 GREEK SMALL LETTER OMEGA, U+03A9 GREEK CAPITAL LETTER OMEGA
    [[Key.KEY_V], `ω`, `Ω`],

    // U+1FBD GREEK KORONIS
    [[Key.COMMA], false, `᾽`, Space.IGNORE_CAPS_LOCK],
    // U+0387 GREEK ANO TELEIA
    [[Key.PERIOD], false, `·`, Space.IGNORE_CAPS_LOCK],
    // U+037E GREEK QUESTION MARK, ARCHAIC_OR_VARIANT_LETTERS
    [[Key.KEY_Q], `;`, ARCHAIC_OR_VARIANT_LETTERS, Space.IGNORE_CAPS_LOCK],
    // U+0374 GREEK NUMERAL SIGN
    [[Key.DIGIT_1], false, `ʹ`, Space.IGNORE_CAPS_LOCK],
    // U+0375 GREEK LOWER NUMERAL SIGN
    [[Key.DIGIT_2], false, `͵`, Space.IGNORE_CAPS_LOCK],
];

export const OXIA_AND_VARIA_KEY: Key =
    Key.SEMICOLON;
export const PERISPOMENI_AND_DIALYTIKA_KEY: Key =
    Key.SLASH;
export const PSILI_AND_DASIA_KEY: Key =
    Key.QUOTE;
export const PSILI_OXIA_AND_DASIA_OXIA_KEY: Key =
    Key.BRACKET_LEFT;
export const PSILI_VARIA_AND_DASIA_VARIA_KEY: Key =
    Key.BRACKET_RIGHT;
export const PSILI_PERISPOMENI_AND_DASIA_PERISPOMENI_KEY: Key =
    Key.BACKSLASH;
export const DIALYTIKA_OXIA_AND_DIALYTIKA_VARIA_KEY: Key =
    Key.MINUS;
export const DIALYTIKA_PERISPOMENI_KEY: Key =
    Key.EQUAL;
export const IOTA_KEY: Key =
    Key.BACKQUOTE;
export const MACRON_KEY: Key =
    Key.PERIOD;
export const BREVE_KEY: Key =
    Key.COMMA;
