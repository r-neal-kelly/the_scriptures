import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

const SPECIALS: Space.Combo = [
    [Key.BACKQUOTE],
    [
        // U+0711 SYRIAC LETTER SUPERSCRIPT ALAPH
        [[Key.KEY_F], `ܑ`, false],
        // U+0714 SYRIAC LETTER GAMAL GARSHUNI
        [[Key.KEY_G], `ܔ`, false],
        // U+0716 SYRIAC LETTER DOTLESS DALATH RISH
        [[Key.KEY_D], `ܖ`, false],
        // U+071C SYRIAC LETTER TETH GARSHUNI
        [[Key.KEY_T], `ܜ`, false],
        // U+071E SYRIAC LETTER YUDH HE
        [[Key.KEY_Y], `ܞ`, false],
        // U+0727 SYRIAC LETTER REVERSED PE
        [[Key.KEY_P], `ܧ`, false],
        // U+0716 SYRIAC LETTER DOTLESS DALATH RISH
        [[Key.KEY_R], `ܖ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.ARAMAIC,
                subset_name: `Abjad`,
                is_language_default: true,
                combos_or_space: [
                    // U+0710 SYRIAC LETTER ALAPH,
                    // U+0725 SYRIAC LETTER E
                    [[Key.KEY_F], `ܐ`, `ܥ`],
                    // U+0712 SYRIAC LETTER BETH
                    [[Key.KEY_B], `ܒ`, false],
                    // U+0713 SYRIAC LETTER GAMAL
                    [[Key.KEY_G], `ܓ`, false],
                    // U+0715 SYRIAC LETTER DALATH
                    [[Key.KEY_D], `ܕ`, false],
                    // U+0717 SYRIAC LETTER HE
                    [[Key.KEY_H], `ܗ`, false],
                    // U+0718 SYRIAC LETTER WAW
                    [[Key.KEY_W], `ܘ`, false],
                    // U+0719 SYRIAC LETTER ZAIN
                    [[Key.KEY_Z], `ܙ`, false],
                    // U+071A SYRIAC LETTER HETH
                    [[Key.KEY_J], `ܚ`, false],
                    // U+072C SYRIAC LETTER TAW,
                    // U+071B SYRIAC LETTER TETH
                    [[Key.KEY_T], `ܬ`, `ܛ`],
                    // U+071D SYRIAC LETTER YUDH
                    [[Key.KEY_Y], `ܝ`, false],
                    // U+071F SYRIAC LETTER KAPH
                    [[Key.KEY_K], `ܟ`, false],
                    // U+0720 SYRIAC LETTER LAMADH
                    [[Key.KEY_L], `ܠ`, false],
                    // U+0721 SYRIAC LETTER MIM
                    [[Key.KEY_M], `ܡ`, false],
                    // U+0722 SYRIAC LETTER NUN
                    [[Key.KEY_N], `ܢ`, false],
                    // U+0723 SYRIAC LETTER SEMKATH,
                    // U+0724 SYRIAC LETTER FINAL SEMKATH
                    [[Key.KEY_X], `ܣ`, `ܤ`],
                    // U+0726 SYRIAC LETTER PE
                    [[Key.KEY_P], `ܦ`, false],
                    // U+0728 SYRIAC LETTER SADHE
                    [[Key.KEY_C], `ܨ`, false],
                    // U+0729 SYRIAC LETTER QAPH
                    [[Key.KEY_Q], `ܩ`, false],
                    // U+072A SYRIAC LETTER RISH
                    [[Key.KEY_R], `ܪ`, false],
                    // U+072B SYRIAC LETTER SHIN
                    [[Key.KEY_S], `ܫ`, false],

                    SPECIALS,
                ],
            },
        );
    }
}
