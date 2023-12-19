import * as Utils from "../utils.js";

import * as Font from "./font.js";

export class Instance
{
    private fonts: { [font_name: string]: Font.Instance };

    constructor()
    {
        this.fonts = {};

        this.fonts[Font.Name.ALEGREYA] = new Font.Instance(
            {
                name: Font.Name.ALEGREYA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ALEGREYA,
                            css_url: `fonts/Alegreya/Alegreya-Regular.otf`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ALEGREYA,
                            css_url: `fonts/Alegreya/Alegreya-Bold.otf`,
                            css_weight: `bold`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ALEGREYA,
                            css_url: `fonts/Alegreya/Alegreya-Italic.otf`,
                            css_style: `italic`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ALEGREYA,
                            css_url: `fonts/Alegreya/Alegreya-BoldItalic.otf`,
                            css_weight: `bold`,
                            css_style: `italic`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.CARDO] = new Font.Instance(
            {
                name: Font.Name.CARDO,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.CARDO,
                            css_url: `fonts/Cardo/Cardo-Regular.ttf`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.CARDO,
                            css_url: `fonts/Cardo/Cardo-Bold.ttf`,
                            css_weight: `bold`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.CARDO,
                            css_url: `fonts/Cardo/Cardo-Italic.ttf`,
                            css_style: `italic`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.CATRINITY] = new Font.Instance(
            {
                name: Font.Name.CATRINITY,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.CATRINITY,
                            css_url: `fonts/Catrinity/Catrinity.otf`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.EZRA] = new Font.Instance(
            {
                name: Font.Name.EZRA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.EZRA,
                            css_url: `fonts/Ezra/SILEOT.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.EZRA_SR] = new Font.Instance(
            {
                name: Font.Name.EZRA_SR,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.EZRA_SR,
                            css_url: `fonts/Ezra/SILEOTSR.ttf`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.GALATIA] = new Font.Instance(
            {
                name: Font.Name.GALATIA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GALATIA,
                            css_url: `fonts/Galatia/GalSILR.woff`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GALATIA,
                            css_url: `fonts/Galatia/GalSILB.woff`,
                            css_weight: `bold`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.GENTIUM] = new Font.Instance(
            {
                name: Font.Name.GENTIUM,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM,
                            css_url: `fonts/Gentium/GentiumPlus-Regular.woff2`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM,
                            css_url: `fonts/Gentium/GentiumPlus-Bold.woff2`,
                            css_weight: `bold`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM,
                            css_url: `fonts/Gentium/GentiumPlus-Italic.woff2`,
                            css_style: `italic`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM,
                            css_url: `fonts/Gentium/GentiumPlus-BoldItalic.woff2`,
                            css_weight: `bold`,
                            css_style: `italic`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.GENTIUM_BOOK] = new Font.Instance(
            {
                name: Font.Name.GENTIUM_BOOK,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM_BOOK,
                            css_url: `fonts/Gentium/GentiumBookPlus-Regular.woff2`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM_BOOK,
                            css_url: `fonts/Gentium/GentiumBookPlus-Bold.woff2`,
                            css_weight: `bold`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM_BOOK,
                            css_url: `fonts/Gentium/GentiumBookPlus-Italic.woff2`,
                            css_style: `italic`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.GENTIUM_BOOK,
                            css_url: `fonts/Gentium/GentiumBookPlus-BoldItalic.woff2`,
                            css_weight: `bold`,
                            css_style: `italic`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.ORKNEY] = new Font.Instance(
            {
                name: Font.Name.ORKNEY,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ORKNEY,
                            css_url: `fonts/Orkney/Orkney Regular.ttf`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ORKNEY,
                            css_url: `fonts/Orkney/Orkney Regular Italic.ttf`,
                            css_style: `italic`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ORKNEY,
                            css_url: `fonts/Orkney/Orkney Bold.ttf`,
                            css_weight: `bold`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ORKNEY,
                            css_url: `fonts/Orkney/Orkney Bold Italic.ttf`,
                            css_weight: `bold`,
                            css_style: `italic`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ORKNEY,
                            css_url: `fonts/Orkney/Orkney Light.ttf`,
                            css_weight: `300`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ORKNEY,
                            css_url: `fonts/Orkney/Orkney Light Italic.ttf`,
                            css_weight: `300`,
                            css_style: `italic`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.QUIVIRA] = new Font.Instance(
            {
                name: Font.Name.QUIVIRA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.QUIVIRA,
                            css_url: `fonts/Quivira/Quivira.otf`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.NEAL_PALEO_HEBREW] = new Font.Instance(
            {
                name: Font.Name.NEAL_PALEO_HEBREW,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.NEAL_PALEO_HEBREW,
                            css_url: `fonts/Neal/CustomHebrew.ttf`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.UNIFRAKTUR_MAGUNTIA] = new Font.Instance(
            {
                name: Font.Name.UNIFRAKTUR_MAGUNTIA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.UNIFRAKTUR_MAGUNTIA,
                            css_url: `fonts/Unifraktur Maguntia/UnifrakturMaguntia.ttf`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.ANCIENT_SEMETIC_ARAMAIC_EARLY_BR_RKB] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_ARAMAIC_EARLY_BR_RKB,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_ARAMAIC_EARLY_BR_RKB,
                            css_url: `fonts/Ancient_Semetic/BR_RKB.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_ARAMAIC_IMPERIAL_YEB] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_ARAMAIC_IMPERIAL_YEB,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_ARAMAIC_IMPERIAL_YEB,
                            css_url: `fonts/Ancient_Semetic/YEB.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_ARAMAIC_VIIBCE] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_ARAMAIC_VIIBCE,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_ARAMAIC_VIIBCE,
                            css_url: `fonts/Ancient_Semetic/AVIIBCE.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_ANCIENT] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_ANCIENT,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_ANCIENT,
                            css_url: `fonts/Ancient_Semetic/PROTOCN.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_BEN_KOSBA] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_BEN_KOSBA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_LATE_BEN_KOSBA,
                            css_url: `fonts/Ancient_Semetic/BENKOSBA.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_BET_SHEARIM] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_BET_SHEARIM,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_LATE_BET_SHEARIM,
                            css_url: `fonts/Ancient_Semetic/BETSHEAR.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_HABAKKUK] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_HABAKKUK,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_LATE_HABAKKUK,
                            css_url: `fonts/Ancient_Semetic/HABAKKUK.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_ISAIAH] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_LATE_ISAIAH,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_LATE_ISAIAH,
                            css_url: `fonts/Ancient_Semetic/ISAIAH.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_ARAM_TSOVA] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_ARAM_TSOVA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_ARAM_TSOVA,
                            css_url: `fonts/Ancient_Semetic/KETERA.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_YG] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_YG,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_YG,
                            css_url: `fonts/Ancient_Semetic/KETYGM.TTF`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_YG,
                            css_url: `fonts/Ancient_Semetic/KETYGB.TTF`,
                            css_weight: `bold`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_YG,
                            css_url: `fonts/Ancient_Semetic/KETYGMO.TTF`,
                            css_style: `italic`,
                        },
                    ),
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_MODERN_KETER_YG,
                            css_url: `fonts/Ancient_Semetic/KETYGBO.TTF`,
                            css_weight: `bold`,
                            css_style: `italic`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_MAKABI_YG] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_MAKABI_YG,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_MODERN_MAKABI_YG,
                            css_url: `fonts/Ancient_Semetic/MAKABIYG.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_SOFER_STAM_ASHKENAZ] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_MODERN_SOFER_STAM_ASHKENAZ,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_MODERN_SOFER_STAM_ASHKENAZ,
                            css_url: `fonts/Ancient_Semetic/STAM.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_GEZER] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_GEZER,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_PALEO_GEZER,
                            css_url: `fonts/Ancient_Semetic/GEZER.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_LACHISH] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_LACHISH,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_PALEO_LACHISH,
                            css_url: `fonts/Ancient_Semetic/LACHISH.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_MESHA] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_MESHA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_PALEO_MESHA,
                            css_url: `fonts/Ancient_Semetic/MESHA.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_QUMRAN] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_QUMRAN,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_PALEO_QUMRAN,
                            css_url: `fonts/Ancient_Semetic/QUMRAN.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_SILOAM] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_SILOAM,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_HEBREW_PALEO_SILOAM,
                            css_url: `fonts/Ancient_Semetic/SILOAN.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_PHOENICIAN_AHIRAM] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_PHOENICIAN_AHIRAM,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_PHOENICIAN_AHIRAM,
                            css_url: `fonts/Ancient_Semetic/AHIRAM.TTF`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.ANCIENT_SEMETIC_SAMARITAN] = new Font.Instance(
            {
                name: Font.Name.ANCIENT_SEMETIC_SAMARITAN,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.ANCIENT_SEMETIC_SAMARITAN,
                            css_url: `fonts/Ancient_Semetic/SAMARIT.TTF`,
                        },
                    ),
                ],
            },
        );

        this.fonts[Font.Name.KRIS_J_UDD_ARAMAIC_NABATAEAN] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_ARAMAIC_NABATAEAN,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_ARAMAIC_NABATAEAN,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Nabataean.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_ARCHAIC] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_ARCHAIC,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_ARCHAIC,
                            css_url: `fonts/Kris_J_Udd/Greek/Archaic Greek.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_COIN] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_COIN,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_COIN,
                            css_url: `fonts/Kris_J_Udd/Greek/Greek Coin.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_NAHAL_HEVER_SCRIBE_A] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_NAHAL_HEVER_SCRIBE_A,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_NAHAL_HEVER_SCRIBE_A,
                            css_url: `fonts/Kris_J_Udd/Greek/Nahal Hever Scribe A.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_NAHAL_HEVER_SCRIBE_B] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_NAHAL_HEVER_SCRIBE_B,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_NAHAL_HEVER_SCRIBE_B,
                            css_url: `fonts/Kris_J_Udd/Greek/Nahal Hever Scribe B.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_PAPYRUS_P66] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_PAPYRUS_P66,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_PAPYRUS_P66,
                            css_url: `fonts/Kris_J_Udd/Greek/Papyrus P66.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_PAPYRUS_P75] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_PAPYRUS_P75,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_PAPYRUS_P75,
                            css_url: `fonts/Kris_J_Udd/Greek/Papyrus P75.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_ROSETTA_STONE] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_ROSETTA_STONE,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_ROSETTA_STONE,
                            css_url: `fonts/Kris_J_Udd/Greek/Rosetta Stone.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_SINAITICUS] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_SINAITICUS,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_SINAITICUS,
                            css_url: `fonts/Kris_J_Udd/Greek/Sinaiticus.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_THEODOTUS] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_THEODOTUS,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_THEODOTUS,
                            css_url: `fonts/Kris_J_Udd/Greek/Theodotus.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_GREEK_WASHINGTONENSIS] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_GREEK_WASHINGTONENSIS,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_GREEK_WASHINGTONENSIS,
                            css_url: `fonts/Kris_J_Udd/Greek/Washingtonensis.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_GEZER_CALENDAR] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_GEZER_CALENDAR,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_GEZER_CALENDAR,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Gezer Calendar.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_ISAIAH_SCROLL] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_ISAIAH_SCROLL,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_ISAIAH_SCROLL,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Isaiah Scroll.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_IVORY_POMEGRANATE] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_IVORY_POMEGRANATE,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_IVORY_POMEGRANATE,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Ivory Pomegranate.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_IZBET_SARTAH] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_IZBET_SARTAH,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_IZBET_SARTAH,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Izbet Sartah.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_KETEF_HINNOM_1] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_KETEF_HINNOM_1,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_KETEF_HINNOM_1,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Ketef Hinnom 1.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_KETEF_HINNOM_2] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_KETEF_HINNOM_2,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_KETEF_HINNOM_2,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Ketef Hinnom 2.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_LACHISH_3] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_LACHISH_3,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_LACHISH_3,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Lachish 3.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_LACHISH_4] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_LACHISH_4,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_LACHISH_4,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Lachish 4.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_LACHISH_5] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_LACHISH_5,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_LACHISH_5,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Lachish 5.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_MOABITE_STONE] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_MOABITE_STONE,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_MOABITE_STONE,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Moabite Stone.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_PALEO] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_PALEO,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_PALEO,
                            css_url: `fonts/Kris_J_Udd/Hebrew/PaleoHebrew.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_PROTO_SINAITIC_13] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_PROTO_SINAITIC_13,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_PROTO_SINAITIC_13,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Proto Sinaitic 13.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_PROTO_SINAITIC_15] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_PROTO_SINAITIC_15,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_PROTO_SINAITIC_15,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Proto-Sinaitic 15.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_SAMARIA_OSTRACA] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_SAMARIA_OSTRACA,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_SAMARIA_OSTRACA,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Samaria Ostraca.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_SEALS] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_SEALS,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_SEALS,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Hebrew Seals.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_SILOAM_STONE] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_SILOAM_STONE,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_SILOAM_STONE,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Siloam.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_TEL_DAN] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_TEL_DAN,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_TEL_DAN,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Tel Dan.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_TEL_ZAYIT] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_TEL_ZAYIT,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_TEL_ZAYIT,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Tel Zayit.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_HEBREW_YAVNEH_YAM] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_HEBREW_YAVNEH_YAM,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_HEBREW_YAVNEH_YAM,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Yavneh Yam.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_SAMARITAN] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_SAMARITAN,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_SAMARITAN,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Samaritan.ttf`,
                        },
                    ),
                ],
            },
        );
        this.fonts[Font.Name.KRIS_J_UDD_UGARITIC] = new Font.Instance(
            {
                name: Font.Name.KRIS_J_UDD_UGARITIC,
                faces: [
                    new Font.Face.Instance(
                        {
                            css_family: Font.Family.KRIS_J_UDD_UGARITIC,
                            css_url: `fonts/Kris_J_Udd/Hebrew/Ugaritic.ttf`,
                        },
                    ),
                ],
            },
        );

        Object.freeze(this.fonts);
    }

    Has_Font(
        font_name: Font.Name,
    ):
        boolean
    {
        return this.fonts.hasOwnProperty(font_name);
    }

    Font(
        font_name: Font.Name,
    ):
        Font.Instance
    {
        Utils.Assert(
            this.Has_Font(font_name),
            `does not have font_name: ${font_name}`,
        );

        return this.fonts[font_name];
    }

    Fonts():
        Array<Font.Instance>
    {
        return Object.values(this.fonts);
    }

    CSS_Definitions():
        string
    {
        let css_definitions: string = ``;

        for (const font of this.Fonts()) {
            css_definitions += font.CSS_Definition();
            css_definitions += `\n\n`;
        }

        return css_definitions;
    }
}

let singleton: Instance | null = null;

export function Singleton():
    Instance
{
    if (singleton == null) {
        singleton = new Instance();
    }

    return singleton;
}
