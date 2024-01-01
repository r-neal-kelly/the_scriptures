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
                language_name: Language.Name.GREEK,
                subset_name: `Combining Monotonic`,
                is_language_default: false,
                combos_or_space: [
                    ...Common.LETTERS_AND_PUNCTUATION,
                ],
            },
        );
    }
}
