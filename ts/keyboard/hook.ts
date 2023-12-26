// We're still working on the signatures of some of these event handlers.

export class Instance
{
    async On_Insert(
        {
            div,
            data,
            target_range,
        }: {
            div: HTMLDivElement,
            data: string,
            target_range: StaticRange,
        },
    ):
        Promise<void>
    {
        const range: Range = document.createRange();
        const node: Text = document.createTextNode(``);

        // This must be done to ensure we have spaces,
        // and the appropriate number of them.
        // It does not work when passing through ctor,
        // at least in some/all chromium based browsers.
        node.nodeValue = data.replace(/ /g, ` `);

        range.setStart(target_range.startContainer, target_range.startOffset);
        range.setEnd(target_range.endContainer, target_range.endOffset);

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
        // we currently don't cancel so we don't need to fill
    }

    async On_Delete(
        event: InputEvent,
    ):
        Promise<void>
    {
        // we currently don't cancel so we don't need to fill
    }

    async After_Insert_Or_Paste_Or_Delete(
        event: InputEvent,
    ):
        Promise<void>
    {
    }
}
