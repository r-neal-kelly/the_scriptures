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
                } else if (event.key === `Backspace`) {
                    const line_index: number = this.Index();
                    if (line_index > 0) {
                        const selection: Selection | null = document.getSelection();
                        if (selection) {
                            if (selection.isCollapsed) {
                                if (selection.anchorOffset === 0) {
                                    event.preventDefault();

                                    const previous_line: Line = this.Editor().Line(line_index - 1);
                                    const previous_line_node: Node = previous_line.Element();
                                    const previous_line_node_child_count: number = previous_line_node.childNodes.length;
                                    const previous_line_text: string = previous_line.Text();

                                    previous_line.Set_Text(`${previous_line_text}${this.Text()}`);
                                    this.Editor().Remove_Line(line_index);

                                    previous_line.Element().focus();
                                    if (previous_line_node.firstChild) {
                                        if (previous_line_node.firstChild instanceof Text) {
                                            selection.getRangeAt(0).setStart(
                                                previous_line_node.firstChild,
                                                previous_line_text.length,
                                            );
                                        } else {
                                            selection.getRangeAt(0).setStart(
                                                previous_line_node.firstChild,
                                                previous_line_node_child_count,
                                            );
                                        }
                                    } else {
                                        selection.getRangeAt(0).setStart(
                                            previous_line_node,
                                            0,
                                        );
                                    }


                                }
                            } else {

                            }
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
                if (input_event.inputType === `insertFromPaste`) {
                    const selection: Selection | null = document.getSelection();
                    if (
                        selection &&
                        selection.anchorNode &&
                        selection.anchorNode !== this.element
                    ) {
                        let new_offset: number =
                            Text_Offset_To_Node(this.element, selection.anchorNode) +
                            selection.anchorOffset;

                        this.element.innerHTML = this.element.textContent || ``

                        selection.collapse(
                            this.element.firstChild || this.element,
                            new_offset,
                        );
                    } else {
                        this.element.innerHTML = ``;
                    }
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
        this.element.innerHTML = Escape_Text(text);
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
