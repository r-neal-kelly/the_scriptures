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
            if (
                selection.anchorNode &&
                (
                    selection.anchorNode === element ||
                    element.contains(selection.anchorNode)
                )
            ) {
                return Text_Offset_To_Node(element, selection.anchorNode) + selection.anchorOffset;
            } else {
                return null;
            }
        } else {
            if (
                selection.anchorNode &&
                selection.focusNode &&
                (
                    selection.anchorNode === element ||
                    element.contains(selection.anchorNode)
                ) &&
                (
                    selection.focusNode === element ||
                    element.contains(selection.focusNode)
                )
            ) {
                // this needs a better check. we want to know which is the start and end nodes
                // but this doesn't work correctly if the anchor and focus are not the same text node
                if (selection.anchorOffset < selection.focusOffset) {
                    if (selection.focusNode instanceof Text) {
                        return Text_Offset_To_Node(element, selection.focusNode) +
                            selection.focusOffset;
                    } else {
                        if (selection.focusNode.textContent) {
                            return Text_Offset_To_Node(element, selection.focusNode) +
                                selection.focusNode.textContent.length;
                        } else {
                            return Text_Offset_To_Node(element, selection.focusNode);
                        }
                    }
                } else {
                    if (selection.anchorNode instanceof Text) {
                        return Text_Offset_To_Node(element, selection.anchorNode) +
                            selection.anchorOffset;
                    } else {
                        if (selection.anchorNode.textContent) {
                            return Text_Offset_To_Node(element, selection.anchorNode) +
                                selection.anchorNode.textContent.length;
                        } else {
                            return Text_Offset_To_Node(element, selection.anchorNode);
                        }
                    }
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

                font-size: 18px;
                direction: ltr;
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
                } else if (event.key === `Home`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Text_And_Class | null =
                            Dictionary.Selected_Text_And_Class();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_POINT) {
                                this.Editor().Dictionary().Add_Letter(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_LETTER) {
                                this.Editor().Dictionary().Remove_Letter(selected.text);
                                this.Editor().Touch();
                            } else if (
                                selected.class === Dictionary_Class.UNKNOWN_WORD ||
                                selected.class === Dictionary_Class.KNOWN_WORD
                            ) {
                                if (selected.text.length === 1) {
                                    this.Editor().Dictionary().Remove_Letter(selected.text);
                                    this.Editor().Touch();
                                }
                            }
                        }
                    }
                } else if (event.key === `PageUp`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Text_And_Class | null =
                            Dictionary.Selected_Text_And_Class();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_POINT) {
                                this.Editor().Dictionary().Add_Marker(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.UNKNOWN_MARKER) {
                                this.Editor().Dictionary().Add_Marker(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_MARKER) {
                                this.Editor().Dictionary().Remove_Marker(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_ERROR) {
                                this.Editor().Dictionary().Remove_Error(selected.text);
                                this.Editor().Dictionary().Add_Marker(selected.text);
                                this.Editor().Touch();
                            }
                        }
                    }
                } else if (event.key === `PageDown`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Text_And_Class | null =
                            Dictionary.Selected_Text_And_Class();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_WORD) {
                                this.Editor().Dictionary().Add_Word(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD) {
                                this.Editor().Dictionary().Remove_Word(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_ERROR) {
                                this.Editor().Dictionary().Remove_Error(selected.text);
                                this.Editor().Dictionary().Add_Word(selected.text);
                                this.Editor().Touch();
                            }
                        }
                    }
                } else if (event.key === `End`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Text_And_Class | null =
                            Dictionary.Selected_Text_And_Class();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_MARKER) {
                                this.Editor().Dictionary().Add_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_MARKER) {
                                this.Editor().Dictionary().Remove_Marker(selected.text);
                                this.Editor().Dictionary().Add_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.UNKNOWN_WORD) {
                                this.Editor().Dictionary().Add_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD) {
                                this.Editor().Dictionary().Remove_Word(selected.text);
                                this.Editor().Dictionary().Add_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_ERROR) {
                                this.Editor().Dictionary().Remove_Error(selected.text);
                                this.Editor().Touch();
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
                if (
                    input_event.inputType === `insertText` ||
                    input_event.inputType === `deleteContentBackward` ||
                    input_event.inputType === `insertFromPaste`
                ) {
                    const text_offset: number = Text_Offset(this.element) as number;

                    this.Touch();
                    Set_Text_Offset(this.element, text_offset);
                }
            }.bind(this),
        );
        this.element.addEventListener(
            `dblclick`,
            function (
                this: Line,
                mouse_event: MouseEvent,
            ):
                void
            {
                const selection: Selection | null = document.getSelection();
                if (selection) {
                    if (selection.rangeCount < 1) {
                        selection.addRange(document.createRange());
                    }

                    let node: Element = this.Element();
                    for (const child of this.Element().children) {
                        const rect: DOMRect = child.getBoundingClientRect();
                        if (
                            mouse_event.clientX >= rect.left &&
                            mouse_event.clientX <= rect.right &&
                            mouse_event.clientY >= rect.top &&
                            mouse_event.clientY <= rect.bottom
                        ) {
                            node = child;
                            break;
                        }
                    }
                    if (node === this.Element()) {
                        selection.getRangeAt(0).setStart(node, 0);
                        selection.getRangeAt(0).setEnd(node, node.children.length);
                    } else {
                        selection.getRangeAt(0).setStart(node, 0);
                        selection.getRangeAt(0).setEnd(node, 1);
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
        if (this.Editor().Is_In_Point_Mode()) {
            this.element.innerHTML = this.Editor().Dictionary().Treat_As_Points(text);
        } else {
            this.element.innerHTML = this.Editor().Dictionary().Treat(text);
        }
    }

    Touch():
        void
    {
        const text_offset: number | null = Text_Offset(this.Element());

        this.Set_Text(this.Text());
        if (text_offset) {
            Set_Text_Offset(this.Element(), text_offset);
        }
    }
}

type Letter =
    string;
type Marker =
    string;
type Word =
    string;

type Dictionary_Data = {
    letters: Array<Letter>;
    markers: Array<Marker>;
    words: { [index: Letter]: Array<Word> };
    errors: Array<Word>;
};

enum Dictionary_Class
{
    _NONE_ = -1,

    UNKNOWN_POINT,
    KNOWN_LETTER,
    UNKNOWN_MARKER,
    KNOWN_MARKER,
    UNKNOWN_WORD,
    KNOWN_WORD,
    KNOWN_ERROR,
};

type Dictionary_Text_And_Class = {
    text: string,
    class: Dictionary_Class,
};

class Dictionary
{
    static Selected_Text_And_Class():
        Dictionary_Text_And_Class | null
    {
        const selection: Selection | null = document.getSelection();
        if (
            selection &&
            !selection.isCollapsed &&
            selection.anchorNode != null &&
            selection.focusNode != null &&
            selection.anchorNode === selection.focusNode &&
            selection.getRangeAt(0).startOffset === 0 &&
            selection.getRangeAt(0).endOffset === 1
        ) {
            if (
                selection.anchorNode instanceof HTMLSpanElement
            ) {
                const span: HTMLSpanElement = selection.anchorNode as HTMLSpanElement;
                if (span.textContent != null) {
                    const dictionary_text: string = span.textContent.replaceAll(/ /g, ` `);
                    if (dictionary_text !== ``) {
                        let dictionary_class: Dictionary_Class = Dictionary_Class._NONE_;
                        // can't do KNOWN_LETTER unless we allow text as well as span
                        if (span.classList.contains(`UNKNOWN_POINT`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_POINT;
                        } else if (span.classList.contains(`KNOWN_LETTER`)) {
                            dictionary_class = Dictionary_Class.KNOWN_LETTER;
                        } else if (span.classList.contains(`UNKNOWN_MARKER`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_MARKER;
                        } else if (span.classList.contains(`KNOWN_MARKER`)) {
                            dictionary_class = Dictionary_Class.KNOWN_MARKER;
                        } else if (span.classList.contains(`UNKNOWN_WORD`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_WORD;
                        } else if (span.classList.contains(`KNOWN_WORD`)) {
                            dictionary_class = Dictionary_Class.KNOWN_WORD;
                        } else if (span.classList.contains(`KNOWN_ERROR`)) {
                            dictionary_class = Dictionary_Class.KNOWN_ERROR;
                        }
                        if (dictionary_class !== Dictionary_Class._NONE_) {
                            return {
                                text: dictionary_text,
                                class: dictionary_class,
                            };
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    private data: Dictionary_Data;

    constructor(
        {
            json = null,
        }: {
            json?: string | null,
        },
    )
    {
        if (json) {
            this.data = JSON.parse(json);
        } else {
            this.data = {
                letters: [],
                markers: [],
                words: {},
                errors: [],
            };
        }
    }

    Has_Letter(
        letter: Letter,
    ):
        boolean
    {
        Assert(letter.length === 1);

        return this.data.letters.includes(letter);
    }

    Add_Letter(
        letter: Letter,
    ):
        void
    {
        Assert(letter.length === 1);

        if (!this.data.letters.includes(letter)) {
            this.data.letters.push(letter);

            this.data.words[letter] = [];
        }
    }

    Remove_Letter(
        letter: Letter,
    ):
        void
    {
        Assert(letter.length === 1);

        const index: number = this.data.letters.indexOf(letter);
        if (index > -1) {
            this.data.letters[index] = this.data.letters[this.data.letters.length - 1];
            this.data.letters.pop();

            delete this.data.words[letter];
        }
    }

    Has_Marker(
        marker: Marker,
    ):
        boolean
    {
        Assert(marker.length > 0);

        return this.data.markers.includes(marker);
    }

    Add_Marker(
        marker: Marker,
    ):
        void
    {
        Assert(marker.length > 0);
        Assert(!this.Has_Error(marker));

        if (!this.data.markers.includes(marker)) {
            this.data.markers.push(marker);
        }
    }

    Remove_Marker(
        marker: Marker,
    ):
        void
    {
        Assert(marker.length > 0);

        const index: number = this.data.markers.indexOf(marker);
        if (index > -1) {
            this.data.markers[index] = this.data.markers[this.data.markers.length - 1];
            this.data.markers.pop();
        }
    }

    Has_Word(
        word: Word,
    ):
        boolean
    {
        Assert(word.length > 0);

        return (
            this.data.words[word[0]] != null &&
            this.data.words[word[0]].includes(word)
        );
    }

    Add_Word(
        word: Word,
    ):
        void
    {
        Assert(word.length > 0);
        Assert(!this.Has_Error(word));

        if (this.data.words[word[0]] == null) {
            this.Add_Letter(word[0]);
            this.data.words[word[0]].push(word);
        } else {
            if (!this.data.words[word[0]].includes(word)) {
                this.data.words[word[0]].push(word);
            }
        }
    }

    Remove_Word(
        word: Word,
    ):
        void
    {
        Assert(word.length > 0);

        if (this.data.words[word[0]] != null) {
            const index: number = this.data.words[word[0]].indexOf(word);
            if (index > -1) {
                this.data.words[word[0]][index] = this.data.words[word[0]][this.data.words[word[0]].length - 1];
                this.data.words[word[0]].pop();
            }
        }
    }

    Has_Error(
        error: Word | Marker,
    ):
        boolean
    {
        Assert(error.length > 0);

        return this.data.errors.includes(error);
    }

    Add_Error(
        error: Word | Marker,
    ):
        void
    {
        Assert(error.length > 0);
        Assert(!this.Has_Marker(error));
        Assert(!this.Has_Word(error));

        if (!this.data.errors.includes(error)) {
            this.data.errors.push(error);
        }
    }

    Remove_Error(
        error: Word | Marker,
    ):
        void
    {
        Assert(error.length > 0);

        const index: number = this.data.errors.indexOf(error);
        if (index > -1) {
            this.data.errors[index] = this.data.errors[this.data.errors.length - 1];
            this.data.errors.pop();
        }
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
            COMMAND,
        };

        type Part = {
            subtext: string,
            type: Type,
            has_italic: boolean,
            has_bold: boolean,
            has_underline: boolean,
            has_small_caps: boolean,
        };

        const parts: Array<Part> = [];

        let current_start_index: number = 0;
        let current_type: Type = Type._NONE_;
        let has_italic: boolean = false;
        let has_bold: boolean = false;
        let has_underline: boolean = false;
        let has_small_caps: boolean = false;
        for (let idx = 0, end = text.length; idx < end;) {
            const maybe_command: string = text.slice(idx);
            if (/^｟i｠/.test(maybe_command)) {
                has_italic = true;

                parts.push(
                    {
                        subtext: `｟i｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 3;

                idx += 3;
            } else if (/^｟\/i｠/.test(maybe_command)) {
                has_italic = false;

                parts.push(
                    {
                        subtext: `｟/i｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 4;

                idx += 4;
            } else if (/^｟b｠/.test(maybe_command)) {
                has_bold = true;

                parts.push(
                    {
                        subtext: `｟b｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 3;

                idx += 3;
            } else if (/^｟\/b｠/.test(maybe_command)) {
                has_bold = false;

                parts.push(
                    {
                        subtext: `｟/b｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 4;

                idx += 4;
            } else if (/^｟u｠/.test(maybe_command)) {
                has_underline = true;

                parts.push(
                    {
                        subtext: `｟u｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 3;

                idx += 3;
            } else if (/^｟\/u｠/.test(maybe_command)) {
                has_underline = false;

                parts.push(
                    {
                        subtext: `｟/u｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 4;

                idx += 4;
            } else if (/^｟sc｠/.test(maybe_command)) {
                has_small_caps = true;

                parts.push(
                    {
                        subtext: `｟sc｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 4;

                idx += 4;
            } else if (/^｟\/sc｠/.test(maybe_command)) {
                has_small_caps = false;

                parts.push(
                    {
                        subtext: `｟/sc｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                    },
                );
                current_start_index = idx + 5;

                idx += 5;
            } else {
                if (this.data.letters.includes(text[idx])) {
                    current_type = Type.LETTERS;
                } else if (this.data.markers.includes(text[idx])) {
                    current_type = Type.MARKERS;
                } else {
                    current_type = Type.POINT;
                }

                if (current_type === Type.POINT) {
                    parts.push(
                        {
                            subtext: text.slice(current_start_index, idx + 1),
                            type: Type.POINT,
                            has_italic,
                            has_bold,
                            has_underline,
                            has_small_caps,
                        },
                    );
                    current_start_index = idx + 1;
                } else if (current_type === Type.LETTERS) {
                    if (
                        idx + 1 === end ||
                        /^.｟\/?[^｠]*｠/.test(maybe_command) ||
                        !this.data.letters.includes(text[idx + 1])
                    ) {
                        parts.push(
                            {
                                subtext: text.slice(current_start_index, idx + 1),
                                type: Type.LETTERS,
                                has_italic,
                                has_bold,
                                has_underline,
                                has_small_caps,
                            },
                        );
                        current_start_index = idx + 1;
                    }
                } else if (current_type === Type.MARKERS) {
                    if (
                        idx + 1 === end ||
                        /^.｟\/?[^｠]*｠/.test(maybe_command) ||
                        !this.data.markers.includes(text[idx + 1])
                    ) {
                        parts.push(
                            {
                                subtext: text.slice(current_start_index, idx + 1),
                                type: Type.MARKERS,
                                has_italic,
                                has_bold,
                                has_underline,
                                has_small_caps,
                            },
                        );
                        current_start_index = idx + 1;
                    }
                } else {
                    Assert(false);
                }

                idx += 1;
            }
        }

        let inner_html: string = ``;
        for (const part of parts) {
            if (part.type === Type.COMMAND) {
                inner_html += `<span class="COMMAND">${Escape_Text(part.subtext)}</span>`;
            } else {
                let command_classes: string = ``;
                if (part.has_italic) {
                    command_classes += ` ITALIC`;
                }
                if (part.has_bold) {
                    command_classes += ` BOLD`;
                }
                if (part.has_underline) {
                    command_classes += ` UNDERLINE`;
                }
                if (part.has_small_caps) {
                    command_classes += ` SMALL_CAPS`;
                }

                if (part.type === Type.POINT) {
                    inner_html += `<span class="UNKNOWN_POINT${command_classes}">${Escape_Text(part.subtext)}</span>`;
                } else if (part.type === Type.LETTERS) {
                    if (this.data.errors.includes(part.subtext)) {
                        inner_html += `<span class="KNOWN_ERROR${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else if (this.data.words[part.subtext[0]].includes(part.subtext)) {
                        inner_html += `<span class="KNOWN_WORD${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else {
                        inner_html += `<span class="UNKNOWN_WORD${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    }
                } else if (part.type === Type.MARKERS) {
                    if (this.data.errors.includes(part.subtext)) {
                        inner_html += `<span class="KNOWN_ERROR${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else if (this.data.markers.includes(part.subtext)) {
                        inner_html += `<span class="KNOWN_MARKER${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else {
                        inner_html += `<span class="UNKNOWN_MARKER${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    }
                } else {
                    Assert(false);
                }
            }
        }

        return inner_html;
    }

    Treat_As_Points(
        text: string,
    ):
        string
    {
        let inner_html: string = ``;
        for (let idx = 0, end = text.length; idx < end; idx += 1) {
            if (this.data.letters.includes(text[idx])) {
                inner_html += `<span class="KNOWN_LETTER SEPARATE_POINT">${Escape_Text(text[idx])}</span>`;
            } else if (this.data.markers.includes(text[idx])) {
                inner_html += `<span class="KNOWN_MARKER SEPARATE_POINT">${Escape_Text(text[idx])}</span>`;
            } else {
                inner_html += `<span class="UNKNOWN_POINT SEPARATE_POINT">${Escape_Text(text[idx])}</span>`;
            }
        }

        return inner_html;
    }

    JSON():
        string
    {
        return JSON.stringify(this.data, null, 4);
    }
}

class Editor
{
    private dictionary: Dictionary;
    private lines: Array<Line>;

    private saved_dictionary: string | null;
    private saved_file: string | null;

    private is_meta_key_active: boolean;
    private is_in_point_mode: boolean;

    private parent: HTMLElement;
    private element: HTMLDivElement;
    private children: {
        controls: HTMLDivElement,

        dictionary_label: HTMLDivElement,
        dictionary_new_button: HTMLDivElement,
        dictionary_load_input: HTMLInputElement,
        dictionary_load_button: HTMLDivElement,
        dictionary_save_button: HTMLDivElement,
        dictionary_name: HTMLDivElement,

        file_label: HTMLDivElement,
        file_new_button: HTMLDivElement,
        file_load_input: HTMLInputElement,
        file_load_button: HTMLDivElement,
        file_save_button: HTMLDivElement,
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
        const button_style: string = `
            display: flex;
            justify-content: center;
            align-items: center;
            justify-self: center;

            width: 100%;
            padding: 2px;

            border-width: 2px;
            border-style: solid;
            border-color: #3B3A32;

            cursor: pointer;
            user-select: none;
        `;

        this.is_meta_key_active = false;
        this.is_in_point_mode = false;

        this.parent = parent;
        this.element = document.createElement(`div`);
        this.children = {
            controls: document.createElement(`div`),

            dictionary_label: document.createElement(`div`),
            dictionary_new_button: document.createElement(`div`),
            dictionary_load_input: document.createElement(`input`),
            dictionary_load_button: document.createElement(`div`),
            dictionary_save_button: document.createElement(`div`),
            dictionary_name: document.createElement(`div`),

            file_label: document.createElement(`div`),
            file_new_button: document.createElement(`div`),
            file_load_input: document.createElement(`input`),
            file_load_button: document.createElement(`div`),
            file_save_button: document.createElement(`div`),
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

                position: relative;

                height: 100%;
                width: 100%;
                padding: 7px;

                border-width: 0;

                background-color: #0f1318;
                color: #E0ECFF;

                overflow-y: auto;
            `,
        );
        this.element.addEventListener(
            `keydown`,
            function (
                this: Editor,
                event: KeyboardEvent,
            ):
                void
            {
                const keyboard_event: KeyboardEvent = event as KeyboardEvent;
                if (keyboard_event.key === `Escape`) {
                    event.preventDefault();

                    this.is_meta_key_active = true;
                } else if (keyboard_event.key === `ArrowLeft`) {
                    if (this.Is_Meta_Key_Active()) {
                        this.children.dictionary_name.style.direction = `rtl`;
                        this.children.file_name.style.direction = `rtl`;
                        for (const line of this.lines) {
                            line.Element().style.direction = `rtl`;
                        }
                    }
                } else if (keyboard_event.key === `ArrowRight`) {
                    if (this.Is_Meta_Key_Active()) {
                        this.children.dictionary_name.style.direction = `ltr`;
                        this.children.file_name.style.direction = `ltr`;
                        for (const line of this.lines) {
                            line.Element().style.direction = `ltr`;
                        }
                    }
                } else if (keyboard_event.key === `ArrowDown`) {
                    if (this.Is_Meta_Key_Active()) {
                        this.is_in_point_mode = true;
                        this.Touch();
                    }
                } else if (keyboard_event.key === `ArrowUp`) {
                    if (this.Is_Meta_Key_Active()) {
                        this.is_in_point_mode = false;
                        this.Touch();
                    }
                }
            }.bind(this),
        );
        this.element.addEventListener(
            `keyup`,
            function (
                this: Editor,
                event: KeyboardEvent,
            ):
                void
            {
                const keyboard_event: KeyboardEvent = event as KeyboardEvent;
                if (keyboard_event.key === `Escape`) {
                    event.preventDefault();

                    this.is_meta_key_active = false;
                }
            }.bind(this),
        );

        this.children.controls.setAttribute(
            `style`,
            `
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                grid-gap: 3px;

                width: 100%;
                padding: 2px 0;
            `,
        );

        this.children.dictionary_label.setAttribute(
            `style`,
            `
                font-size: 24px;

                user-select: none;
            `,
        );
        this.children.dictionary_label.textContent = `Dictionary:`;

        this.children.dictionary_name.setAttribute(
            `contentEditable`,
            `true`,
        );
        this.children.dictionary_name.setAttribute(
            `spellcheck`,
            `false`,
        );
        this.children.dictionary_name.setAttribute(
            `style`,
            `
                padding: 2px;

                font-size: 22px;
                direction: ltr;
            `,
        );
        this.children.dictionary_name.addEventListener(
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
        this.children.dictionary_name.addEventListener(
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
                    const text_offset: number = Text_Offset(this.children.dictionary_name) as number;

                    this.Set_Dictionary_Name(this.Dictionary_Name());
                    Set_Text_Offset(this.children.dictionary_name, text_offset);
                }
            }.bind(this),
        );

        this.children.dictionary_new_button.setAttribute(
            `style`,
            button_style,
        );
        this.children.dictionary_new_button.innerHTML = `<div>New</div>`;
        this.children.dictionary_new_button.addEventListener(
            `click`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (
                    this.saved_dictionary === null ?
                        this.Dictionary().JSON() !== new Dictionary({}).JSON() :
                        this.saved_dictionary !== this.Dictionary().JSON()
                ) {
                    if (!await this.Try_To_Save_Dictionary()) {
                        return;
                    }
                }

                this.Set_Dictionary_Name(`New Dictionary`);
                this.dictionary = new Dictionary({});
                this.Touch();
                this.saved_dictionary = null;
            }.bind(this),
        );

        this.children.dictionary_load_input.setAttribute(
            `type`,
            `file`,
        );
        this.children.dictionary_load_input.setAttribute(
            `accept`,
            `.json`,
        );
        this.children.dictionary_load_input.setAttribute(
            `style`,
            `
                display: none;
            `,
        );
        this.children.dictionary_load_input.addEventListener(
            `input`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (this.children.dictionary_load_input.files && this.children.dictionary_load_input.files[0]) {
                    const file: File = this.children.dictionary_load_input.files[0];
                    const file_text: string = await file.text();
                    this.Set_Dictionary_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Dictionary_JSON(file_text);
                    this.children.dictionary_load_input.value = ``;

                    this.saved_dictionary = this.Dictionary().JSON();
                }
            }.bind(this),
        );

        this.children.dictionary_load_button.setAttribute(
            `style`,
            button_style,
        );
        this.children.dictionary_load_button.innerHTML = `<div>Load</div>`;
        this.children.dictionary_load_button.addEventListener(
            `click`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (
                    this.saved_dictionary === null ?
                        this.Dictionary().JSON() !== new Dictionary({}).JSON() :
                        this.saved_dictionary !== this.Dictionary().JSON()
                ) {
                    if (!await this.Try_To_Save_Dictionary()) {
                        return;
                    }
                }

                this.children.dictionary_load_input.click();
            }.bind(this),
        );

        this.children.dictionary_save_button.setAttribute(
            `style`,
            button_style,
        );
        this.children.dictionary_save_button.innerHTML = `<div>Save</div>`;
        this.children.dictionary_save_button.addEventListener(
            `click`,
            function (
                this: Editor,
                event: Event,
            ):
                void
            {
                this.Save_Dictionary();
            }.bind(this),
        );

        this.children.file_label.setAttribute(
            `style`,
            `
                font-size: 24px;

                user-select: none;
            `,
        );
        this.children.file_label.textContent = `File:`;

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
                padding: 2px;

                font-size: 22px;
                direction: ltr;
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

        this.children.file_new_button.setAttribute(
            `style`,
            button_style,
        );
        this.children.file_new_button.innerHTML = `<div>New</div>`;
        this.children.file_new_button.addEventListener(
            `click`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (
                    this.saved_file === null ?
                        this.Text() !== `` :
                        this.saved_file !== this.Text()
                ) {
                    if (!await this.Try_To_Save_File()) {
                        return;
                    }
                }

                this.Set_File_Name(`New File`);
                this.Clear_Text();
                this.Touch();
                this.saved_file = null;
            }.bind(this),
        );

        this.children.file_load_input.setAttribute(
            `type`,
            `file`,
        );
        this.children.file_load_input.setAttribute(
            `accept`,
            `.txt`,
        );
        this.children.file_load_input.setAttribute(
            `style`,
            `
                display: none;
            `,
        );
        this.children.file_load_input.addEventListener(
            `input`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (this.children.file_load_input.files && this.children.file_load_input.files[0]) {
                    const file: File = this.children.file_load_input.files[0];
                    const file_text: string = await file.text();
                    this.Set_File_Name(file.name.replace(/\.[^.]+$/, ``));
                    this.Set_Text(file_text);
                    this.children.file_load_input.value = ``;

                    this.saved_file = this.Text();

                    Assert(this.Text() === file_text.replaceAll(/\r/g, ``));
                }
            }.bind(this),
        );

        this.children.file_load_button.setAttribute(
            `style`,
            button_style,
        );
        this.children.file_load_button.innerHTML = `<div>Load</div>`;
        this.children.file_load_button.addEventListener(
            `click`,
            async function (
                this: Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (
                    this.saved_file === null ?
                        this.Text() !== `` :
                        this.saved_file !== this.Text()
                ) {
                    if (!await this.Try_To_Save_File()) {
                        return;
                    }
                }

                this.children.file_load_input.click();
            }.bind(this),
        );

        this.children.file_save_button.setAttribute(
            `style`,
            button_style,
        );
        this.children.file_save_button.innerHTML = `<div>Save</div>`;
        this.children.file_save_button.addEventListener(
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

        this.dictionary = new Dictionary({});
        this.lines = [];

        this.children.controls.appendChild(this.children.dictionary_label);
        this.children.controls.appendChild(this.children.dictionary_name);
        this.children.controls.appendChild(this.children.dictionary_new_button);
        this.children.controls.appendChild(this.children.dictionary_load_button);
        this.children.controls.appendChild(this.children.dictionary_save_button);

        this.children.controls.appendChild(this.children.file_label);
        this.children.controls.appendChild(this.children.file_name);
        this.children.controls.appendChild(this.children.file_new_button);
        this.children.controls.appendChild(this.children.file_load_button);
        this.children.controls.appendChild(this.children.file_save_button);

        this.element.appendChild(this.children.controls);
        this.element.appendChild(this.children.lines);

        this.parent.appendChild(this.element);

        this.Set_Dictionary_Name(`New Dictionary`);
        this.Set_File_Name(`New File`);
        this.Add_Line(``);

        this.saved_dictionary = null;
        this.saved_file = null;
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

    Dictionary_Name():
        string
    {
        if (this.children.dictionary_name.textContent) {
            return this.children.dictionary_name.textContent.replaceAll(/ /g, ` `);
        } else {
            return ``;
        }
    }

    Set_Dictionary_Name(
        name: string,
    ):
        void
    {
        this.children.dictionary_name.innerHTML = this.Dictionary().Treat(name);
    }

    Dictionary_JSON():
        string
    {
        return this.Dictionary().JSON();
    }

    Set_Dictionary_JSON(
        json: string,
    ):
        void
    {
        this.dictionary = new Dictionary(
            {
                json: json,
            },
        );

        this.Touch();
    }

    Save_Dictionary():
        void
    {
        const json: string = this.Dictionary_JSON();
        const file_name: string = this.Dictionary_Name();
        const file: File = new File([json], `${file_name}.json`);
        const file_url: string = URL.createObjectURL(file);
        const link = document.createElement(`a`);

        link.href = file_url;
        link.download = `${file_name}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.saved_dictionary = json;
    }

    async Try_To_Save_Dictionary():
        Promise<boolean>
    {
        return await new Promise<boolean>(
            function (
                this: Editor,
                resolve: any,
                reject: any,
            ):
                void
            {
                const modal: HTMLDivElement = document.createElement(`div`);
                modal.setAttribute(
                    `style`,
                    `
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 1;

                        width: 100%;
                        height: 100%;

                        background-color: rgba(0, 0, 0, 0.7);

                        font-size: 18px;
                    `,
                );

                const message: HTMLDivElement = document.createElement(`div`);
                message.setAttribute(
                    `style`,
                    `
                        width: 67%;
                        margin: 2px;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                        text-align: center;
                    `,
                );
                message.innerHTML = `<div>
                    There are unsaved changes to the current dictionary.
                </div>`;

                const options: HTMLDivElement = document.createElement(`div`);
                options.setAttribute(
                    `style`,
                    `
                        display: grid;
                        grid-template-columns: 1fr;
                        grid-template-rows: 1fr 1fr 1fr;
                        grid-gap: 12px;

                        width: 67%;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                    `,
                );

                const button_style: string = `
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    border-width: 2px;
                    border-style: solid;
                    border-color: #3B3A32;

                    cursor: pointer;
                    user-select: none;
                `;

                const save_button: HTMLDivElement = document.createElement(`div`);
                save_button.setAttribute(`style`, button_style);
                save_button.innerHTML = `<div>Save Changes</div>`;
                save_button.addEventListener(
                    `click`,
                    function (
                        this: Editor,
                        event: MouseEvent,
                    ):
                        void
                    {
                        this.Save_Dictionary();
                        document.body.removeChild(modal);
                        resolve(true);
                    }.bind(this),
                );

                const discard_button: HTMLDivElement = document.createElement(`div`);
                discard_button.setAttribute(`style`, button_style);
                discard_button.innerHTML = `<div>Discard Changes</div>`;
                discard_button.addEventListener(
                    `click`,
                    function (
                        this: Editor,
                        event: MouseEvent,
                    ):
                        void
                    {
                        document.body.removeChild(modal);
                        resolve(true);
                    }.bind(this),
                );

                const cancel_button: HTMLDivElement = document.createElement(`div`);
                cancel_button.setAttribute(`style`, button_style);
                cancel_button.innerHTML = `<div>Cancel</div>`;
                cancel_button.addEventListener(
                    `click`,
                    function (
                        this: Editor,
                        event: MouseEvent,
                    ):
                        void
                    {
                        document.body.removeChild(modal);
                        resolve(false);
                    }.bind(this),
                );

                options.appendChild(save_button);
                options.appendChild(discard_button);
                options.appendChild(cancel_button);

                modal.appendChild(message);
                modal.appendChild(options);
                document.body.appendChild(modal);
            }.bind(this),
        );
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

        this.Remove_Line(0);
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

        this.saved_file = text;
    }

    async Try_To_Save_File():
        Promise<boolean>
    {
        return await new Promise<boolean>(
            function (
                this: Editor,
                resolve: any,
                reject: any,
            ):
                void
            {
                const modal: HTMLDivElement = document.createElement(`div`);
                modal.setAttribute(
                    `style`,
                    `
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 1;

                        width: 100%;
                        height: 100%;

                        background-color: rgba(0, 0, 0, 0.7);

                        font-size: 18px;
                    `,
                );

                const message: HTMLDivElement = document.createElement(`div`);
                message.setAttribute(
                    `style`,
                    `
                        width: 67%;
                        margin: 2px;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                        text-align: center;
                    `,
                );
                message.innerHTML = `<div>
                    There are unsaved changes to the current file.
                </div>`;

                const options: HTMLDivElement = document.createElement(`div`);
                options.setAttribute(
                    `style`,
                    `
                        display: grid;
                        grid-template-columns: 1fr;
                        grid-template-rows: 1fr 1fr 1fr;
                        grid-gap: 12px;

                        width: 67%;
                        padding: 7px;

                        background-color: #0f1318;

                        color: #E0ECFF;
                    `,
                );

                const button_style: string = `
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    border-width: 2px;
                    border-style: solid;
                    border-color: #3B3A32;

                    cursor: pointer;
                    user-select: none;
                `;

                const save_button: HTMLDivElement = document.createElement(`div`);
                save_button.setAttribute(`style`, button_style);
                save_button.innerHTML = `<div>Save Changes</div>`;
                save_button.addEventListener(
                    `click`,
                    function (
                        this: Editor,
                        event: MouseEvent,
                    ):
                        void
                    {
                        this.Save_Text();
                        document.body.removeChild(modal);
                        resolve(true);
                    }.bind(this),
                );

                const discard_button: HTMLDivElement = document.createElement(`div`);
                discard_button.setAttribute(`style`, button_style);
                discard_button.innerHTML = `<div>Discard Changes</div>`;
                discard_button.addEventListener(
                    `click`,
                    function (
                        this: Editor,
                        event: MouseEvent,
                    ):
                        void
                    {
                        document.body.removeChild(modal);
                        resolve(true);
                    }.bind(this),
                );

                const cancel_button: HTMLDivElement = document.createElement(`div`);
                cancel_button.setAttribute(`style`, button_style);
                cancel_button.innerHTML = `<div>Cancel</div>`;
                cancel_button.addEventListener(
                    `click`,
                    function (
                        this: Editor,
                        event: MouseEvent,
                    ):
                        void
                    {
                        document.body.removeChild(modal);
                        resolve(false);
                    }.bind(this),
                );

                options.appendChild(save_button);
                options.appendChild(discard_button);
                options.appendChild(cancel_button);

                modal.appendChild(message);
                modal.appendChild(options);
                document.body.appendChild(modal);
            }.bind(this),
        );
    }

    Clear_Text():
        void
    {
        for (const line of this.lines) {
            line.Destruct();
        }
        this.lines = [];

        this.Add_Line(``);
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
        Assert(line_index > 0 || this.lines.length > 1);
        Assert(line_index < this.lines.length);

        this.lines.splice(line_index, 1)[0].Destruct();
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

    Touch():
        void
    {
        this.Set_Dictionary_Name(this.Dictionary_Name());
        this.Set_File_Name(this.File_Name());

        for (const line of this.lines) {
            line.Touch();
        }
    }

    Is_Meta_Key_Active():
        boolean
    {
        return this.is_meta_key_active;
    }

    Is_In_Point_Mode():
        boolean
    {
        return this.is_in_point_mode;
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

                    font-family: sans-serif;
                }

                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                span {
                    display: inline-block;
                }

                .ITALIC {
                    font-style: italic;
                }

                .BOLD {
                    font-weight: bold;
                }

                .UNDERLINE {
                    text-decoration: underline;
                }
                
                .SMALL_CAPS {
                    font-variant: small-caps;
                }

                .SEPARATE_POINT {
                    display: inline-block;

                    min-width: 7px;

                    text-align: center;
                }

                .UNKNOWN_POINT {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #ffff00;

                    overflow-wrap: normal;
                }

                .KNOWN_LETTER {
                    overflow-wrap: normal;
                }

                .UNKNOWN_MARKER {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #00da6f;

                    overflow-wrap: normal;
                }

                .KNOWN_MARKER {
                    overflow-wrap: normal;
                }

                .UNKNOWN_WORD {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #ff5858;

                    overflow-wrap: normal;
                }

                .KNOWN_WORD {
                    overflow-wrap: normal;
                }

                .KNOWN_ERROR {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #e767c3;

                    overflow-wrap: normal;
                }

                .COMMAND {
                    overflow-wrap: normal;
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
