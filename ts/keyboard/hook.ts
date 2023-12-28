// We're still working on the signatures of some of these event handlers.

export class Instance
{
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

        // range.surroundContents() may be helpful too,
        // by selecting the nodes before and after?

        const selection: Selection | null = document.getSelection();

        if (selection) {
            selection.collapse(node, (node.nodeValue as string).length);
        }
    }

    async On_Paste(
        event: InputEvent,
    ):
        Promise<void>
    {
    }

    async On_Delete(
        event: InputEvent,
    ):
        Promise<void>
    {
    }

    async After_Insert_Or_Paste_Or_Delete():
        Promise<void>
    {
    }
}
