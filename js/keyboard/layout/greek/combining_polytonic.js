import*as Language from"../../../model/language.js";import{Key}from"../../key.js";import*as Layout from"../instance.js";import*as Space from"../space.js";import*as Common from"./common.js";const SEPARATES=[[[Common.OXIA_AND_VARIA_KEY],"´","`",Space.IGNORE_CAPS_LOCK],[[Common.PERISPOMENI_AND_DIALYTIKA_KEY],"῀","¨",Space.IGNORE_CAPS_LOCK],[[Common.PSILI_AND_DASIA_KEY],"᾿","῾",Space.IGNORE_CAPS_LOCK],[[Common.PSILI_OXIA_AND_DASIA_OXIA_KEY],"῎","῞",Space.IGNORE_CAPS_LOCK],[[Common.PSILI_VARIA_AND_DASIA_VARIA_KEY],"῍","῝",Space.IGNORE_CAPS_LOCK],[[Common.PSILI_PERISPOMENI_AND_DASIA_PERISPOMENI_KEY],"῏","῟",Space.IGNORE_CAPS_LOCK],[[Common.DIALYTIKA_OXIA_AND_DIALYTIKA_VARIA_KEY],"΅","῭",Space.IGNORE_CAPS_LOCK],[[Common.DIALYTIKA_PERISPOMENI_KEY],"῁",Space.DEFAULT,Space.IGNORE_CAPS_LOCK],[[Common.IOTA_KEY],"ͺ","ι",Space.IGNORE_CAPS_LOCK],[[Common.MACRON_KEY],"¯",Space.DEFAULT,Space.IGNORE_CAPS_LOCK],[[Common.BREVE_KEY],"˘",Space.DEFAULT,Space.IGNORE_CAPS_LOCK]];export class Instance extends Layout.Instance{constructor(){super({language_name:Language.Name.GREEK,subset_name:"Combining Polytonic",is_language_default:!0,combos_or_space:[...Common.LETTERS_AND_PUNCTUATION,[[Key.SEMICOLON],"́","̀",Space.IGNORE_CAPS_LOCK],[[Key.SLASH],"͂","̈",Space.IGNORE_CAPS_LOCK],[[Key.QUOTE],"̓","̔",Space.IGNORE_CAPS_LOCK],[[Key.BACKSLASH],"ͅ","̓",Space.IGNORE_CAPS_LOCK],[[Key.BRACKET_RIGHT],"̄",Space.DEFAULT,Space.IGNORE_CAPS_LOCK],[[Key.BRACKET_LEFT],"̆",Space.DEFAULT,Space.IGNORE_CAPS_LOCK],[[Key.BACKQUOTE],SEPARATES,Space.DEFAULT,Space.IGNORE_CAPS_LOCK]]})}}