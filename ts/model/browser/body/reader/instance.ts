import * as Entity from "../../../entity.js";
import * as Font from "../../../font.js";
import * as Language from "../../../language.js";
import * as Languages from "../../../languages.js";
import * as Data from "../../../data.js";
import * as Text from "../../../text.js";
import * as Buffer from "../../../buffer.js";
import * as Body from "../instance.js";

export class Instance extends Entity.Instance
{
    private static blank_file: Buffer.Text.Instance = new Buffer.Text.Instance(
        {
            default_language_name: Language.Name.ENGLISH,
            default_font_name: Languages.Singleton().Default_Global_Font_Name(Language.Name.ENGLISH),
            override_font_name: function (
                language_name: Language.Name,
            ):
                Font.Name
            {
                return Languages.Singleton().Default_Global_Font_Name(language_name);
            },

            text: new Text.Instance(
                {
                    dictionary: new Text.Dictionary.Instance(
                        {
                            json: null,
                        },
                    ),
                    value: ``,
                },
            ),
            allow_errors: false,
        },
    );

    static Blank_File():
        Buffer.Text.Instance
    {
        return this.blank_file;
    }

    private body: Body.Instance;
    private current_data: Data.File.Instance | null;
    private current_file: Buffer.Text.Instance;

    constructor(
        {
            body,
        }: {
            body: Body.Instance,
        },
    )
    {
        super();

        this.body = body;
        this.current_data = null;
        this.current_file = Instance.Blank_File();

        this.Add_Dependencies(
            [
                this.current_file,
            ],
        );
    }

    Body():
        Body.Instance
    {
        return this.body;
    }

    Maybe_Current_Data():
        Data.File.Instance | null
    {
        return this.current_data;
    }

    File():
        Buffer.Text.Instance
    {
        return this.current_file;
    }

    async Refresh_File(
        force: boolean = false,
    ):
        Promise<void>
    {
        const new_data: Data.File.Instance | null =
            this.Body().Selector().Maybe_File();
        if (new_data != null) {
            const default_language_name: Language.Name | null =
                new_data.Default_Language_Name();
            const default_font_name: Font.Name | null =
                this.Body().Font_Selector().Some_Selected_Font_Name(default_language_name);
            const allows_errors: boolean =
                this.Body().Browser().Commander().Allow_Errors().Is_Activated();
            if (
                force ||
                this.Maybe_Current_Data() != new_data ||
                this.current_file.Default_Font_Name() != default_font_name ||
                this.current_file.Allows_Errors() != allows_errors
            ) {
                this.current_data = new_data;
                this.current_file = new Buffer.Text.Instance(
                    {
                        default_language_name: default_language_name,
                        default_font_name: default_font_name,
                        override_font_name: function (
                            this: Instance,
                            language_name: Language.Name,
                        ):
                            Font.Name
                        {
                            return this.Body()
                                .Font_Selector()
                                .Some_Selected_Font_Name(language_name);
                        }.bind(this),

                        text: await new_data.Text(),
                        allow_errors: allows_errors,
                    },
                );
                await this.current_file.Ready();
            }
        } else {
            if (
                force ||
                this.Maybe_Current_Data() != null
            ) {
                this.current_data = new_data;
                this.current_file = Instance.Blank_File();
                await this.current_file.Ready();
            }
        }
    }
}
