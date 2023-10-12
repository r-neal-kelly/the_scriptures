import * as Font from "../font.js";

import { Name } from "./name.js";
import { Direction } from "./direction.js";
import * as Language from "./instance.js";
import * as Font_Adaptor from "./font_adaptor.js";

export class Instance extends Language.Instance
{
    constructor()
    {
        super(
            {
                name: Name.DUTCH,
                direction: Direction.LEFT_TO_RIGHT,

                default_font_name: Font.Name.GENTIUM,
                font_adaptors: [
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.GENTIUM,
                            short_font_name: Font.Name.GENTIUM,
                            styles: {
                                "font-size": `1.125em`,
                                "line-height": `1.1`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return text;
                            },
                        },
                    ),
                ],
            },
        );
    }
}
