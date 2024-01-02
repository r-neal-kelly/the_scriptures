import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const SEPARATES: Space.Combos = [
    // U+1FFD GREEK OXIA, U+1FEF GREEK VARIA
    [[Key.SEMICOLON], `´`, ```],
    // U+1FC0 GREEK PERISPOMENI, U+00A8 DIAERESIS
    [[Key.MINUS], `῀`, `¨`],

    // U+1FBF GREEK PSILI, U+1FFE GREEK DASIA
    [[Key.QUOTE], `᾿`, `῾`],
    // U+1FCE GREEK PSILI AND OXIA, U+1FDE GREEK DASIA AND OXIA
    [[Key.SLASH], `῎`, `῞`],
    // U+1FCD GREEK PSILI AND VARIA, U+1FDD GREEK DASIA AND VARIA
    [[Key.BACKSLASH], `῍`, `῝`],
    // U+1FCF GREEK PSILI AND PERISPOMENI, U+1FDF GREEK DASIA AND PERISPOMENI
    [[Key.EQUAL], `῏`, `῟`],

    // U+1FEE GREEK DIALYTIKA AND OXIA, U+1FED GREEK DIALYTIKA AND VARIA
    [[Key.BRACKET_LEFT], `΅`, `῭`],
    // U+1FC1 GREEK DIALYTIKA AND PERISPOMENI
    [[Key.BRACKET_RIGHT], `῁`, false],

    // U+037A GREEK YPOGEGRAMMENI, U+1FBE GREEK PROSGEGRAMMENI
    [[Key.BACKQUOTE], `ͺ`, `ι`],

    // U+00AF MACRON
    [[Key.PERIOD], `¯`, false],
    // U+02D8 BREVE
    [[Key.COMMA], `˘`, false],
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.GREEK,
                subset_name: `Combining Polytonic`,
                is_language_default: true,
                combos_or_space: [
                    ...Common.LETTERS_AND_PUNCTUATION,

                    // U+0301 COMBINING ACUTE ACCENT, U+0300 COMBINING GRAVE ACCENT
                    [[Key.SEMICOLON], `́`, `̀`],
                    // U+0342 COMBINING GREEK PERISPOMENI
                    [[Key.SLASH], `͂`, false],
                    // U+0313 COMBINING COMMA ABOVE, U+0314 COMBINING REVERSED COMMA ABOVE
                    [[Key.QUOTE], `̓`, `̔`],
                    // U+0308 COMBINING DIAERESIS
                    [[Key.BRACKET_LEFT], `̈`, false],
                    // U+0345 COMBINING GREEK YPOGEGRAMMENI
                    [[Key.BRACKET_RIGHT], `ͅ`, false],
                    // U+0343 COMBINING GREEK KORONIS
                    [[Key.BACKSLASH], `̓`, false],

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
