import*as Language from"../../../model/language.js";import{Key}from"../../key.js";import*as Layout from"../instance.js";import*as Common from"./common.js";const VOWEL_POINTS_AND_ACCENTS=[[Key.SLASH],[[[Key.KEY_Q],"ׁ",!1],[[Key.BRACKET_LEFT],"ׁ",!1],[[Key.KEY_W],"ׂ",!1],[[Key.BRACKET_RIGHT],"ׂ",!1],[[Key.KEY_U],"ּ","ֻ"],[[Key.KEY_J],"ְ",!1],[[Key.COMMA],"ְ",!1],[[Key.KEY_A],"ַ","ֲ"],[[Key.KEY_E],"ֶ","ֱ"],[[Key.KEY_I],"ִ","ֵ"],[[Key.KEY_O],"ֹ","ֺ"],[[Key.KEY_V],"ָ","ֳ"],[[Key.KEY_R],"ֿ",!1]],Common.ACCENTS],ALTERNATES_AND_WIDES=[[Key.BACKSLASH],[[[Key.KEY_B],"׆",!1]],[[[Key.KEY_T],"ﬡ",!1],[[Key.KEY_S],"ﬢ",!1],[[Key.KEY_V],"ﬣ",!1],[[Key.KEY_F],"ﬤ",!1],[[Key.KEY_K],"ﬥ",!1],[[Key.KEY_O],"ﬦ",!1],[[Key.KEY_R],"ﬧ",!1],[[Key.COMMA],"ﬨ",!1]]];export class Instance extends Layout.Instance{constructor(){super({language_name:Language.Name.HEBREW,subset_name:"International",is_language_default:!1,combos_or_space:[[[Key.KEY_T],"א",!1],[[Key.KEY_C],"ב",!1],[[Key.KEY_D],"ג",!1],[[Key.KEY_S],"ד",!1],[[Key.KEY_V],"ה",!1],[[Key.KEY_U],"ו",!1],[[Key.KEY_Z],"ז",!1],[[Key.KEY_J],"ח",!1],[[Key.KEY_Y],"ט",!1],[[Key.KEY_H],"י",!1],[[Key.KEY_F],"כ",!1],[[Key.KEY_K],"ל",!1],[[Key.KEY_N],"מ",!1],[[Key.KEY_B],"נ","׆"],[[Key.KEY_X],"ס",!1],[[Key.KEY_G],"ע",!1],[[Key.KEY_P],"פ",!1],[[Key.KEY_M],"צ",!1],[[Key.KEY_E],"ק",!1],[[Key.KEY_R],"ר",!1],[[Key.KEY_A],"ש",!1],[[Key.COMMA],"ת",!1],[[Key.KEY_L],"ך",!1],[[Key.KEY_O],"ם",!1],[[Key.KEY_I],"ן",!1],[[Key.SEMICOLON],"ף","׃"],[[Key.PERIOD],"ץ",!1],[[Key.KEY_W],"־",!1],[[Key.KEY_Q],"׀",!1],[[Key.QUOTE],"׳","״"],[[Key.EQUAL],!1,"﬩"],[[Key.DIGIT_4],!1,"₪"],VOWEL_POINTS_AND_ACCENTS,ALTERNATES_AND_WIDES]})}}