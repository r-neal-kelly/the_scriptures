function Assert(
    boolean_statement: boolean
):
    void
{
    if (boolean_statement === false) {
        throw new Error(`Failed assert.`);
    }
}

function Escape_Text(
    text: String,
):
    string
{
    return text.replaceAll(
        /./g,
        function (point: string):
            string
        {
            return `&#${point.charCodeAt(0)};`;
        }
    );
}

function Text_Offset_To_Node(
    from: Node,
    to: Node,
):
    number
{
    if (from === to) {
        return 0;
    } else {
        let offset: number = 0;

        for (const child_node of from.childNodes) {
            if (child_node === to) {
                return offset;
            } else if (child_node.contains(to)) {
                return offset + Text_Offset_To_Node(child_node, to);
            } else {
                if (child_node.textContent) {
                    offset += child_node.textContent.length;
                } else {
                    offset += 0;
                }
            }
        }

        return offset;
    }
};

function Text_Offset(
    element: HTMLElement,
):
    number | null
{
    const selection: Selection | null = document.getSelection();
    if (selection) {
        if (selection.isCollapsed) {
            if (selection.anchorNode) {
                return Text_Offset_To_Node(element, selection.anchorNode) + selection.anchorOffset;
            } else {
                return null;
            }
        } else {
            if (selection.anchorNode && selection.focusNode) {
                if (selection.anchorOffset < selection.focusOffset) {
                    return Text_Offset_To_Node(element, selection.anchorNode) + selection.anchorOffset;
                } else {
                    return Text_Offset_To_Node(element, selection.focusNode) + selection.focusOffset;
                }
            } else {
                return null;
            }
        }
    } else {
        return null;
    }
}

function Set_Text_Offset(
    element: HTMLElement,
    offset: number,
):
    void
{
    class Node_And_Offset
    {
        public node: Node;
        public offset: number;

        constructor(
            {
                node,
                offset,
            }: {
                node: Node,
                offset: number,
            },
        )
        {
            this.node = node;
            this.offset = offset;
        }
    };

    function Text_Offset_To_Node_And_Offset(
        node: Node,
        target_offset: number,
        current_offset: number = 0,
    ):
        Node_And_Offset | number
    {
        for (const child_node of node.childNodes) {
            if (child_node instanceof Text) {
                const text_length: number = child_node.textContent ?
                    child_node.textContent.length :
                    0;
                current_offset += text_length;
                if (current_offset >= target_offset) {
                    return new Node_And_Offset(
                        {
                            node: child_node,
                            offset: target_offset - (current_offset - text_length),
                        }
                    );
                }
            } else {
                const maybe_node_and_offset = Text_Offset_To_Node_And_Offset(
                    child_node,
                    target_offset,
                    current_offset,
                );

                if (maybe_node_and_offset instanceof Node_And_Offset) {
                    return maybe_node_and_offset as Node_And_Offset;
                } else {
                    current_offset = maybe_node_and_offset as number;
                }
            }
        }

        return current_offset;
    }

    element.focus();

    const selection: Selection | null = document.getSelection();
    if (selection) {
        const maybe_node_and_offset: Node_And_Offset | number = Text_Offset_To_Node_And_Offset(
            element,
            offset,
        );

        if (maybe_node_and_offset instanceof Node_And_Offset) {
            selection.collapse(
                maybe_node_and_offset.node,
                maybe_node_and_offset.offset,
            );
        } else {
            selection.collapse(
                element,
                maybe_node_and_offset as number,
            );
        }
    }
}

class Line
{
    private editor: Editor;

    private parent: HTMLElement;
    private element: HTMLDivElement;
    private children: {
    };

    constructor(
        {
            editor,
            parent,
        }: {
            editor: Editor,
            parent: HTMLElement,
        },
    )
    {
        this.editor = editor;

        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {
        };

        this.element.setAttribute(
            `contentEditable`,
            `true`,
        );
        this.element.setAttribute(
            `spellcheck`,
            `false`,
        );
        this.element.setAttribute(
            `style`,
            `
                width: 100%;

                border-width: 0 0 1px 0;
                border-color: rgba(255, 255, 255, 0.7);
                border-style: solid;
            `,
        );

        this.element.addEventListener(
            `keydown`,
            function (
                this: Line,
                event: KeyboardEvent,
            ):
                void
            {
                if (event.key === `Enter`) {
                    event.preventDefault();

                    const selection: Selection | null = document.getSelection();
                    if (selection) {
                        const line_text: string = this.Text();
                        let line_text_a: string;
                        let line_text_b: string;
                        if (selection.isCollapsed) {
                            Assert(selection.anchorNode !== null);

                            const at: number =
                                Text_Offset_To_Node(
                                    this.Element(),
                                    selection.anchorNode as Node,
                                ) +
                                selection.anchorOffset;

                            line_text_a = line_text.slice(0, at);
                            line_text_b = line_text.slice(at, line_text.length);
                        } else {
                            Assert(selection.anchorNode !== null);
                            Assert(selection.focusNode !== null);

                            let start_node: Node;
                            let start_offset: number;
                            let stop_node: Node;
                            let stop_offset: number;
                            if (selection.anchorOffset < selection.focusOffset) {
                                start_node = selection.anchorNode as Node;
                                start_offset = selection.anchorOffset;
                                stop_node = selection.focusNode as Node;
                                stop_offset = selection.focusOffset;
                            } else {
                                start_node = selection.focusNode as Node;
                                start_offset = selection.focusOffset;
                                stop_node = selection.anchorNode as Node;
                                stop_offset = selection.anchorOffset;
                            }

                            const top_node: Node = this.Element();
                            const from: number =
                                Text_Offset_To_Node(
                                    top_node,
                                    start_node
                                ) +
                                start_offset;
                            const to: number =
                                Text_Offset_To_Node(
                                    top_node,
                                    stop_node
                                ) +
                                stop_offset;

                            line_text_a = line_text.slice(0, from);
                            line_text_b = line_text.slice(to, line_text.length);
                        }

                        const line_index: number = this.Index();
                        this.Set_Text(line_text_a);
                        this.Editor().Insert_Line(line_index + 1, line_text_b);
                        this.Editor().Line(line_index + 1).Element().focus();
                    }
                } else if (event.key === `Backspace`) {
                    const selection: Selection | null = document.getSelection();
                    if (selection) {
                        const line_index: number = this.Index();
                        const text_offset: number = Text_Offset(this.element) as number;
                        if (line_index > 0 && selection.isCollapsed && text_offset === 0) {
                            event.preventDefault();

                            // we destroy this line and combine its text with the previous line.
                            const previous: Line = this.Editor().Line(line_index - 1);
                            const previous_text: string = previous.Text();

                            previous.Set_Text(`${previous_text}${this.Text()}`);
                            this.Editor().Remove_Line(line_index);
                            Set_Text_Offset(previous.Element(), previous_text.length);
                        }
                    }
                }
            }.bind(this),
        );
        this.element.addEventListener(
            `input`,
            function (
                this: Line,
                event: Event,
            ):
                void
            {
                const input_event: InputEvent = event as InputEvent;
                if (
                    input_event.inputType === `insertText` ||
                    input_event.inputType === `deleteContentBackward` ||
                    input_event.inputType === `insertFromPaste`
                ) {
                    const text_offset: number = Text_Offset(this.element) as number;

                    this.Set_Text(this.Text());
                    Set_Text_Offset(this.element, text_offset);
                }
            }.bind(this),
        );

        this.parent.appendChild(this.element);
    }

    Destruct():
        void
    {
        this.parent.removeChild(this.element);
    }

    Editor():
        Editor
    {
        return this.editor;
    }

    Parent():
        HTMLElement
    {
        return this.parent;
    }

    Element():
        HTMLDivElement
    {
        return this.element;
    }

    Index():
        number
    {
        const index: number = this.Editor().Lines().indexOf(this);
        Assert(index > -1);

        return index;
    }

    Text():
        string
    {
        return this.element.textContent || ``;
    }

    Set_Text(
        text: string,
    ):
        void
    {
        this.element.innerHTML = Escape_Text(text)
            .replaceAll(
                /&#[^;]+;/g,
                function (
                    substring: string,
                ):
                    string
                {
                    return `<span class="Unknown_Point">${substring}</span>`;
                },
            );
    }
}

class Editor
{
    private parent: HTMLElement;
    private element: HTMLDivElement;
    private children: {
        commands: HTMLDivElement,
        load_input: HTMLInputElement,
        load_button: HTMLDivElement,
        save_button: HTMLDivElement,

        name: HTMLDivElement,

        lines: HTMLDivElement,
    };

    private lines: Array<Line>;

    constructor(
        {
            parent,
        }: {
            parent: HTMLElement,
        },
    )
    {
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {
            commands: document.createElement(`div`),
            load_input: document.createElement(`input`),
            load_button: document.createElement(`div`),
            save_button: document.createElement(`div`),

            name: document.createElement(`div`),

            lines: document.createElement(`div`),
        };

        this.element.setAttribute(
            `style`,
            `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                height: 90%;
                width: 90%;
                padding: 2px;

                border-width: 0;

                background-color: blue;
                color: white;

                overflow-y: auto;
            `,
        );

        this.children.commands.setAttribute(
            `style`,
            `
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                width: 100%;
                height: 5%;
            `,
        );

        this.children.load_input.setAttribute(
            `type`,
            `file`,
        );
        this.children.load_input.setAttribute(
            `accept`,
            `text/plain`,
        );
        this.children.load_input.setAttribute(
            `style`,
            `
                display: none;
            `,
        );
        this.children.load_input.addEventListener(
            `input`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (this.children.load_input.files && this.children.load_input.files[0]) {
                    const file: File = this.children.load_input.files[0];
                    const file_text: string = await file.text();
                    this.Set_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Text(file_text);
                    this.children.load_input.value = ``;

                    Assert(this.Text() === file_text.replaceAll(/\r/g, ``));
                }
            }.bind(this),
        );

        this.children.load_button.setAttribute(
            `style`,
            `
                width: 50%;
                height: 100%;
            `,
        );
        this.children.load_button.textContent = `Load`;
        this.children.load_button.addEventListener(
            `click`,
            function (
                this: Editor,
                event: Event,
            ):
                void
            {
                this.children.load_input.click();
            }.bind(this),
        );

        this.children.save_button.setAttribute(
            `style`,
            `
                width: 50%;
                height: 100%;
            `,
        );
        this.children.save_button.textContent = `Save`;
        this.children.save_button.addEventListener(
            `click`,
            function (
                this: Editor,
                event: Event,
            ):
                void
            {
                this.Save_Text();
            }.bind(this),
        );

        this.children.name.setAttribute(
            `contentEditable`,
            `true`,
        );
        this.children.name.setAttribute(
            `spellcheck`,
            `false`,
        );
        this.children.name.setAttribute(
            `style`,
            `
                width: 100%;
                height: 5%;
            `,
        );
        this.children.name.addEventListener(
            `keydown`,
            function (
                this: Editor,
                event: KeyboardEvent,
            ):
                void
            {
                if (event.key === `Enter`) {
                    event.preventDefault();
                }
            }.bind(this),
        );
        this.children.name.addEventListener(
            `input`,
            function (
                this: Editor,
                event: Event,
            ):
                void
            {
                const input_event: InputEvent = event as InputEvent;
                if (input_event.inputType === `insertFromPaste`) {
                    const selection: Selection | null = document.getSelection();
                    if (
                        selection &&
                        selection.anchorNode &&
                        selection.anchorNode !== this.children.name
                    ) {
                        let new_offset: number =
                            Text_Offset_To_Node(this.children.name, selection.anchorNode) +
                            selection.anchorOffset;

                        this.children.name.innerHTML = this.children.name.textContent || ``

                        selection.collapse(
                            this.children.name.firstChild || this.children.name,
                            new_offset,
                        );
                    } else {
                        this.children.name.innerHTML = ``;
                    }
                }
            }.bind(this),
        );
        this.Set_Name(`new_text`);

        this.children.lines.setAttribute(
            `style`,
            `
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: start;
                
                width: 100%;
                height: 90%;
                padding: 2px;

                border-width: 2px;
                border-color: rgba(255, 255, 255, 0.7);
                border-style: solid;

                overflow-y: auto;
            `,
        );

        this.children.commands.appendChild(this.children.load_input);
        this.children.commands.appendChild(this.children.load_button);
        this.children.commands.appendChild(this.children.save_button);

        this.element.appendChild(this.children.commands);
        this.element.appendChild(this.children.name);
        this.element.appendChild(this.children.lines);

        this.parent.appendChild(this.element);

        this.lines = [];

        this.Add_Line(``);
    }

    Parent():
        HTMLElement
    {
        return this.parent;
    }

    Element():
        HTMLDivElement
    {
        return this.element;
    }

    Name():
        string
    {
        return this.children.name.textContent || ``;
    }

    Set_Name(
        name: string,
    ):
        void
    {
        this.children.name.innerHTML = Escape_Text(name);
    }

    Text():
        string
    {
        return this.lines.map(
            function (
                line: Line,
            ):
                string
            {
                return line.Text();
            },
        ).join(`\n`);
    }

    Set_Text(
        text: string,
    ):
        void
    {
        this.Clear_Text();

        const text_lines: Array<string> = text.split(/\r?\n/);
        for (const text_line of text_lines) {
            this.Add_Line(text_line);
        }
    }

    Save_Text():
        void
    {
        const text: string = this.Text();
        const name: string = this.Name();
        const file: File = new File([text], `${name}.txt`);
        const file_url: string = URL.createObjectURL(file);
        const link = document.createElement(`a`);

        link.href = file_url;
        link.download = `${name}.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    Clear_Text():
        void
    {
        for (const line of this.lines) {
            line.Destruct();
        }
        this.lines = [];
    }

    Line_Count():
        number
    {
        return this.lines.length;
    }

    Lines():
        Array<Line>
    {
        return Array.from(this.lines);
    }

    Line(
        line_index: number,
    ):
        Line
    {
        Assert(line_index >= 0);
        Assert(line_index < this.lines.length);

        return this.lines[line_index];
    }

    Add_Line(
        text: string,
    ):
        void
    {
        const line: Line = new Line(
            {
                editor: this,
                parent: this.children.lines,
            },
        );
        this.lines.push(line);

        line.Set_Text(text);
    }

    Remove_Line(
        line_index: number,
    ):
        void
    {
        Assert(line_index > 0);
        Assert(line_index < this.lines.length);

        if (line_index > 0) {
            this.lines.splice(line_index, 1)[0].Destruct();
        }
    }

    Insert_Line(
        at_line_index: number,
        text: string,
    ):
        void
    {
        Assert(at_line_index >= 0);
        Assert(at_line_index <= this.lines.length);

        for (let idx = at_line_index, end = this.lines.length; idx < end; idx += 1) {
            const line = this.lines[idx];
            line.Parent().removeChild(line.Element());
        }

        const line: Line = new Line(
            {
                editor: this,
                parent: this.children.lines,
            },
        );
        this.lines.splice(at_line_index, 0, line);

        line.Set_Text(text);

        for (let idx = at_line_index + 1, end = this.lines.length; idx < end; idx += 1) {
            const line = this.lines[idx];
            line.Parent().appendChild(line.Element());
        }
    }
}

function Style():
    void
{
    const style = document.createElement(`style`);

    style.setAttribute(
        `type`,
        `text/css`,
    );

    style.appendChild(
        document.createTextNode(
            `
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                *:focus {
                    outline: 0;
                }
                
                html, body {
                    width: 100%;
                    height: 100%;
                    background-color: black;
                }

                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `,
        ),
    );

    document.head.appendChild(style);
}

function Build():
    void
{
    const text_editor: Editor = new Editor(
        {
            parent: document.body,
        },
    );
}

function Main():
    void
{
    Style();
    Build();
}

Main();
