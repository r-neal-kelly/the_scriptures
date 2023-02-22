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
            if (point === ` `) {
                return `&#${` `.charCodeAt(0)};`
            } else {
                return `&#${point.charCodeAt(0)};`;
            }
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
                padding: 2px;

                border-width: 0 0 1px 0;
                border-style: solid;
                border-color: #3B3A32;
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
                } else if (event.key === `ArrowUp`) {
                    event.preventDefault();

                    const selection: Selection | null = document.getSelection();
                    if (selection) {
                        const line_index: number = this.Index();
                        if (line_index > 0) {
                            const text_offset: number = Text_Offset(this.element) as number;
                            const above_line: Line = this.Editor().Line(line_index - 1);
                            const above_line_text: string = above_line.Text();

                            Set_Text_Offset(
                                above_line.Element(),
                                above_line_text.length < text_offset ?
                                    above_line_text.length :
                                    text_offset,
                            );
                        }
                    }
                } else if (event.key === `ArrowDown`) {
                    event.preventDefault();

                    const selection: Selection | null = document.getSelection();
                    if (selection) {
                        const line_index: number = this.Index();
                        const line_count: number = this.Editor().Line_Count();
                        if (line_index < line_count - 1) {
                            const text_offset: number = Text_Offset(this.element) as number;
                            const below_line: Line = this.Editor().Line(line_index + 1);
                            const below_line_text: string = below_line.Text();

                            Set_Text_Offset(
                                below_line.Element(),
                                below_line_text.length < text_offset ?
                                    below_line_text.length :
                                    text_offset,
                            );
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
        // for now we just replace all non-breaking spaces with regular spaces.
        // see the comments in Set_Text for more info, as this is a temporary measure.
        if (this.element.textContent) {
            return this.element.textContent.replaceAll(/ /g, ` `);
        } else {
            return ``;
        }
    }

    Set_Text(
        text: string,
    ):
        void
    {
        // some browsers like firefox do not automatically replace
        // spaces with non-breaking spaces, which is needed because
        // browsers automatically remove extra spaces, whereas an editor
        // should allow them. but firefox is a hot mess, it doesn't even
        // properly backspace when spans are in the editor, so we do not
        // support it for now. in the future we can keep track of our own
        // caret to make up for it's hot mess, but not at this time.

        // we also have the other problem though. We don't actually want all
        // these non-breaking spaces. So we are going to have to keep a separate
        // string containing the actual text of the line and then use it to
        // set the innerHTML. however, sometimes we need to read from textContent,
        // so what we will have to do is alter the actual string after input events.
        // very frustrating, but we have to do this so that the user can actually
        // use non-breaking spaces and we don't stomp them trying to switch them all
        // out. I'm tempted to just switch them all out though until we need to use
        // such a thing, because it's an annoying problem that doesn't need to be dealt
        // with just yet.
        this.element.innerHTML = this.Editor().Dictionary().Treat(text);
    }
}

type Letter =
    string;
type Marker =
    string;
type Word =
    string;

type Dictionary_JSON = {
    letters: Array<Letter>;
    markers: Array<Marker>;
    words: { [index: Letter]: Array<Word> };
    errors: Array<Word>;
};

class Dictionary
{
    private json: Dictionary_JSON;

    constructor()
    {
        this.json = {
            letters: [],
            markers: [],
            words: {},
            errors: [],
        };

        this.Init_Test();
    }

    Init_Test():
        void
    {
        this.json = JSON.parse(`
            {
                "letters": [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z"
                ],
                "markers": [
                    " ",
                    ",",
                    "."
                ],
                "words": {
                    "a": [
                        "apple",
                        "angel"
                    ],
                    "b": [
                        "baby",
                        "bath"
                    ],
                    "c": [],
                    "d": [],
                    "e": [],
                    "f": [],
                    "g": [],
                    "h": [],
                    "i": [],
                    "j": [],
                    "k": [],
                    "l": [],
                    "m": [],
                    "n": [],
                    "o": [],
                    "p": [],
                    "q": [],
                    "r": [],
                    "s": [],
                    "t": [],
                    "u": [],
                    "v": [],
                    "w": [],
                    "x": [],
                    "y": [],
                    "z": []
                },
                "errors": [
                    "aple",
                    "batth"
                ]
            }
        `);
    }

    Treat(
        text: string,
    ):
        string
    {
        enum Type
        {
            _NONE_ = -1,

            POINT,
            LETTERS,
            MARKERS,
        };

        type Part = {
            subtext: string,
            type: Type,
        };

        const parts: Array<Part> = [];

        let current_start_index: number = 0;
        let current_type: Type = Type._NONE_;
        for (let idx = 0, end = text.length; idx < end; idx += 1) {
            if (this.json.letters.includes(text[idx])) {
                current_type = Type.LETTERS;
            } else if (this.json.markers.includes(text[idx])) {
                current_type = Type.MARKERS;
            } else {
                current_type = Type.POINT;
            }

            if (current_type === Type.POINT) {
                parts.push(
                    {
                        subtext: text.slice(current_start_index, idx + 1),
                        type: Type.POINT,
                    },
                );
                current_start_index = idx + 1;
            } else if (current_type === Type.LETTERS) {
                if (
                    idx + 1 === end ||
                    !this.json.letters.includes(text[idx + 1])
                ) {
                    parts.push(
                        {
                            subtext: text.slice(current_start_index, idx + 1),
                            type: Type.LETTERS,
                        },
                    );
                    current_start_index = idx + 1;
                }
            } else if (current_type === Type.MARKERS) {
                if (
                    idx + 1 === end ||
                    !this.json.markers.includes(text[idx + 1])
                ) {
                    parts.push(
                        {
                            subtext: text.slice(current_start_index, idx + 1),
                            type: Type.MARKERS,
                        },
                    );
                    current_start_index = idx + 1;
                }
            } else {
                Assert(false);
            }
        }

        let inner_html: string = ``;
        for (const part of parts) {
            if (part.type === Type.POINT) {
                inner_html += `<span class="UNKNOWN_POINT">${Escape_Text(part.subtext)}</span>`;
            } else if (part.type === Type.LETTERS) {
                if (this.json.errors.includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_ERROR">${Escape_Text(part.subtext)}</span>`;
                } else if (this.json.words[part.subtext[0]].includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_WORD">${Escape_Text(part.subtext)}</span>`;
                } else {
                    inner_html += `<span class="UNKNOWN_WORD">${Escape_Text(part.subtext)}</span>`;
                }
            } else if (part.type === Type.MARKERS) {
                if (this.json.markers.includes(part.subtext)) {
                    inner_html += `<span class="KNOWN_MARKER">${Escape_Text(part.subtext)}</span>`;
                } else {
                    inner_html += `<span class="UNKNOWN_MARKER">${Escape_Text(part.subtext)}</span>`;
                }
            }
        }

        return inner_html;
    }
}

class Editor
{
    private dictionary: Dictionary;
    private lines: Array<Line>;

    private parent: HTMLElement;
    private element: HTMLDivElement;
    private children: {
        commands: HTMLDivElement,
        load_file_input: HTMLInputElement,
        load_file_button: HTMLDivElement,
        save_file_button: HTMLDivElement,

        file_name: HTMLDivElement,

        lines: HTMLDivElement,
    };

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
            load_file_input: document.createElement(`input`),
            load_file_button: document.createElement(`div`),
            save_file_button: document.createElement(`div`),

            file_name: document.createElement(`div`),

            lines: document.createElement(`div`),
        };

        this.element.setAttribute(
            `style`,
            `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                height: 100%;
                width: 100%;
                padding: 7px;

                border-width: 0;

                background-color: #0f1318;
                color: #E0ECFF;

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

        this.children.load_file_input.setAttribute(
            `type`,
            `file`,
        );
        this.children.load_file_input.setAttribute(
            `accept`,
            `text/plain`,
        );
        this.children.load_file_input.setAttribute(
            `style`,
            `
                display: none;
            `,
        );
        this.children.load_file_input.addEventListener(
            `input`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (this.children.load_file_input.files && this.children.load_file_input.files[0]) {
                    const file: File = this.children.load_file_input.files[0];
                    const file_text: string = await file.text();
                    this.Set_File_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Text(file_text);
                    this.children.load_file_input.value = ``;

                    Assert(this.Text() === file_text.replaceAll(/\r/g, ``));
                }
            }.bind(this),
        );

        this.children.load_file_button.setAttribute(
            `style`,
            `
                width: 50%;
                height: 100%;
            `,
        );
        this.children.load_file_button.textContent = `Load`;
        this.children.load_file_button.addEventListener(
            `click`,
            function (
                this: Editor,
                event: Event,
            ):
                void
            {
                this.children.load_file_input.click();
            }.bind(this),
        );

        this.children.save_file_button.setAttribute(
            `style`,
            `
                width: 50%;
                height: 100%;
            `,
        );
        this.children.save_file_button.textContent = `Save`;
        this.children.save_file_button.addEventListener(
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

        this.children.file_name.setAttribute(
            `contentEditable`,
            `true`,
        );
        this.children.file_name.setAttribute(
            `spellcheck`,
            `false`,
        );
        this.children.file_name.setAttribute(
            `style`,
            `
                width: 100%;
                height: 5%;
            `,
        );
        this.children.file_name.addEventListener(
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
        this.children.file_name.addEventListener(
            `input`,
            function (
                this: Editor,
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
                    const text_offset: number = Text_Offset(this.children.file_name) as number;

                    this.Set_File_Name(this.File_Name());
                    Set_Text_Offset(this.children.file_name, text_offset);
                }
            }.bind(this),
        );

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
                border-style: solid;
                border-color: #3B3A32;

                overflow-y: auto;
            `,
        );

        this.dictionary = new Dictionary();
        this.lines = [];

        this.children.commands.appendChild(this.children.load_file_input);
        this.children.commands.appendChild(this.children.load_file_button);
        this.children.commands.appendChild(this.children.save_file_button);

        this.element.appendChild(this.children.commands);
        this.element.appendChild(this.children.file_name);
        this.element.appendChild(this.children.lines);

        this.parent.appendChild(this.element);

        this.Set_File_Name(`New Text`);
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

    Dictionary():
        Dictionary
    {
        return this.dictionary;
    }

    File_Name():
        string
    {
        if (this.children.file_name.textContent) {
            return this.children.file_name.textContent.replaceAll(/ /g, ` `);
        } else {
            return ``;
        }
    }

    Set_File_Name(
        name: string,
    ):
        void
    {
        this.children.file_name.innerHTML = this.Dictionary().Treat(name);
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
        const file_name: string = this.File_Name();
        const file: File = new File([text], `${file_name}.txt`);
        const file_url: string = URL.createObjectURL(file);
        const link = document.createElement(`a`);

        link.href = file_url;
        link.download = `${file_name}.txt`;

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

                .UNKNOWN_POINT {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #ffff00;
                }

                .UNKNOWN_WORD {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #ff5858;
                }

                .UNKNOWN_MARKER {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #00da6f;
                }

                .KNOWN_ERROR {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #e767c3;
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
