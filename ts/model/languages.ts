import * as Utils from "../utils.js";

import * as Greek from "./languages/greek.js";

export * as Greek from "./languages/greek.js"

export enum Name
{
    ENGLISH = `English`,
    HEBREW = `Hebrew`,
    GREEK = `Greek`,
    LATIN = `Latin`,
}

const DEFAULT_GLOBAL_FONT: { [language_name: string]: string } = {};
DEFAULT_GLOBAL_FONT[Name.ENGLISH] = `Orkney-Regular`;
DEFAULT_GLOBAL_FONT[Name.HEBREW] = `Ezra SIL SR`;
DEFAULT_GLOBAL_FONT[Name.GREEK] = `Quivira`;
DEFAULT_GLOBAL_FONT[Name.LATIN] = `GentiumPlusW`;
Object.freeze(DEFAULT_GLOBAL_FONT);

export function Default_Global_Font(
    language_name: Name,
):
    string
{
    Utils.Assert(
        DEFAULT_GLOBAL_FONT.hasOwnProperty(language_name),
        `unknown language_name`,
    );

    return DEFAULT_GLOBAL_FONT[language_name] as string;
}

const CURRENT_GLOBAL_FONT: { [language_name: string]: string } = {};
CURRENT_GLOBAL_FONT[Name.ENGLISH] = DEFAULT_GLOBAL_FONT[Name.ENGLISH];
CURRENT_GLOBAL_FONT[Name.HEBREW] = DEFAULT_GLOBAL_FONT[Name.HEBREW];
CURRENT_GLOBAL_FONT[Name.GREEK] = DEFAULT_GLOBAL_FONT[Name.GREEK];
//CURRENT_GLOBAL_FONT[Name.GREEK] = `Archaic`;
CURRENT_GLOBAL_FONT[Name.LATIN] = DEFAULT_GLOBAL_FONT[Name.LATIN];

export function Current_Global_Font(
    language_name: Name,
):
    string
{
    Utils.Assert(
        CURRENT_GLOBAL_FONT.hasOwnProperty(language_name),
        `unknown language_name`,
    );

    return CURRENT_GLOBAL_FONT[language_name] as string;
}

export enum Direction
{
    LEFT_TO_RIGHT,
    RIGHT_TO_LEFT,
}

export function Default_Direction(
    language: Name,
):
    Direction
{
    if (language === Name.HEBREW) {
        return Direction.RIGHT_TO_LEFT;
    } else {
        return Direction.LEFT_TO_RIGHT;
    }
}

export function CSS_Font_Faces():
    string
{
    return `
        @font-face {
            font-family: "Cardo";
            src: url("${Utils.Resolve_Path(`fonts/Cardo/Cardo-Regular.ttf`)}");
        }
        @font-face {
            font-family: "Cardo Bold";
            src: url("${Utils.Resolve_Path(`fonts/Cardo/Cardo-Bold.ttf`)}");
        }
        @font-face {
            font-family: "Cardo Italic";
            src: url("${Utils.Resolve_Path(`fonts/Cardo/Cardo-Italic.ttf`)}");
        }

        @font-face {
            font-family: "Catrinity";
            src: url("${Utils.Resolve_Path(`fonts/Catrinity/Catrinity.otf`)}");
        }

        @font-face {
            font-family: "Ezra SIL";
            src: url("${Utils.Resolve_Path(`fonts/Ezra/SILEOT.ttf`)}");
        }
        @font-face {
            font-family: "Ezra SIL SR";
            src: url("${Utils.Resolve_Path(`fonts/Ezra/SILEOTSR.ttf`)}");
        }

        @font-face {
            font-family: "Galatia SIL";
            src: url("${Utils.Resolve_Path(`fonts/Galatia/GalSILR.ttf`)}");
        }
        @font-face {
            font-family: "Galatia SIL Bold";
            src: url("${Utils.Resolve_Path(`fonts/Galatia/GalSILB.ttf`)}");
        }

        @font-face {
            font-family: "GentiumPlusW";
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumPlus-Regular.woff2`)}");
        }
        @font-face {
            font-family: "GentiumPlusW";
            font-weight: bold;
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumPlus-Bold.woff2`)}");
        }
        @font-face {
            font-family: "GentiumPlusW";
            font-style: italic;
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumPlus-Italic.woff2`)}");
        }
        @font-face {
            font-family: "GentiumPlusW";
            font-weight: bold;
            font-style: italic;
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumPlus-BoldItalic.woff2`)}");
        }
        @font-face {
            font-family: "GentiumBookPlusW";
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumBookPlus-Regular.woff2`)}");
        }
        @font-face {
            font-family: "GentiumBookPlusW";
            font-weight: bold;
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumBookPlus-Bold.woff2`)}");
        }
        @font-face {
            font-family: "GentiumBookPlusW";
            font-style: italic;
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumBookPlus-Italic.woff2`)}");
        }
        @font-face {
            font-family: "GentiumBookPlusW";
            font-weight: bold;
            font-style: italic;
            src: url("${Utils.Resolve_Path(`fonts/Gentium/GentiumBookPlus-BoldItalic.woff2`)}");
        }

        @font-face {
            font-family: "Orkney-Regular";
            src: url("${Utils.Resolve_Path(`fonts/Orkney/Orkney Regular.ttf`)}");
        }

        @font-face {
            font-family: "Quivira";
            src: url("${Utils.Resolve_Path(`fonts/Quivira/Quivira.otf`)}");
        }

        @font-face {
            font-family: "Phoenician Ahiram";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/AHIRAM.TTF`)}");
        }
        @font-face {
            font-family: "Aramaic VIIBCE";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/AVIIBCE.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Square BenKosba";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/BENKOSBA.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Square Bet-Shearim";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/BETSHEAR.TTF`)}");
        }
        @font-face {
            font-family: "Aramaic Early Br Rkb";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/BR_RKB.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Paleo Gezer";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/GEZER.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Square Habakkuk";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/HABAKKUK.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Square Isaiah";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/ISAIAH.TTF`)}");
        }
        @font-face {
            font-family: "Keter Aram Tsova";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/KETERA.TTF`)}");
        }
        @font-face {
            font-family: "Keter YG Bold";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/KETYGB.TTF`)}");
        }
        @font-face {
            font-family: "Keter YG Bold Oblique";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/KETYGBO.TTF`)}");
        }
        @font-face {
            font-family: "Keter YG Medium";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/KETYGM.TTF`)}");
        }
        @font-face {
            font-family: "Keter YG Medium Oblique";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/KETYGMO.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Paleo Lachish";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/LACHISH.TTF`)}");
        }
        @font-face {
            font-family: "Makabi YG";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/MAKABIYG.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Paleo Mesha";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/MESHA.TTF`)}");
        }
        @font-face {
            font-family: "Proto Canaanite";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/PROTOCN.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Paleo Qumran";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/QUMRAN.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Samaritan";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/SAMARIT.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew Paleo Siloam";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/SILOAN.TTF`)}");
        }
        @font-face {
            font-family: "Hebrew-SoferStam Ashkenaz";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/STAM.TTF`)}");
        }
        @font-face {
            font-family: "Aramaic Imperial Yeb";
            src: url("${Utils.Resolve_Path(`fonts/Ancient_Semetic/YEB.TTF`)}");
        }

        @font-face {
            font-family: "Archaic Greek";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Archaic Greek.ttf`)}");
        }
        @font-face {
            font-family: "Greek Coin";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Greek Coin.ttf`)}");
        }
        @font-face {
            font-family: "Nahal Hever Scribe A";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Nahal Hever Scribe A.ttf`)}");
        }
        @font-face {
            font-family: "Nahal Hever Scribe B";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Nahal Hever Scribe B.ttf`)}");
        }
        @font-face {
            font-family: "Papyrus P66";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Papyrus P66.ttf`)}");
        }
        @font-face {
            font-family: "Papyrus P75";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Papyrus P75.ttf`)}");
        }
        @font-face {
            font-family: "Rosetta Greek";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Rosetta Stone.ttf`)}");
        }
        @font-face {
            font-family: "Sinaiticus";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Sinaiticus.ttf`)}");
        }
        @font-face {
            font-family: "Theodotus";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Theodotus.ttf`)}");
        }
        @font-face {
            font-family: "Washingtonensis";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Greek/Washingtonensis.ttf`)}");
        }
        @font-face {
            font-family: "Gezer Calendar";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Gezer Calendar.ttf`)}");
        }
        @font-face {
            font-family: "Hebrew Seals";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Hebrew Seals.ttf`)}");
        }
        @font-face {
            font-family: "Isaiah Scroll";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Isaiah Scroll.ttf`)}");
        }
        @font-face {
            font-family: "Ivory Pomegranate";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Ivory Pomegranate.ttf`)}");
        }
        @font-face {
            font-family: "Izbet Sartah";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Izbet Sartah.ttf`)}");
        }
        @font-face {
            font-family: "Ketef Hinnom  1";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Ketef Hinnom 1.ttf`)}");
        }
        @font-face {
            font-family: "Ketef Hinnom 2";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Ketef Hinnom 2.ttf`)}");
        }
        @font-face {
            font-family: "Lachish 3";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Lachish 3.ttf`)}");
        }
        @font-face {
            font-family: "Lachish 4";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Lachish 4.ttf`)}");
        }
        @font-face {
            font-family: "Lachish 5";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Lachish 5.ttf`)}");
        }
        @font-face {
            font-family: "Moabite Stone";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Moabite Stone.ttf`)}");
        }
        @font-face {
            font-family: "Nabataean";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Nabataean.ttf`)}");
        }
        @font-face {
            font-family: "Paleo Hebrew";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/PaleoHebrew.ttf`)}");
        }
        @font-face {
            font-family: "Protosinaitic";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Proto Sinaitic 13.ttf`)}");
        }
        @font-face {
            font-family: "Protosinaitic 1";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Proto-Sinaitic 15.ttf`)}");
        }
        @font-face {
            font-family: "Samritan Ostraca";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Samaria Ostraca.ttf`)}");
        }
        @font-face {
            font-family: "Samaritan";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Samaritan.ttf`)}");
        }
        @font-face {
            font-family: "Siloam Stone";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Siloam.ttf`)}");
        }
        @font-face {
            font-family: "Tel Dan Inscription";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Tel Dan.ttf`)}");
        }
        @font-face {
            font-family: "Tel Zayit";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Tel Zayit.ttf`)}");
        }
        @font-face {
            font-family: "Ugaritic";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Ugaritic.ttf`)}");
        }
        @font-face {
            font-family: "Yavneh Yam";
            src: url("${Utils.Resolve_Path(`fonts/Kris_J_Udd/Hebrew/Yavneh Yam.ttf`)}");
        }

        @font-face {
            font-family: "CustomHebrew";
            src: url("${Utils.Resolve_Path(`fonts/Neal/CustomHebrew.ttf`)}");
        }
    `;
}

export function Default_Global_CSS_Styles(
    language: Name | null,
):
    { [index: string]: string }
{
    if (language === Name.ENGLISH) {
        return {
            "font-family": `"Orkney-Regular"`,
            "font-size": `1em`,
            "line-height": `1.2`,
        };
    } else if (language === Name.HEBREW) {
        return {
            "font-family": `"Ezra SIL SR"`,
            "font-size": `1.125em`,
            "line-height": `1.45`,
        };
    } else if (language === Name.GREEK) {
        return Greek.Font_CSS_Styles(Default_Global_Font(Name.GREEK));
    } else if (language === Name.LATIN) {
        return {
            "font-family": `"GentiumPlusW"`,
            "font-size": `1.125em`,
            "line-height": `1.1`,
        };
    } else {
        return {
            "font-family": `sans-serif`,
            "font-size": `1em`,
            "line-height": `normal`,
        };
    }
}

export function Current_Global_CSS_Styles(
    language: Name | null,
):
    { [index: string]: string }
{
    if (language === Name.ENGLISH) {
        return {
            "font-family": `"Orkney-Regular"`,
            "font-size": `1em`,
            "line-height": `1.2`,
        };
    } else if (language === Name.HEBREW) {
        return {
            "font-family": `"Ezra SIL SR"`,
            "font-size": `1.125em`,
            "line-height": `1.45`,
        };
    } else if (language === Name.GREEK) {
        return Greek.Font_CSS_Styles(Current_Global_Font(Name.GREEK));
    } else if (language === Name.LATIN) {
        return {
            "font-family": `"GentiumPlusW"`,
            "font-size": `1.125em`,
            "line-height": `1.1`,
        };
    } else {
        return Default_Global_CSS_Styles(null);
    }
}

export function Adapt_Text_To_Default_Global_Font(
    language_name: Name,
    text: string,
):
    string
{
    if (language_name === Name.GREEK) {
        return Greek.Adapt_Text_To_Font(
            Default_Global_Font(Name.GREEK),
            text,
        );
    } else {
        return text;
    }
}

export function Adapt_Text_To_Current_Global_Font(
    language_name: Name,
    text: string,
):
    string
{
    if (language_name === Name.GREEK) {
        return Greek.Adapt_Text_To_Font(
            Current_Global_Font(Name.GREEK),
            text,
        );
    } else {
        return text;
    }
}
