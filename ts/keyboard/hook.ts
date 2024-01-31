import { Float } from "../types.js";

import * as Language from "../model/language.js";
import * as Languages from "../model/languages.js";
import { Script_Position } from "../model/script_position.js";

import * as Keyboard from "./instance.js";
import * as Layout from "./layout.js";

export abstract class Instance
{
    private keyboard: Keyboard.Instance;
    private div: HTMLDivElement;

    constructor(
        {
            keyboard,
            div,
        }: {
            keyboard: Keyboard.Instance,
            div: HTMLDivElement,
        },
    )
    {
        this.keyboard = keyboard;
        this.div = div;
    }

    Keyboard():
        Keyboard.Instance
    {
        return this.keyboard;
    }

    Div():
        HTMLDivElement
    {
        return this.div;
    }

    Enable():
        void
    {
        if (!this.keyboard.Has_Div(this.div)) {
            this.div.setAttribute(`contentEditable`, `true`);
            this.keyboard.Add_Div(this.div, this);
        }
    }

    Disable():
        void
    {
        if (this.keyboard.Has_Div(this.div)) {
            this.keyboard.Remove_Div(this.div);
            this.div.setAttribute(`contentEditable`, `false`);
        }
    }

    abstract Underlying_Font_Size_PX():
        Float;

    async On_Change_Underlying_Font_Size_PX():
        Promise<void>
    {
        await this.Update_Language_Styles(
            this.keyboard.Current_Language_Name(),
        );
    }

    async On_Change_Global_Layout(
        layout: Layout.Instance | null,
    ):
        Promise<void>
    {
        await this.Update_Language_Styles(
            layout != null ?
                layout.Language_Name() :
                Language.Name.ENGLISH,
        );
    }

    async On_Try_Change_Language_Direction(
        language_direction: Language.Direction,
    ):
        Promise<boolean>
    {
        return true;
    }

    private async Update_Language_Styles(
        language_name: Language.Name,
    ):
        Promise<void>
    {
        const language_direction: Language.Direction =
            Languages.Singleton().Direction(language_name);
        const default_global_font_styles: { [css_property: string]: string } =
            Languages.Singleton().Default_Global_Font_Styles(
                language_name,
                this.Underlying_Font_Size_PX(),
                Script_Position.DEFAULT,
            );

        for (const style of Object.entries(default_global_font_styles)) {
            (this.div.style as any)[style[0]] = style[1];
        }

        if (language_direction === Language.Direction.LEFT_TO_RIGHT) {
            if (
                (this.div.style as any)[`direction`] !== `ltr` &&
                await this.On_Try_Change_Language_Direction(language_direction)
            ) {
                (this.div.style as any)[`direction`] = `ltr`;
            }
        } else {
            if (
                (this.div.style as any)[`direction`] !== `rtl` &&
                await this.On_Try_Change_Language_Direction(language_direction)
            ) {
                (this.div.style as any)[`direction`] = `rtl`;
            }
        }
    }

    async On_Key_Down(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
    }

    async On_Key_Up(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
    }

    async On_Insert(
        {
            data,
            range,
        }: {
            data: string,
            range: Range,
        },
    ):
        Promise<void>
    {
        const node: Text = document.createTextNode(data);

        range.deleteContents();
        range.insertNode(node);

        const selection: Selection | null = document.getSelection();

        if (selection) {
            selection.collapse(node, (node.nodeValue as string).length);
        }

        if (node.parentElement != null) {
            node.parentElement.scrollIntoView(
                {
                    behavior: `instant` as ScrollBehavior,
                    block: `nearest`,
                    inline: `nearest`,
                } as ScrollIntoViewOptions,
            );
        }

        // range.surroundContents() may be helpful too,
        // by selecting the nodes before and after?
    }

    async On_Paste(
        {
            data,
            range,
        }: {
            data: string,
            range: Range,
        },
    ):
        Promise<void>
    {
        await this.On_Insert(
            {
                data: data,
                range: range,
            },
        );
    }

    async On_Delete(
        {
            range,
        }: {
            range: Range,
        },
    ):
        Promise<void>
    {
        range.deleteContents();
    }

    async After_Insert_Or_Paste_Or_Delete():
        Promise<void>
    {
    }
}
