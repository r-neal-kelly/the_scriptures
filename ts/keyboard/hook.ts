import * as Language from "../model/language.js";
import * as Languages from "../model/languages.js";

import * as Layout from "./layout.js";

// We're still working on the signatures of some of these event handlers.
// For example we may require a View.Entity.Instance instead of a HTMLDivElement.

export class Instance
{
    async On_Change_Global_Layout(
        div: HTMLDivElement,
        layout: Layout.Instance | null,
    ):
        Promise<void>
    {
        const default_global_font_styles: { [css_property: string]: string } = layout != null ?
            Languages.Singleton().Default_Global_Font_Styles(layout.Language_Name()) :
            Languages.Singleton().Default_Global_Font_Styles(Language.Name.ENGLISH);

        for (const style of Object.entries(default_global_font_styles)) {
            (div.style as any)[style[0]] = style[1];
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
            div,
            data,
            range,
        }: {
            div: HTMLDivElement,
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
            div,
            data,
            range,
        }: {
            div: HTMLDivElement,
            data: string,
            range: Range,
        },
    ):
        Promise<void>
    {
        await this.On_Insert(
            {
                div: div,
                data: data,
                range: range,
            },
        );
    }

    async On_Delete(
        {
            div,
            range,
        }: {
            div: HTMLDivElement,
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
