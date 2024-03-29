import { Float } from "../types.js";

import * as Utils from "../utils.js";

import * as Font from "./font.js";
import * as Language from "./language.js";
import * as Name_Sorter from "./name_sorter.js";
import { Script_Position } from "./script_position.js";

export class Instance
{
    private languages: { [language_name: string]: Language.Instance };
    private language_names: Array<Language.Name>;

    constructor()
    {
        this.languages = {};
        this.language_names = [];

        for (const language of [
            new Language.Hebrew.Instance(),
            new Language.Greek.Instance(),
            new Language.Latin.Instance(),
            new Language.Aramaic.Instance(),
            new Language.Geez.Instance(),
            new Language.Arabic.Instance(),
            new Language.German.Instance(),
            new Language.French.Instance(),
            new Language.Italian.Instance(),
            new Language.Dutch.Instance(),
            new Language.English.Instance(),
        ]) {
            const language_name: Language.Name = language.Name();
            this.languages[language_name] = language;
            this.language_names.push(language_name);
        }
        this.language_names =
            Name_Sorter.Singleton().With_Array(
                Name_Sorter.Type.LANGUAGES,
                this.language_names,
            ) as Array<Language.Name>;

        Object.freeze(this.languages);
        Object.freeze(this.language_names);
    }

    Has_Language(
        language_name: Language.Name,
    ):
        boolean
    {
        return this.languages.hasOwnProperty(language_name);
    }

    Language(
        language_name: Language.Name,
    ):
        Language.Instance
    {
        Utils.Assert(
            this.Has_Language(language_name),
            `does not have language_name: ${language_name}`,
        );

        return this.languages[language_name];
    }

    Language_Names():
        Array<Language.Name>
    {
        return Array.from(this.language_names);
    }

    Hebrew():
        Language.Hebrew.Instance
    {
        return this.Language(Language.Name.HEBREW) as Language.Hebrew.Instance;
    }

    Greek():
        Language.Greek.Instance
    {
        return this.Language(Language.Name.GREEK) as Language.Greek.Instance;
    }

    Latin():
        Language.Latin.Instance
    {
        return this.Language(Language.Name.LATIN) as Language.Latin.Instance;
    }

    Aramaic():
        Language.Aramaic.Instance
    {
        return this.Language(Language.Name.ARAMAIC) as Language.Aramaic.Instance;
    }

    Geez():
        Language.Geez.Instance
    {
        return this.Language(Language.Name.GEEZ) as Language.Geez.Instance;
    }

    Arabic():
        Language.Arabic.Instance
    {
        return this.Language(Language.Name.ARABIC) as Language.Arabic.Instance;
    }

    German():
        Language.German.Instance
    {
        return this.Language(Language.Name.GERMAN) as Language.German.Instance;
    }

    French():
        Language.French.Instance
    {
        return this.Language(Language.Name.FRENCH) as Language.French.Instance;
    }

    Italian():
        Language.Italian.Instance
    {
        return this.Language(Language.Name.ITALIAN) as Language.Italian.Instance;
    }

    Dutch():
        Language.Dutch.Instance
    {
        return this.Language(Language.Name.DUTCH) as Language.Dutch.Instance;
    }

    English():
        Language.English.Instance
    {
        return this.Language(Language.Name.ENGLISH) as Language.English.Instance;
    }

    Direction(
        language_name: Language.Name,
    ):
        Language.Direction
    {
        return this.Language(language_name).Direction();
    }

    Global_Font_Names(
        language_name: Language.Name,
    ):
        Array<Font.Name>
    {
        return this.Language(language_name).Font_Names();
    }

    Global_Short_Font_Names(
        language_name: Language.Name,
    ):
        Array<string>
    {
        return this.Language(language_name).Short_Font_Names();
    }

    Font_Name_To_Short_Font_Name(
        language_name: Language.Name,
        font_name: Font.Name,
    ):
        string
    {
        return this.Language(language_name).Font_Name_To_Short_Font_Name(font_name);
    }

    Short_Font_Name_To_Font_Name(
        language_name: Language.Name,
        short_font_name: string,
    ):
        Font.Name
    {
        return this.Language(language_name).Short_Font_Name_To_Font_Name(short_font_name);
    }

    Font_Styles(
        {
            language_name,
            font_name,
            underlying_font_size_px,
            underlying_font_size_multiplier,
            script_position,
        }: {
            language_name: Language.Name,
            font_name: Font.Name,
            underlying_font_size_px: Float,
            underlying_font_size_multiplier: Float,
            script_position: Script_Position,
        },
    ):
        { [css_property: string]: string }
    {
        return this.Language(language_name).Font_Styles(
            {
                font_name: font_name,
                underlying_font_size_px: underlying_font_size_px,
                underlying_font_size_multiplier: underlying_font_size_multiplier,
                script_position: script_position,
            },
        );
    }

    Default_Global_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return this.Language(language_name).Default_Font_Name();
    }

    Default_Global_Short_Font_Name(
        language_name: Language.Name,
    ):
        string
    {
        return this.Language(language_name).Default_Short_Font_Name();
    }

    Default_Global_Font_Styles(
        {
            language_name,
            underlying_font_size_px,
            underlying_font_size_multiplier,
            script_position,
        }: {
            language_name: Language.Name,
            underlying_font_size_px: Float,
            underlying_font_size_multiplier: Float,
            script_position: Script_Position,
        },
    ):
        { [css_property: string]: string }
    {
        return this.Language(language_name).Default_Font_Styles(
            {
                underlying_font_size_px: underlying_font_size_px,
                underlying_font_size_multiplier: underlying_font_size_multiplier,
                script_position: script_position,
            },
        );
    }

    Current_Global_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return this.Language(language_name).Current_Font_Name();
    }

    Set_Current_Global_Font_Name(
        language_name: Language.Name,
        font_name: Font.Name,
    ):
        void
    {
        this.Language(language_name).Set_Current_Font_Name(font_name);
    }

    Current_Global_Short_Font_Name(
        language_name: Language.Name,
    ):
        string
    {
        return this.Language(language_name).Current_Short_Font_Name();
    }

    Current_Global_Font_Styles(
        {
            language_name,
            underlying_font_size_px,
            underlying_font_size_multiplier,
            script_position,
        }: {
            language_name: Language.Name,
            underlying_font_size_px: Float,
            underlying_font_size_multiplier: Float,
            script_position: Script_Position,
        },
    ):
        { [css_property: string]: string }
    {
        return this.Language(language_name).Current_Font_Styles(
            {
                underlying_font_size_px: underlying_font_size_px,
                underlying_font_size_multiplier: underlying_font_size_multiplier,
                script_position: script_position,
            },
        );
    }

    Adapt_Text_To_Font(
        {
            language_name,
            text,
            font_name,
        }: {
            language_name: Language.Name,
            text: string,
            font_name: Font.Name,
        },
    ):
        string
    {
        return this.Language(language_name).Adapt_Text_To_Font(
            {
                text: text,
                font_name: font_name,
            },
        );
    }

    Adapt_Text_To_Default_Global_Font(
        {
            language_name,
            text,
        }: {
            language_name: Language.Name,
            text: string,
        },
    ):
        string
    {
        return this.Language(language_name).Adapt_Text_To_Default_Font(text);
    }

    Adapt_Text_To_Current_Global_Font(
        {
            language_name,
            text,
        }: {
            language_name: Language.Name,
            text: string,
        },
    ):
        string
    {
        return this.Language(language_name).Adapt_Text_To_Current_Font(text);
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
