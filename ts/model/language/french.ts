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
                name: Name.FRENCH,
                direction: Direction.LEFT_TO_RIGHT,

                default_font_name: Font.Name.ALEGREYA,
                font_adaptors: [
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ALEGREYA,
                            short_font_name: Font.Name.ALEGREYA,
                            fallback_font_names: [
                            ],
                            styles: {
                                "font-size": `1.1em`,
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

                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.GENTIUM,
                            short_font_name: Font.Name.GENTIUM,
                            fallback_font_names: [
                            ],
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
