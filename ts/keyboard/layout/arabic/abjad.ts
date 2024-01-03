import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.ARABIC,
                subset_name: `Abjad`,
                is_language_default: true,
                combos_or_space: [
                    // U+0627 ARABIC LETTER ALEF (א),
                    // U+0639 ARABIC LETTER AIN (ע)
                    [[Key.KEY_F], `ا`, `ع`],
                    // U+0628 ARABIC LETTER BEH (ב)
                    [[Key.KEY_B], `ب`, false],
                    // U+062C ARABIC LETTER JEEM (ג),
                    // U+063A ARABIC LETTER GHAIN (ע׀)
                    [[Key.KEY_G], `ج`, `غ`],
                    // U+062F ARABIC LETTER DAL (ד),
                    // U+0630 ARABIC LETTER THAL (ד׀)
                    [[Key.KEY_D], `د`, `ذ`],
                    // U+0647 ARABIC LETTER HEH (ה),
                    // U+0629 ARABIC LETTER TEH MARBUTA (open, final feminine ה)
                    [[Key.KEY_H], `ه`, `ة`],
                    // U+0648 ARABIC LETTER WAW (ו)
                    [[Key.KEY_W], `و`, false],
                    // U+0632 ARABIC LETTER ZAIN (ז)
                    [[Key.KEY_Z], `ز`, false],
                    // U+062D ARABIC LETTER HAH (ח),
                    // U+062E ARABIC LETTER KHAH (ח׀)
                    [[Key.KEY_J], `ح`, `خ`],
                    // U+0637 ARABIC LETTER TAH (ט),
                    // U+0638 ARABIC LETTER ZAH (ט)
                    [[Key.KEY_V], `ط`, `ظ`],
                    // U+064A ARABIC LETTER YEH (י)
                    [[Key.KEY_Y], `ي`, false],
                    // U+0643 ARABIC LETTER KAF (כ)
                    [[Key.KEY_K], `ك`, false],
                    // U+0644 ARABIC LETTER LAM (ל)
                    [[Key.KEY_L], `ل`, false],
                    // U+0645 ARABIC LETTER MEEM (מ)
                    [[Key.KEY_M], `م`, false],
                    // U+0646 ARABIC LETTER NOON (נ)
                    [[Key.KEY_N], `ن`, false],
                    // U+0633 ARABIC LETTER SEEN (שׂ and ס)
                    [[Key.KEY_X], `س`, false],
                    // U+0641 ARABIC LETTER FEH (פ)
                    [[Key.KEY_P], `ف`, false],
                    // U+0635 ARABIC LETTER SAD (צ),
                    // U+0636 ARABIC LETTER DAD (צ׀)
                    [[Key.KEY_C], `ص`, `ض`],
                    // U+0642 ARABIC LETTER QAF (ק)
                    [[Key.KEY_Q], `ق`, false],
                    // U+0631 ARABIC LETTER REH (ר)
                    [[Key.KEY_R], `ر`, false],
                    // U+0634 ARABIC LETTER SHEEN (שׁ)
                    [[Key.KEY_S], `ش`, false],
                    // U+062A ARABIC LETTER TEH (ת),
                    // U+062B ARABIC LETTER THEH (ת)
                    [[Key.KEY_T], `ت`, `ث`],
                    // U+0621 ARABIC LETTER HAMZA (glottal stop/plosive)
                    [[Key.QUOTE], `ء`, false],
                ],
            },
        );
    }
}
