import * as Utils from "../utils.js";

import * as Font from "./font.js";
import * as Language from "./language.js";

export class Instance
{
    private languages: { [language_name: string]: Language.Instance };

    constructor()
    {
        this.languages = {};
        this.languages[Language.Name.ENGLISH] = new Language.English.Instance();
        this.languages[Language.Name.HEBREW] = new Language.Hebrew.Instance();
        this.languages[Language.Name.GREEK] = new Language.Greek.Instance();
        this.languages[Language.Name.LATIN] = new Language.Latin.Instance();
        Object.freeze(this.languages);
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

    English():
        Language.English.Instance
    {
        return this.Language(Language.Name.ENGLISH) as Language.English.Instance;
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

    Direction(
        language_name: Language.Name,
    ):
        Language.Direction
    {
        return this.Language(language_name).Direction();
    }

    Default_Global_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return this.Language(language_name).Default_Font_Name();
    }

    Default_Global_Font_Styles(
        language_name: Language.Name,
    ):
        { [css_property: string]: string }
    {
        return this.Language(language_name).Default_Font_Styles();
    }

    Current_Global_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return this.Language(language_name).Current_Font_Name();
    }

    Current_Global_Font_Styles(
        language_name: Language.Name,
    ):
        { [css_property: string]: string }
    {
        return this.Language(language_name).Current_Font_Styles();
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

const SINGLETON: Instance = new Instance();
export function Singleton():
    Instance
{
    return SINGLETON;
}
