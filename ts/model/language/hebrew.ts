import { Integer } from "../../types.js";
import * as Unicode from "../../unicode.js";

import * as Font from "../font.js";

import { Name } from "./name.js";
import { Direction } from "./direction.js";
import * as Language from "./instance.js";
import * as Font_Adaptor from "./font_adaptor.js";

export class Instance extends Language.Instance
{
    static Remove_Combining_Points(
        text: string,
    ):
        string
    {
        let result: string = ``;

        for (
            let iterator: Unicode.Iterator = new Unicode.Iterator(
                {
                    text: text,
                },
            );
            !iterator.Is_At_End();
            iterator = iterator.Next()
        ) {
            const point: string = iterator.Point();
            const code: Integer = point.codePointAt(0) as Integer;
            if (
                (code < 0x0591 || code > 0x05AF) && // Cantillation
                (code < 0x05B0 || code > 0x05BD) && // Vowel Points
                code !== 0x05BF &&                  // Rafe
                code !== 0x05C1 &&                  // Shin Dot
                code !== 0x05C2 &&                  // Sin Dot
                code !== 0x05C4 &&                  // Upper Dot
                code !== 0x05C5 &&                  // Lower Dot
                code !== 0x05C7 &&                  // Qamats Qatan
                code !== 0xFB1E                     // Spanish Varika
            ) {
                result += point;
            }
        }

        return result;
    }

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
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                            },
                        },
                    ),
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.EZRA_SR,
                            short_font_name: Font.Name.EZRA_SR,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                            },
                        },
                    ),

                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.NEAL_PALEO_HEBREW,
                            short_font_name: Font.Name.NEAL_PALEO_HEBREW,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                                "letter-spacing": `-0.07em`,
                                "word-spacing": `0.1em`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return Instance.Remove_Combining_Points(text);
                            },
                        },
                    ),

                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ANCIENT_SEMETIC_HEBREW_ANCIENT,
                            short_font_name: `AS - Ancient`,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                                "word-spacing": `0.1em`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return Instance.Remove_Combining_Points(text);
                            },
                        },
                    ),
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_GEZER,
                            short_font_name: `AS - Paleo Gezer`,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                                "word-spacing": `0.1em`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return Instance.Remove_Combining_Points(text);
                            },
                        },
                    ),
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_LACHISH,
                            short_font_name: `AS - Paleo Lachish`,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                                "word-spacing": `0.1em`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return Instance.Remove_Combining_Points(text);
                            },
                        },
                    ),
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_MESHA,
                            short_font_name: `AS - Paleo Mesha`,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                                "word-spacing": `0.1em`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return Instance.Remove_Combining_Points(text);
                            },
                        },
                    ),
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_QUMRAN,
                            short_font_name: `AS - Paleo Qumran`,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                                "word-spacing": `0.1em`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return Instance.Remove_Combining_Points(text);
                            },
                        },
                    ),
                    new Font_Adaptor.Instance(
                        {
                            font_name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_SILOAM,
                            short_font_name: `AS - Paleo Siloam`,
                            fallback_font_names: [
                            ],
                            font_size_multiplier: 1.125,
                            line_height_multiplier: 1.45,
                            styles: {
                                "word-spacing": `0.1em`,
                            },
                            treater: function (
                                text: string,
                            ):
                                string
                            {
                                return Instance.Remove_Combining_Points(text);
                            },
                        },
                    ),
                ],
            },
        );
    }
}
