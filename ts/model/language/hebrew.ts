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
                name: Name.HEBREW,
                direction: Direction.RIGHT_TO_LEFT,

                default_font_name: Font.Name.EZRA_SR,
                font_adaptors: [
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.EZRA,
                            short_font_name: Font.Name.EZRA,
                            styles: {
                                "font-size": `1.125em`,
                                "line-height": `1.45`,
                            },
                        },
                    ),
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.EZRA_SR,
                            short_font_name: Font.Name.EZRA_SR,
                            styles: {
                                "font-size": `1.125em`,
                                "line-height": `1.45`,
                            },
                        },
                    ),
                ],
            },
        );
    }
}
