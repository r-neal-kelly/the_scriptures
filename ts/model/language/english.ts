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
                name: Name.ENGLISH,
                direction: Direction.LEFT_TO_RIGHT,

                default_font_name: Font.Name.ORKNEY,
                font_adaptors: [
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ORKNEY,
                            short_font_name: Font.Name.ORKNEY,
                            fallback_font_names: [
                                Font.Name.GENTIUM,
                                Font.Name.NOTO_SANS_SYMBOLS,
                            ],
                            font_size_multiplier: 1,
                            line_height_multiplier: 1.2,
                            styles: {
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
