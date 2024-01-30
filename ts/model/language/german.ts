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
                name: Name.GERMAN,
                direction: Direction.LEFT_TO_RIGHT,

                default_font_name: Font.Name.UNIFRAKTUR_MAGUNTIA,
                font_adaptors: [
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.GENTIUM,
                            short_font_name: Font.Name.GENTIUM,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.1,
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

                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.UNIFRAKTUR_MAGUNTIA,
                            short_font_name: Font.Name.UNIFRAKTUR_MAGUNTIA,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.2,
                            line_height_multiplier: 1.1,
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
