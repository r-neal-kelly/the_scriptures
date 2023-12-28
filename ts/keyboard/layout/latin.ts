import * as Language from "../../model/language.js";

import { Key } from "../key.js";

import * as Layout from "./instance.js";

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                name: Language.Name.LATIN,
                combos: [
                    [[Key.KEY_G], `l`, `L`],
                    [[Key.KEY_Y, Key.KEY_U], `oops`, null],
                    [[Key.KEY_Y, Key.SPACE], `y`, `Y`],
                    [
                        [Key.BACKQUOTE],
                        [
                            [[Key.SEMICOLON], `blah`, `BLAH`],
                        ],
                    ],
                ],
            },
        );
    }
}
