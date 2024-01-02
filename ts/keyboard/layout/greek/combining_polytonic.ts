import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const SEPARATES: Space.Combos = [
    // U+1FFD GREEK OXIA, U+1FEF GREEK VARIA
    [[Common.OXIA_AND_VARIA_KEY], `´`, ```],
    // U+1FC0 GREEK PERISPOMENI, U+00A8 DIAERESIS
    [[Common.PERISPOMENI_AND_DIALYTIKA_KEY], `῀`, `¨`],

    // U+1FBF GREEK PSILI, U+1FFE GREEK DASIA
    [[Common.PSILI_AND_DASIA_KEY], `᾿`, `῾`],
    // U+1FCE GREEK PSILI AND OXIA, U+1FDE GREEK DASIA AND OXIA
    [[Common.PSILI_OXIA_AND_DASIA_OXIA_KEY], `῎`, `῞`],
    // U+1FCD GREEK PSILI AND VARIA, U+1FDD GREEK DASIA AND VARIA
    [[Common.PSILI_VARIA_AND_DASIA_VARIA_KEY], `῍`, `῝`],
    // U+1FCF GREEK PSILI AND PERISPOMENI, U+1FDF GREEK DASIA AND PERISPOMENI
    [[Common.PSILI_PERISPOMENI_AND_DASIA_PERISPOMENI_KEY], `῏`, `῟`],

    // U+1FEE GREEK DIALYTIKA AND OXIA, U+1FED GREEK DIALYTIKA AND VARIA
    [[Common.DIALYTIKA_OXIA_AND_DIALYTIKA_VARIA_KEY], `΅`, `῭`],
    // U+1FC1 GREEK DIALYTIKA AND PERISPOMENI
    [[Common.DIALYTIKA_PERISPOMENI_KEY], `῁`, false],

    // U+037A GREEK YPOGEGRAMMENI, U+1FBE GREEK PROSGEGRAMMENI
    [[Common.IOTA_KEY], `ͺ`, `ι`],

    // U+00AF MACRON
    [[Common.MACRON_KEY], `¯`, false],
    // U+02D8 BREVE
    [[Common.BREVE_KEY], `˘`, false],
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
                    // U+0342 COMBINING GREEK PERISPOMENI, U+0308 COMBINING DIAERESIS
                    [[Key.SLASH], `͂`, `̈`],
                    // U+0313 COMBINING COMMA ABOVE, U+0314 COMBINING REVERSED COMMA ABOVE
                    [[Key.QUOTE], `̓`, `̔`],
                    // U+0345 COMBINING GREEK YPOGEGRAMMENI, U+0343 COMBINING GREEK KORONIS
                    [[Key.BACKSLASH], `ͅ`, `̓`],

                    // U+0304 COMBINING MACRON
                    [[Key.BRACKET_RIGHT], `̄`, false],
                    // U+0306 COMBINING BREVE
                    [[Key.BRACKET_LEFT], `̆`, false],

                    // Separates
                    [[Key.BACKQUOTE], SEPARATES, false],
                ],
            },
        );
    }
}
