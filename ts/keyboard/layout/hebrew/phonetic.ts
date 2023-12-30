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
                language_name: Language.Name.HEBREW,
                subset_name: `Phonetic`,
                is_language_default: true,
                combos_or_space: [
                    // U+05D0 HEBREW LETTER ALEF, U+05E2 HEBREW LETTER AYIN
                    [[Key.KEY_F], `א`, `ע`],
                ],
            },
        );
    }
}
