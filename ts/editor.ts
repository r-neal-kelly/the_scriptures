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

type Letter = string;
type Marker = string;
type Word = string;
type Break = string;

enum Dictionary_Class
{
    _NONE_ = -1,

    UNKNOWN_POINT,
    KNOWN_LETTER,
    KNOWN_MARKER,

    UNKNOWN_WORD,
    KNOWN_WORD,

    UNKNOWN_BREAK,
    KNOWN_BREAK,

    KNOWN_WORD_ERROR,
    KNOWN_BREAK_ERROR,
};

enum Dictionary_Boundary
{
    START = `START`,
    MIDDLE = `MIDDLE`,
    END = `END`,
};

type Dictionary_Data = {
    letters: Array<Letter>;
    markers: Array<Marker>;

    words: { [index: Letter]: Array<Word> };
    breaks: {
        [Dictionary_Boundary.START]: { [index: Marker]: Array<Break> },
        [Dictionary_Boundary.MIDDLE]: { [index: Marker]: Array<Break> },
        [Dictionary_Boundary.END]: { [index: Marker]: Array<Break> },
    };

    word_errors: Array<Word>;
    break_errors: {
        [Dictionary_Boundary.START]: Array<Break>,
        [Dictionary_Boundary.MIDDLE]: Array<Break>,
        [Dictionary_Boundary.END]: Array<Break>,
    };
};

type Dictionary_Entry = {
    text: string,
    class: Dictionary_Class,
    boundary: Dictionary_Boundary,
};

type Dictionary_Treatment = {
    html: string,
    is_centered: boolean,
};

class Dictionary
{
    static First_Entry_Index(
        element: HTMLElement,
    ):
        number | null
    {
        for (let idx = 0, end = element.children.length; idx < end;) {
            if (!element.children[idx].classList.contains(`COMMAND`)) {
                return idx;
            }
            idx += 1;
        }

        return null;
    }

    static Last_Entry_Index(
        element: HTMLElement,
    ):
        number | null
    {
        for (let idx = element.children.length, end = 0; idx > end;) {
            idx -= 1;
            if (!element.children[idx].classList.contains(`COMMAND`)) {
                return idx;
            }
        }

        return null;
    }

    static Selected_Entry():
        Dictionary_Entry | null
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
                if (
                    span.parentElement != null &&
                    span.textContent != null
                ) {
                    const dictionary_text: string = span.textContent.replaceAll(/ /g, ` `);
                    if (dictionary_text !== ``) {
                        let dictionary_class: Dictionary_Class = Dictionary_Class._NONE_;
                        if (span.classList.contains(`UNKNOWN_POINT`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_POINT;
                        } else if (span.classList.contains(`KNOWN_LETTER`)) {
                            dictionary_class = Dictionary_Class.KNOWN_LETTER;
                        } else if (span.classList.contains(`KNOWN_MARKER`)) {
                            dictionary_class = Dictionary_Class.KNOWN_MARKER;

                        } else if (span.classList.contains(`UNKNOWN_WORD`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_WORD;
                        } else if (span.classList.contains(`KNOWN_WORD`)) {
                            dictionary_class = Dictionary_Class.KNOWN_WORD;

                        } else if (span.classList.contains(`UNKNOWN_BREAK`)) {
                            dictionary_class = Dictionary_Class.UNKNOWN_BREAK;
                        } else if (span.classList.contains(`KNOWN_BREAK`)) {
                            dictionary_class = Dictionary_Class.KNOWN_BREAK;

                        } else if (span.classList.contains(`KNOWN_WORD_ERROR`)) {
                            dictionary_class = Dictionary_Class.KNOWN_WORD_ERROR;
                        } else if (span.classList.contains(`KNOWN_BREAK_ERROR`)) {
                            dictionary_class = Dictionary_Class.KNOWN_BREAK_ERROR;
                        }

                        if (dictionary_class !== Dictionary_Class._NONE_) {
                            const span_index: number = Array.from(span.parentElement.children).indexOf(span);
                            let dictionary_boundary: Dictionary_Boundary = Dictionary_Boundary.MIDDLE;
                            if (span_index === Dictionary.First_Entry_Index(span.parentElement)) {
                                dictionary_boundary = Dictionary_Boundary.START;
                            } else if (span_index === Dictionary.Last_Entry_Index(span.parentElement)) {
                                dictionary_boundary = Dictionary_Boundary.END;
                            }

                            return {
                                text: dictionary_text,
                                class: dictionary_class,
                                boundary: dictionary_boundary,
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
                breaks: {
                    [Dictionary_Boundary.START]: {},
                    [Dictionary_Boundary.MIDDLE]: {},
                    [Dictionary_Boundary.END]: {},
                },

                word_errors: [],
                break_errors: {
                    [Dictionary_Boundary.START]: [],
                    [Dictionary_Boundary.MIDDLE]: [],
                    [Dictionary_Boundary.END]: [],
                },
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
        Assert(marker.length === 1);

        return this.data.markers.includes(marker);
    }

    Add_Marker(
        marker: Marker,
    ):
        void
    {
        Assert(marker.length === 1);

        if (!this.data.markers.includes(marker)) {
            this.data.markers.push(marker);

            this.data.breaks[Dictionary_Boundary.START][marker] = [];
            this.data.breaks[Dictionary_Boundary.MIDDLE][marker] = [];
            this.data.breaks[Dictionary_Boundary.END][marker] = [];
        }
    }

    Remove_Marker(
        marker: Marker,
    ):
        void
    {
        Assert(marker.length === 1);

        const index: number = this.data.markers.indexOf(marker);
        if (index > -1) {
            this.data.markers[index] = this.data.markers[this.data.markers.length - 1];
            this.data.markers.pop();

            delete this.data.breaks[Dictionary_Boundary.START][marker];
            delete this.data.breaks[Dictionary_Boundary.MIDDLE][marker];
            delete this.data.breaks[Dictionary_Boundary.END][marker];
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
        Assert(!this.Has_Word_Error(word));

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

    Has_Break(
        break_: Break,
        boundary: Dictionary_Boundary,
    ):
        boolean
    {
        Assert(break_.length > 0);

        return (
            this.data.breaks[boundary][break_[0]] != null &&
            this.data.breaks[boundary][break_[0]].includes(break_)
        );
    }

    Add_Break(
        break_: Break,
        boundary: Dictionary_Boundary,
    ):
        void
    {
        Assert(break_.length > 0);
        Assert(!this.Has_Break_Error(break_, boundary));

        if (this.data.breaks[boundary][break_[0]] == null) {
            this.Add_Marker(break_[0]);
            this.data.breaks[boundary][break_[0]].push(break_);
        } else {
            if (!this.data.breaks[boundary][break_[0]].includes(break_)) {
                this.data.breaks[boundary][break_[0]].push(break_);
            }
        }
    }

    Remove_Break(
        break_: Break,
        boundary: Dictionary_Boundary,
    ):
        void
    {
        Assert(break_.length > 0);

        if (this.data.breaks[boundary][break_[0]] != null) {
            const index: number = this.data.breaks[boundary][break_[0]].indexOf(break_);
            if (index > -1) {
                this.data.breaks[boundary][break_[0]][index] =
                    this.data.breaks[boundary][break_[0]][this.data.breaks[boundary][break_[0]].length - 1];
                this.data.breaks[boundary][break_[0]].pop();
            }
        }
    }

    Has_Word_Error(
        word_error: Word,
    ):
        boolean
    {
        Assert(word_error.length > 0);

        return this.data.word_errors.includes(word_error);
    }

    Add_Word_Error(
        word_error: Word,
    ):
        void
    {
        Assert(word_error.length > 0);
        Assert(!this.Has_Word(word_error));

        if (!this.data.word_errors.includes(word_error)) {
            this.data.word_errors.push(word_error);
        }
    }

    Remove_Word_Error(
        word_error: Word,
    ):
        void
    {
        Assert(word_error.length > 0);

        const index: number = this.data.word_errors.indexOf(word_error);
        if (index > -1) {
            this.data.word_errors[index] = this.data.word_errors[this.data.word_errors.length - 1];
            this.data.word_errors.pop();
        }
    }

    Has_Break_Error(
        break_error: Break,
        boundary: Dictionary_Boundary,
    ):
        boolean
    {
        Assert(break_error.length > 0);

        return this.data.break_errors[boundary].includes(break_error);
    }

    Add_Break_Error(
        break_error: Break,
        boundary: Dictionary_Boundary,
    ):
        void
    {
        Assert(break_error.length > 0);
        Assert(!this.Has_Break(break_error, boundary));

        if (!this.data.break_errors[boundary].includes(break_error)) {
            this.data.break_errors[boundary].push(break_error);
        }
    }

    Remove_Break_Error(
        break_error: Break,
        boundary: Dictionary_Boundary,
    ):
        void
    {
        Assert(break_error.length > 0);

        const index: number = this.data.break_errors[boundary].indexOf(break_error);
        if (index > -1) {
            this.data.break_errors[boundary][index] =
                this.data.break_errors[boundary][this.data.break_errors[boundary].length - 1];
            this.data.break_errors[boundary].pop();
        }
    }

    Treat(
        text: string,
    ):
        Dictionary_Treatment
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
            has_error: boolean,
        };

        const is_centered: boolean = /^｟cen｠/.test(text);
        const parts: Array<Part> = [];

        let current_start_index: number = 0;
        let current_type: Type = Type._NONE_;
        let has_italic: boolean = false;
        let has_bold: boolean = false;
        let has_underline: boolean = false;
        let has_small_caps: boolean = false;
        let has_error: boolean = false;
        let first_part: number | null = null;
        let last_part: number | null = null;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟i｠`.length;

                idx += `｟i｠`.length;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟/i｠`.length;

                idx += `｟/i｠`.length;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟b｠`.length;

                idx += `｟b｠`.length;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟/b｠`.length;

                idx += `｟/b｠`.length;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟u｠`.length;

                idx += `｟u｠`.length;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟/u｠`.length;

                idx += `｟/u｠`.length;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟sc｠`.length;

                idx += `｟sc｠`.length;
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
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟/sc｠`.length;

                idx += `｟/sc｠`.length;
            } else if (/^｟err｠/.test(maybe_command)) {
                has_error = true;

                parts.push(
                    {
                        subtext: `｟err｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟err｠`.length;

                idx += `｟err｠`.length;
            } else if (/^｟\/err｠/.test(maybe_command)) {
                has_error = false;

                parts.push(
                    {
                        subtext: `｟/err｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟/err｠`.length;

                idx += `｟/err｠`.length;
            } else if (/^｟in｠/.test(maybe_command)) {
                parts.push(
                    {
                        subtext: `｟in｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟in｠`.length;

                idx += `｟in｠`.length;
            } else if (/^｟cen｠/.test(maybe_command)) {
                parts.push(
                    {
                        subtext: `｟cen｠`,
                        type: Type.COMMAND,
                        has_italic: false,
                        has_bold: false,
                        has_underline: false,
                        has_small_caps: false,
                        has_error: false,
                    },
                );
                current_start_index = idx + `｟cen｠`.length;

                idx += `｟cen｠`.length;
            } else {
                if (this.data.letters.includes(text[idx])) {
                    current_type = Type.LETTERS;
                } else if (this.data.markers.includes(text[idx])) {
                    current_type = Type.MARKERS;
                } else {
                    current_type = Type.POINT;
                }

                if (current_type === Type.POINT) {
                    if (first_part === null) {
                        first_part = parts.length;
                    }
                    last_part = parts.length;

                    parts.push(
                        {
                            subtext: text.slice(current_start_index, idx + 1),
                            type: Type.POINT,
                            has_italic,
                            has_bold,
                            has_underline,
                            has_small_caps,
                            has_error,
                        },
                    );
                    current_start_index = idx + 1;
                } else if (current_type === Type.LETTERS) {
                    if (
                        idx + 1 === end ||
                        /^.｟\/?[^｠]*｠/.test(maybe_command) ||
                        !this.data.letters.includes(text[idx + 1])
                    ) {
                        if (first_part === null) {
                            first_part = parts.length;
                        }
                        last_part = parts.length;

                        parts.push(
                            {
                                subtext: text.slice(current_start_index, idx + 1),
                                type: Type.LETTERS,
                                has_italic,
                                has_bold,
                                has_underline,
                                has_small_caps,
                                has_error,
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
                        if (first_part === null) {
                            first_part = parts.length;
                        }
                        last_part = parts.length;

                        parts.push(
                            {
                                subtext: text.slice(current_start_index, idx + 1),
                                type: Type.MARKERS,
                                has_italic,
                                has_bold,
                                has_underline,
                                has_small_caps,
                                has_error,
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
        for (let idx = 0, end = parts.length; idx < end; idx += 1) {
            const part = parts[idx];
            if (part.type === Type.COMMAND) {
                let command_classes: string = ``;
                if (part.subtext === `｟in｠`) {
                    command_classes += ` INDENT`;
                }

                inner_html += `<span class="COMMAND${command_classes}">${Escape_Text(part.subtext)}</span>`;
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
                if (part.has_error) {
                    command_classes += ` ERROR`;
                }

                const boundary: Dictionary_Boundary = (
                    idx === first_part ? Dictionary_Boundary.START : (
                        idx === last_part ? Dictionary_Boundary.END :
                            Dictionary_Boundary.MIDDLE
                    )
                );

                if (part.type === Type.POINT) {
                    if (this.Has_Word_Error(part.subtext)) {
                        inner_html += `<span class="KNOWN_WORD_ERROR${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else if (this.Has_Break_Error(part.subtext, boundary)) {
                        inner_html += `<span class="KNOWN_BREAK_ERROR${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else {
                        inner_html += `<span class="UNKNOWN_POINT${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    }
                } else if (part.type === Type.LETTERS) {
                    if (this.Has_Word_Error(part.subtext)) {
                        inner_html += `<span class="KNOWN_WORD_ERROR${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else if (this.Has_Word(part.subtext)) {
                        inner_html += `<span class="KNOWN_WORD${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else {
                        inner_html += `<span class="UNKNOWN_WORD${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    }
                } else if (part.type === Type.MARKERS) {
                    if (this.Has_Break_Error(part.subtext, boundary)) {
                        inner_html += `<span class="KNOWN_BREAK_ERROR${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else if (this.Has_Break(part.subtext, boundary)) {
                        inner_html += `<span class="KNOWN_BREAK${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    } else {
                        inner_html += `<span class="UNKNOWN_BREAK${command_classes}">${Escape_Text(part.subtext)}</span>`;
                    }
                } else {
                    Assert(false);
                }
            }
        }

        return ({
            html: inner_html,
            is_centered: is_centered,
        });
    }

    Treat_As_Points(
        text: string,
    ):
        string
    {
        let inner_html: string = ``;
        for (let idx = 0, end = text.length; idx < end;) {
            const maybe_command: Array<string> | null =
                text.slice(idx).match(/^(｟\/?(i|b|u|sc|err)｠|｟(in|cen)｠)/);
            if (maybe_command && maybe_command[0]) {
                for (const end = idx + maybe_command[0].length; idx < end;) {
                    inner_html += `<span class="COMMAND SEPARATE_POINT">${Escape_Text(text[idx])}</span>`;
                    idx += 1;
                }
            } else {
                if (this.data.letters.includes(text[idx])) {
                    inner_html += `<span class="KNOWN_LETTER SEPARATE_POINT">${Escape_Text(text[idx])}</span>`;
                } else if (this.data.markers.includes(text[idx])) {
                    inner_html += `<span class="KNOWN_MARKER SEPARATE_POINT">${Escape_Text(text[idx])}</span>`;
                } else {
                    inner_html += `<span class="UNKNOWN_POINT SEPARATE_POINT">${Escape_Text(text[idx])}</span>`;
                }

                idx += 1;
            }
        }

        return inner_html;
    }

    JSON():
        string
    {
        this.data.letters.sort();
        this.data.markers.sort();

        const sorted_words: { [index: Letter]: Array<Word> } = {};
        for (const letter of Object.keys(this.data.words).sort()) {
            sorted_words[letter] = this.data.words[letter].sort();
        }
        this.data.words = sorted_words;

        const sorted_breaks: {
            [Dictionary_Boundary.START]: { [index: Marker]: Array<Break> },
            [Dictionary_Boundary.MIDDLE]: { [index: Marker]: Array<Break> },
            [Dictionary_Boundary.END]: { [index: Marker]: Array<Break> },
        } = {
            [Dictionary_Boundary.START]: {},
            [Dictionary_Boundary.MIDDLE]: {},
            [Dictionary_Boundary.END]: {},
        };
        for (const boundary of [Dictionary_Boundary.START, Dictionary_Boundary.MIDDLE, Dictionary_Boundary.END]) {
            for (const marker of Object.keys(this.data.breaks[boundary]).sort()) {
                sorted_breaks[boundary][marker] = this.data.breaks[boundary][marker].sort();
            }
        }
        this.data.breaks = sorted_breaks;

        this.data.word_errors.sort();
        for (const boundary of [Dictionary_Boundary.START, Dictionary_Boundary.MIDDLE, Dictionary_Boundary.END]) {
            this.data.break_errors[boundary].sort();
        }

        return JSON.stringify(this.data, null, 4);
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
                display: flex;
                flex-wrap: wrap;
                justify-content: center;

                width: 100%;
                padding: 2px;

                border-width: 0 0 1px 0;
                border-style: solid;
                border-color: #3B3A32;

                font-size: 20px;
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

                    if (!this.Editor().Is_Meta_Key_Active()) {
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
                    }
                } else if (event.key === `ArrowDown`) {
                    event.preventDefault();

                    if (!this.Editor().Is_Meta_Key_Active()) {
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
                } else if (event.key === `ArrowLeft`) {
                    const selection: Selection | null = document.getSelection();
                    if (
                        selection &&
                        !selection.isCollapsed &&
                        selection.anchorNode &&
                        selection.focusNode &&
                        selection.anchorNode === selection.focusNode
                    ) {
                        event.preventDefault();

                        const parent: Element = this.Element();
                        const child_index: number = Array.from(parent.children)
                            .indexOf(selection.anchorNode as Element);
                        if (child_index > 0) {
                            selection.getRangeAt(0).setStart(parent.children[child_index - 1], 0);
                            selection.getRangeAt(0).setEnd(parent.children[child_index - 1], 1);
                        }
                    } else {
                        const text_offset: number | null = Text_Offset(this.Element());
                        if (text_offset != null) {
                            event.preventDefault();

                            if (text_offset > 0) {
                                Set_Text_Offset(this.Element(), text_offset - 1);
                            }
                        }
                    }
                } else if (event.key === `ArrowRight`) {
                    const selection: Selection | null = document.getSelection();
                    if (
                        selection &&
                        !selection.isCollapsed &&
                        selection.anchorNode &&
                        selection.focusNode &&
                        selection.anchorNode === selection.focusNode
                    ) {
                        event.preventDefault();

                        const parent: Element = this.Element();
                        const child_index: number = Array.from(parent.children)
                            .indexOf(selection.anchorNode as Element);
                        if (
                            child_index >= 0 &&
                            child_index < parent.children.length - 1
                        ) {
                            selection.getRangeAt(0).setStart(parent.children[child_index + 1], 0);
                            selection.getRangeAt(0).setEnd(parent.children[child_index + 1], 1);
                        }
                    } else {
                        const text_offset: number | null = Text_Offset(this.Element());
                        if (text_offset != null) {
                            event.preventDefault();

                            if (text_offset < this.Text().length) {
                                Set_Text_Offset(this.Element(), text_offset + 1);
                            }
                        }
                    }
                } else if (event.key === `Home`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Entry | null =
                            Dictionary.Selected_Entry();
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

                        const selected: Dictionary_Entry | null =
                            Dictionary.Selected_Entry();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_POINT) {
                                this.Editor().Dictionary().Add_Marker(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_MARKER) {
                                this.Editor().Dictionary().Remove_Marker(selected.text);
                                this.Editor().Touch();
                            } else if (
                                selected.class === Dictionary_Class.UNKNOWN_BREAK ||
                                selected.class === Dictionary_Class.KNOWN_BREAK
                            ) {
                                if (selected.text.length === 1) {
                                    this.Editor().Dictionary().Remove_Marker(selected.text);
                                    this.Editor().Touch();
                                }
                            }
                        }
                    }
                } else if (event.key === `PageDown`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Entry | null =
                            Dictionary.Selected_Entry();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_WORD) {
                                this.Editor().Dictionary().Add_Word(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD) {
                                this.Editor().Dictionary().Remove_Word(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD_ERROR) {
                                this.Editor().Dictionary().Remove_Word_Error(selected.text);
                                this.Editor().Dictionary().Add_Word(selected.text);
                                this.Editor().Touch();
                            }
                        }
                    }
                } else if (event.key === `End`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Entry | null =
                            Dictionary.Selected_Entry();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_BREAK) {
                                this.Editor().Dictionary().Add_Break(selected.text, selected.boundary);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_BREAK) {
                                this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_BREAK_ERROR) {
                                this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary);
                                this.Editor().Dictionary().Add_Break(selected.text, selected.boundary);
                                this.Editor().Touch();
                            }
                        }
                    }
                } else if (event.key === `Delete`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Entry | null =
                            Dictionary.Selected_Entry();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_WORD) {
                                this.Editor().Dictionary().Add_Word_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD) {
                                this.Editor().Dictionary().Remove_Word(selected.text);
                                this.Editor().Dictionary().Add_Word_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.UNKNOWN_BREAK) {
                                this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_BREAK) {
                                this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary);
                                this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD_ERROR) {
                                this.Editor().Dictionary().Remove_Word_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_BREAK_ERROR) {
                                this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary);
                                this.Editor().Touch();
                            }
                        }
                    }
                } else if (event.key === `Pause`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Entry | null =
                            Dictionary.Selected_Entry();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_POINT) {
                                this.Editor().Dictionary().Add_Word_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.UNKNOWN_WORD) {
                                this.Editor().Dictionary().Add_Word_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD) {
                                this.Editor().Dictionary().Remove_Word(selected.text);
                                this.Editor().Dictionary().Add_Word_Error(selected.text);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_WORD_ERROR) {
                                this.Editor().Dictionary().Remove_Word_Error(selected.text);
                                this.Editor().Touch();
                            }
                        }
                    }
                } else if (event.key === `Insert`) {
                    if (this.Editor().Is_Meta_Key_Active()) {
                        event.preventDefault();

                        const selected: Dictionary_Entry | null =
                            Dictionary.Selected_Entry();
                        if (selected) {
                            if (selected.class === Dictionary_Class.UNKNOWN_POINT) {
                                this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.UNKNOWN_BREAK) {
                                this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_BREAK) {
                                this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary);
                                this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary);
                                this.Editor().Touch();
                            } else if (selected.class === Dictionary_Class.KNOWN_BREAK_ERROR) {
                                this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary);
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
            this.element.style.display = `block`;
        } else {
            const treatment: Dictionary_Treatment = this.Editor().Dictionary().Treat(text);
            this.element.innerHTML = treatment.html;
            if (treatment.is_centered) {
                this.element.style.display = `flex`;
            } else {
                this.element.style.display = `block`;
            }
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
                } else if (keyboard_event.key === `\``) {
                    if (this.Is_Meta_Key_Active()) {
                        keyboard_event.preventDefault();

                        this.Highlight_First_Unknown();
                    }
                } else if (keyboard_event.key === `~`) {
                    if (this.Is_Meta_Key_Active()) {
                        keyboard_event.preventDefault();

                        this.Highlight_Next_Error();
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
            `true`,
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
            `true`,
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
                border-style: none;
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
        this.children.dictionary_name.innerHTML = Escape_Text(name);
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
        this.children.file_name.innerHTML = Escape_Text(name);
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

    Highlight_First_Unknown():
        void
    {
        for (const line of this.lines) {
            for (const child of line.Element().children) {
                for (const class_name of child.classList.values()) {
                    if (/UNKNOWN/.test(class_name)) {
                        line.Element().focus();

                        const selection: Selection = document.getSelection() as Selection;
                        selection.getRangeAt(0).setStart(child, 0);
                        selection.getRangeAt(0).setEnd(child, 1);

                        return;
                    }
                }
            }
        }

        this.lines[0].Element().focus();
        const selection: Selection = document.getSelection() as Selection;
        selection.collapse(this.lines[0].Element(), 0);
    }

    Highlight_Next_Error():
        void
    {
        const selected_line_idx: number | null = this.Focused_Line_Index();
        const selection: Selection | null = document.getSelection();
        if (
            selected_line_idx !== null &&
            selection &&
            !selection.isCollapsed &&
            selection.anchorNode &&
            selection.focusNode &&
            selection.anchorNode === selection.focusNode &&
            (
                (selection.anchorOffset === 0 && selection.focusOffset === 1) ||
                (selection.anchorOffset === 1 && selection.focusOffset === 0)
            )
        ) {
            // we have a highlighted error command, so we look for the next one in this line and the ones that follow
            const selected_line_element: Element = this.lines[selected_line_idx].Element();
            const selected_child_idx: number =
                Array.from(selected_line_element.children).indexOf(selection.anchorNode as Element);
            if (selected_child_idx > -1) {
                const selected_child_element: Element = selected_line_element.children[selected_child_idx];
                const next_error_element: Element | null =
                    (function (
                        this: Editor,
                    ):
                        Element | null
                    {
                        let line_idx: number = selected_line_idx;
                        let child_idx: number = selected_child_idx + 1;
                        while (true) {
                            const line: Element = this.lines[line_idx].Element();
                            for (let end = line.children.length; child_idx < end; child_idx += 1
                            ) {
                                const child: Element = line.children[child_idx];
                                if (child.textContent === `｟err｠`) {
                                    return child;
                                } else if (child === selected_child_element) {
                                    return null;
                                }
                            }

                            if (line_idx === this.lines.length - 1) {
                                line_idx = 0;
                            } else {
                                line_idx += 1;
                            }
                            child_idx = 0;
                        }
                    }.bind(this))();

                if (next_error_element) {
                    (next_error_element.parentElement as HTMLElement).focus();
                    selection.getRangeAt(0).setStart(next_error_element, 0);
                    selection.getRangeAt(0).setEnd(next_error_element, 1);
                }
            }
        } else {
            // we have to look for the first error and highlight it
            for (let line of this.lines) {
                for (let child of line.Element().children) {
                    if (child.textContent === `｟err｠`) {
                        line.Element().focus();

                        const selection: Selection = document.getSelection() as Selection;
                        selection.getRangeAt(0).setStart(child, 0);
                        selection.getRangeAt(0).setEnd(child, 1);
                        return;
                    }
                }
            }
        }
    }

    Focused_Line_Index():
        number | null
    {
        const selection: Selection | null = document.getSelection();
        if (
            selection &&
            (selection.anchorNode || selection.focusNode)
        ) {
            for (let idx = 0, end = this.lines.length; idx < end; idx += 1) {
                if (
                    this.lines[idx].Element().contains(selection.anchorNode) ||
                    this.lines[idx].Element().contains(selection.focusNode)
                ) {
                    return idx;
                }
            }

            return null;
        } else {
            return null;
        }
    }

    Display_Stats():
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
                color: #E0ECFF;
            `,
        );

        const wrapper: HTMLDivElement = document.createElement(`div`);
        wrapper.setAttribute(
            `style`,
            `
                width: 67%;
                margin: 2px;
                padding: 7px;

                background-color: #0f1318;

                text-align: center;
            `,
        );

        const okay_button: HTMLDivElement = document.createElement(`div`);
        okay_button.setAttribute(
            `style`,
            `
            display: flex;
            justify-content: center;
            align-items: center;

            border-width: 2px;
            border-style: solid;
            border-color: #3B3A32;

            cursor: pointer;
            user-select: none;
        `);
        okay_button.innerHTML = `<div>Okay</div>`;
        okay_button.addEventListener(
            `click`,
            function (
                this: Editor,
                event: MouseEvent,
            ):
                void
            {
                document.body.removeChild(modal);

                this.Line(0).Element().focus();
            }.bind(this),
        );

        wrapper.appendChild(okay_button);
        modal.appendChild(wrapper);
        document.body.appendChild(modal);
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

                .ERROR {
                    color: #ffcbcb;
                }

                .INDENT {
                    width: 6em;
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

                .UNKNOWN_BREAK {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #00da6f;

                    overflow-wrap: normal;
                }

                .KNOWN_BREAK {
                    overflow-wrap: normal;
                }

                .KNOWN_WORD_ERROR {
                    border-width: 0 0 2px 0;
                    border-style: solid;
                    border-color: #e767c3;

                    overflow-wrap: normal;
                }

                .KNOWN_BREAK_ERROR {
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
