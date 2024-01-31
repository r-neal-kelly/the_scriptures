import { Float } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Font from "../font.js";
import { Script_Position } from "../script_position.js";

import { Name } from "./name.js";
import { Direction } from "./direction.js";
import * as Font_Adaptor from "./font_adaptor.js";

export class Instance
{
    private name: Name;
    private direction: Direction;

    private font_names: Array<Font.Name>;
    private short_font_names: Array<string>;
    private font_name_to_short_font_names: { [font_name: string]: string };
    private short_font_name_to_font_names: { [short_font_name: string]: Font.Name };
    private default_font_name: Font.Name;
    private current_font_name: Font.Name;
    private font_adaptors: { [font_name: string]: Font_Adaptor.Instance };

    constructor(
        {
            name,
            direction,

            default_font_name,
            current_font_name = default_font_name,
            font_adaptors,
        }: {
            name: Name,
            direction: Direction,

            default_font_name: Font.Name,
            current_font_name?: Font.Name,
            font_adaptors: Array<Font_Adaptor.Instance>,
        },
    )
    {
        this.name = name;
        this.direction = direction;

        this.font_names = [];
        this.short_font_names = [];
        this.font_name_to_short_font_names = {};
        this.short_font_name_to_font_names = {};
        this.default_font_name = default_font_name;
        this.current_font_name = current_font_name;
        this.font_adaptors = {};

        for (const font_adaptor of font_adaptors) {
            const font_name: Font.Name = font_adaptor.Font().Name();
            const short_font_name: string = font_adaptor.Short_Font_Name();

            this.font_names.push(font_name);
            this.short_font_names.push(short_font_name);

            Utils.Assert(
                !this.font_name_to_short_font_names.hasOwnProperty(font_name),
                `cannot have the same font_name for multiple fonts`,
            );
            this.font_name_to_short_font_names[font_name] = short_font_name;
            Utils.Assert(
                !this.short_font_name_to_font_names.hasOwnProperty(short_font_name),
                `cannot have the same short_font_name for multiple fonts`,
            );
            this.short_font_name_to_font_names[short_font_name] = font_name;

            Utils.Assert(
                !this.font_adaptors.hasOwnProperty(font_name),
                `can only have one adaptor per font_name`,
            );
            this.font_adaptors[font_name] = font_adaptor;
        }
        this.font_names.sort();
        this.short_font_names.sort();

        Object.freeze(this.font_names);
        Object.freeze(this.short_font_names);
        Object.freeze(this.short_font_name_to_font_names);
        Object.freeze(this.font_adaptors);

        Utils.Assert(
            this.Has_Font_Adaptor(this.Default_Font_Name()),
            `missing font_adaptor for default_font_name: ${default_font_name}`,
        );
        Utils.Assert(
            this.Has_Font_Adaptor(this.Current_Font_Name()),
            `missing font_adaptor for current_font_name: ${current_font_name}`,
        );
    }

    Name():
        Name
    {
        return this.name;
    }

    Direction():
        Direction
    {
        return this.direction;
    }

    Font_Names():
        Array<Font.Name>
    {
        return Array.from(this.font_names);
    }

    Short_Font_Names():
        Array<string>
    {
        return Array.from(this.short_font_names);
    }

    Font_Name_To_Short_Font_Name(
        font_name: Font.Name,
    ):
        string
    {
        Utils.Assert(
            this.font_name_to_short_font_names.hasOwnProperty(font_name),
            `does not have font_name: ${font_name}`,
        );

        return this.font_name_to_short_font_names[font_name];
    }

    Short_Font_Name_To_Font_Name(
        short_font_name: string,
    ):
        Font.Name
    {
        Utils.Assert(
            this.short_font_name_to_font_names.hasOwnProperty(short_font_name),
            `does not have short_font_name: ${short_font_name}`,
        );

        return this.short_font_name_to_font_names[short_font_name];
    }

    Font_Styles(
        font_name: Font.Name,
        underlying_font_size_px: Float,
        script_position: Script_Position,
    ):
        { [css_property: string]: string }
    {
        return this.Some_Font_Adaptor(font_name).Styles(
            underlying_font_size_px,
            script_position,
        );
    }

    Default_Font_Name():
        Font.Name
    {
        return this.default_font_name;
    }

    Default_Short_Font_Name():
        string
    {
        return this.Font_Name_To_Short_Font_Name(this.Default_Font_Name());
    }

    Default_Font_Styles(
        underlying_font_size_px: Float,
        script_position: Script_Position,
    ):
        { [css_property: string]: string }
    {
        return this.Font_Styles(
            this.Default_Font_Name(),
            underlying_font_size_px,
            script_position,
        );
    }

    Current_Font_Name():
        Font.Name
    {
        return this.current_font_name;
    }

    Set_Current_Font_Name(
        font_name: Font.Name,
    ):
        void
    {
        Utils.Assert(
            this.Has_Font_Adaptor(font_name),
            `missing font_adaptor for font_name: ${font_name}`,
        );

        this.current_font_name = font_name;
    }

    Current_Short_Font_Name():
        string
    {
        return this.Font_Name_To_Short_Font_Name(this.Current_Font_Name());
    }

    Current_Font_Styles(
        underlying_font_size_px: Float,
        script_position: Script_Position,
    ):
        { [css_property: string]: string }
    {
        return this.Font_Styles(
            this.Current_Font_Name(),
            underlying_font_size_px,
            script_position,
        );
    }

    Has_Font_Adaptor(
        font_name: Font.Name,
    ):
        boolean
    {
        return this.font_adaptors.hasOwnProperty(font_name);
    }

    Some_Font_Adaptor(
        font_name: Font.Name,
    ):
        Font_Adaptor.Instance
    {
        Utils.Assert(
            this.Has_Font_Adaptor(font_name),
            `missing font_adaptor for font_name: ${font_name}`,
        );

        return this.font_adaptors[font_name];
    }

    Adapt_Text_To_Font(
        {
            text,
            font_name = this.Current_Font_Name(),
        }: {
            text: string,
            font_name?: Font.Name,
        },
    ):
        string
    {
        return this.Some_Font_Adaptor(font_name).Treat_Text(text);
    }

    Adapt_Text_To_Default_Font(
        text: string,
    ):
        string
    {
        return this.Adapt_Text_To_Font(
            {
                text: text,
                font_name: this.Default_Font_Name(),
            },
        );
    }

    Adapt_Text_To_Current_Font(
        text: string,
    ):
        string
    {
        return this.Adapt_Text_To_Font(
            {
                text: text,
                font_name: this.Current_Font_Name(),
            },
        );
    }
}
