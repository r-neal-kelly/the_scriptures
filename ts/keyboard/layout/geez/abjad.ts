import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.GEEZ,
                subset_name: `Abjad`,
                is_language_default: false,
                combos_or_space: [
                    // U+1200 ETHIOPIC SYLLABLE HA (ה)
                    [[Common.HOY_KEY], `ሀ`, false],
                    // U+1208 ETHIOPIC SYLLABLE LA (ל)
                    [[Common.LAWE_KEY], `ለ`, false],
                    // U+1210 ETHIOPIC SYLLABLE HHA (variant of ה and ח)
                    [[Common.HAWT_KEY], `ሐ`, false],
                    // U+1218 ETHIOPIC SYLLABLE MA (מ)
                    [[Common.MAY_KEY], `መ`, false],
                    // U+1220 ETHIOPIC SYLLABLE SZA (שׁ)
                    [[Common.SAWT_KEY], `ሠ`, false],
                    // U+1228 ETHIOPIC SYLLABLE RA (ר)
                    [[Common.RES_KEY], `ረ`, false],
                    // U+1230 ETHIOPIC SYLLABLE SA (ס and שׂ)
                    [[Common.SAT_KEY], `ሰ`, false],
                    // U+1240 ETHIOPIC SYLLABLE QA (ק)
                    [[Common.QAF_KEY], `ቀ`, false],
                    // U+1260 ETHIOPIC SYLLABLE BA (ב)
                    [[Common.BET_KEY], `በ`, false],
                    // U+1270 ETHIOPIC SYLLABLE TA (ט AND ת)
                    [[Common.TAWE_KEY], `ተ`, false],
                    // U+1280 ETHIOPIC SYLLABLE XA (ח)
                    [[Common.HARM_KEY], `ኀ`, false],
                    // U+1290 ETHIOPIC SYLLABLE NA (נ)
                    [[Common.NAHAS_KEY], `ነ`, false],
                    // U+12A0 ETHIOPIC SYLLABLE GLOTTAL A (א)
                    [[Common.ALF_KEY], `አ`, false],
                    // U+12A8 ETHIOPIC SYLLABLE KA (כ)
                    [[Common.KAF_KEY], `ከ`, false],
                    // U+12C8 ETHIOPIC SYLLABLE WA (ו)
                    [[Common.WAWE_KEY], `ወ`, false],
                    // U+12D0 ETHIOPIC SYLLABLE PHARYNGEAL A (ע)
                    [[Common.AYN_KEY], `ዐ`, false],
                    // U+12D8 ETHIOPIC SYLLABLE ZA (ז)
                    [[Common.ZAY_KEY], `ዘ`, false],
                    // U+12E8 ETHIOPIC SYLLABLE YA (י)
                    [[Common.YAMAN_KEY], `የ`, false],
                    // U+12F0 ETHIOPIC SYLLABLE DA (ד)
                    [[Common.DANT_KEY], `ደ`, false],
                    // U+1308 ETHIOPIC SYLLABLE GA (ג)
                    [[Common.GAML_KEY], `ገ`, false],
                    // U+1320 ETHIOPIC SYLLABLE THA (variant of ט and ת)
                    [[Common.TAYT_KEY], `ጠ`, false],
                    // U+1330 ETHIOPIC SYLLABLE PHA (variant of פּ)
                    [[Common.PAYT_KEY], `ጰ`, false],
                    // U+1338 ETHIOPIC SYLLABLE TSA (צ)
                    [[Common.SADAY_KEY], `ጸ`, false],
                    // U+1340 ETHIOPIC SYLLABLE TZA (variant of שׁ and צ)
                    [[Common.SAPPA_KEY], `ፀ`, false],
                    // U+1348 ETHIOPIC SYLLABLE FA (פ)
                    [[Common.AF_KEY], `ፈ`, false],
                    // U+1350 ETHIOPIC SYLLABLE PA (פּ)
                    [[Common.PSA_KEY], `ፐ`, false],

                    ...Common.DIGITS_AND_PUNCTUATION_AND_DIACRITICS,
                ],
            },
        );
    }
}
