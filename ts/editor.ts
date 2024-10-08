import { Integer } from "./types.js";
import { Float } from "./types.js";
import { Count } from "./types.js";
import { Index } from "./types.js";

import * as Utils from "./utils.js";
import * as Unicode from "./unicode.js";
import * as Keyboard from "./keyboard.js";

import * as Language from "./model/language.js";
import * as Languages from "./model/languages.js";
import * as Font from "./model/font.js";
import * as Fonts from "./model/fonts.js";
import { Script_Position } from "./model/script_position.js";
import * as Model from "./model/text.js";

const UNDERLYING_FONT_SIZE_PX: Float = 24;

const INDENT_AMOUNT: Count = 6;

const DEFAULT_FONT_STYLES: {
    [language_name: string]: {
        [script_position: Integer]: string,
    }
} = Object.create(null);
for (const language_name of Languages.Singleton().Language_Names()) {
    DEFAULT_FONT_STYLES[language_name] = Object.create(null);
    for (const script_position of
        [
            Script_Position.DEFAULT,
            Script_Position.SUPER,
            Script_Position.SUB,
        ]
    ) {
        DEFAULT_FONT_STYLES[language_name][script_position] = Utils.Styles_To_Inline_String(
            Languages.Singleton().Default_Global_Font_Styles(
                {
                    language_name: language_name,
                    underlying_font_size_px: UNDERLYING_FONT_SIZE_PX,
                    underlying_font_size_multiplier: 1.0,
                    script_position,
                },
            ),
            `'`,
        );
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
                const code: Integer = point.charCodeAt(0);
                if (code < 0xD800 || code > 0xDFFF) {
                    return `&#${code};`;
                } else {
                    // why bother escaping anything outside of the BMP
                    return point;
                }
            }
        }
    );
}

function Text_Offset_To_Node(
    from: Node,
    to: Node,
):
    Count
{
    if (from === to) {
        return 0;
    } else {
        let offset: Count = 0;

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
    Count | null
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
    offset: Count,
):
    void
{
    class Node_And_Offset
    {
        public node: Node;
        public offset: Count;

        constructor(
            {
                node,
                offset,
            }: {
                node: Node,
                offset: Count,
            },
        )
        {
            this.node = node;
            this.offset = offset;
        }
    };

    function Text_Offset_To_Node_And_Offset(
        node: Node,
        target_offset: Count,
        current_offset: Count = 0,
    ):
        Node_And_Offset | Count
    {
        for (const child_node of node.childNodes) {
            if (child_node instanceof Text) {
                const text_length: Count = child_node.textContent ?
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
                    current_offset = maybe_node_and_offset as Count;
                }
            }
        }

        return current_offset;
    }

    element.focus();

    const selection: Selection | null = document.getSelection();
    if (selection) {
        const maybe_node_and_offset: Node_And_Offset | Count = Text_Offset_To_Node_And_Offset(
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
                maybe_node_and_offset as Count,
            );
        }
    }
}

function Put_Child_At_Parent_Top_Y(
    parent_element: Element,
    child_element: Element,
):
    void
{

    const parent_rect = parent_element.getBoundingClientRect();
    const child_rect = child_element.getBoundingClientRect();
    const child_y = child_rect.y - parent_rect.y;

    parent_element.scrollTop += child_y;
}

enum Part_Class
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

type Dictionary_Entry = {
    text: string,
    class: Part_Class,
    language: Language.Name | null,
    boundary: Model.Dictionary.Boundary,
};

type Dictionary_Treatment = {
    html: string,
    is_centered: boolean,
    padding_count: Count,
};

function Selected_Part():
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
                    let dictionary_class: Part_Class = Part_Class._NONE_;
                    if (span.classList.contains(`UNKNOWN_POINT`)) {
                        dictionary_class = Part_Class.UNKNOWN_POINT;
                    } else if (span.classList.contains(`KNOWN_LETTER`)) {
                        dictionary_class = Part_Class.KNOWN_LETTER;
                    } else if (span.classList.contains(`KNOWN_MARKER`)) {
                        dictionary_class = Part_Class.KNOWN_MARKER;

                    } else if (span.classList.contains(`UNKNOWN_WORD`)) {
                        dictionary_class = Part_Class.UNKNOWN_WORD;
                    } else if (span.classList.contains(`KNOWN_WORD`)) {
                        dictionary_class = Part_Class.KNOWN_WORD;

                    } else if (span.classList.contains(`UNKNOWN_BREAK`)) {
                        dictionary_class = Part_Class.UNKNOWN_BREAK;
                    } else if (span.classList.contains(`KNOWN_BREAK`)) {
                        dictionary_class = Part_Class.KNOWN_BREAK;

                    } else if (span.classList.contains(`KNOWN_WORD_ERROR`)) {
                        dictionary_class = Part_Class.KNOWN_WORD_ERROR;
                    } else if (span.classList.contains(`KNOWN_BREAK_ERROR`)) {
                        dictionary_class = Part_Class.KNOWN_BREAK_ERROR;
                    }

                    const dictionary_language: Language.Name | null =
                        span.dataset.language != null && span.dataset.language != `` ?
                            span.dataset.language as Language.Name :
                            null;

                    if (dictionary_class !== Part_Class._NONE_) {
                        let dictionary_boundary: Model.Dictionary.Boundary = Model.Dictionary.Boundary.MIDDLE;
                        if (span.classList.contains(Model.Dictionary.Boundary.START)) {
                            dictionary_boundary = Model.Dictionary.Boundary.START;
                        } else if (span.classList.contains(Model.Dictionary.Boundary.END)) {
                            dictionary_boundary = Model.Dictionary.Boundary.END;
                        }

                        return {
                            text: dictionary_text,
                            class: dictionary_class,
                            language: dictionary_language,
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

const LETTER_KEY: Keyboard.Key = Keyboard.Key.HOME;
const MARKER_KEY: Keyboard.Key = Keyboard.Key.PAGE_UP;
const WORD_KEY: Keyboard.Key = Keyboard.Key.PAGE_DOWN;
const BREAK_KEY: Keyboard.Key = Keyboard.Key.END;
const ERROR_KEY: Keyboard.Key = Keyboard.Key.DELETE;
const WORD_ERROR_KEY: Keyboard.Key = Keyboard.Key.PAUSE;
const BREAK_ERROR_KEY: Keyboard.Key = Keyboard.Key.INSERT;

class Line_Keyboard_Hook extends Keyboard.Hook.Instance
{
    private line: Line;

    constructor(
        keyboard: Keyboard.Instance,
        line: Line,
    )
    {
        super(
            {
                keyboard: keyboard,
                div: line.Element(),
            },
        );

        this.line = line;

        this.Enable();
    }

    Destruct()
    {
        this.Disable();
    }

    Line():
        Line
    {
        return this.line;
    }

    Underlying_Font_Size_PX():
        Float
    {
        return UNDERLYING_FONT_SIZE_PX;
    }

    override async On_Change_Global_Layout(
        layout: Keyboard.Layout.Instance,
    ):
        Promise<void>
    {
        await super.On_Change_Global_Layout(layout);

        // It's necessary to use a request because it is the case
        // that this handler will be called on each line, and we
        // only want to touch the editor once per batch.
        this.line.Editor().Request_Touch();
    }

    override async On_Try_Change_Language_Direction(
        language_direction: Language.Direction,
    ):
        Promise<boolean>
    {
        return false;
    }

    override async On_Key_Down(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        await this.On_Key_Down_Impl.bind(this.line)(event);
    }

    override async After_Insert_Or_Paste_Or_Delete():
        Promise<void>
    {
        await this.After_Insert_Or_Paste_Or_Delete_Impl.bind(this.line)();
    }

    private async On_Key_Down_Impl(
        this: Line,
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        if (event.key === Keyboard.Key.ENTER) {
            event.preventDefault();

            const selection: Selection | null = document.getSelection();
            if (selection) {
                const line_text: string = this.Text();
                let line_text_a: string;
                let line_text_b: string;
                if (selection.isCollapsed) {
                    Utils.Assert(selection.anchorNode !== null);

                    const at: Count =
                        Text_Offset_To_Node(
                            this.Element(),
                            selection.anchorNode as Node,
                        ) +
                        selection.anchorOffset;

                    line_text_a = line_text.slice(0, at);
                    line_text_b = line_text.slice(at, line_text.length);
                } else {
                    Utils.Assert(selection.anchorNode !== null);
                    Utils.Assert(selection.focusNode !== null);

                    let start_node: Node;
                    let start_offset: Count;
                    let stop_node: Node;
                    let stop_offset: Count;
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
                    const from: Index =
                        Text_Offset_To_Node(
                            top_node,
                            start_node
                        ) +
                        start_offset;
                    const to: Index =
                        Text_Offset_To_Node(
                            top_node,
                            stop_node
                        ) +
                        stop_offset;

                    line_text_a = line_text.slice(0, from);
                    line_text_b = line_text.slice(to, line_text.length);
                }

                const line_index: Index = this.Index();
                this.Set_Text(line_text_a);
                this.Editor().Insert_Line(line_index + 1, line_text_b);
                this.Editor().Line(line_index + 1).Element().focus();
            }
        } else if (event.key === Keyboard.Key.BACKSPACE) {
            const selection: Selection | null = document.getSelection();
            if (selection) {
                const line_index: Index = this.Index();
                const text_offset: Count = Text_Offset(this.Element()) as Count;
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
        } else if (event.key === Keyboard.Key.ARROW_UP) {
            event.preventDefault();

            if (!this.Editor().Is_Meta_Key_Active()) {
                const selection: Selection | null = document.getSelection();
                if (selection) {
                    const line_index: Index = this.Index();
                    if (line_index > 0) {
                        const text_offset: Count = Text_Offset(this.Element()) as Count;
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
        } else if (event.key === Keyboard.Key.ARROW_DOWN) {
            event.preventDefault();

            if (!this.Editor().Is_Meta_Key_Active()) {
                const selection: Selection | null = document.getSelection();
                if (selection) {
                    const line_index: Index = this.Index();
                    const line_count: Count = this.Editor().Line_Count();
                    if (line_index < line_count - 1) {
                        const text_offset: Count = Text_Offset(this.Element()) as Count;
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
        } else if (event.key === Keyboard.Key.ARROW_LEFT) {
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
                const child_index: Index = Array.from(parent.children)
                    .indexOf(selection.anchorNode as Element);
                if (child_index > 0) {
                    selection.getRangeAt(0).setStart(parent.children[child_index - 1], 0);
                    selection.getRangeAt(0).setEnd(parent.children[child_index - 1], 1);
                }
            } else {
                const text_offset: Count | null = Text_Offset(this.Element());
                if (text_offset != null) {
                    event.preventDefault();

                    if (text_offset > 0) {
                        const previous_code: Integer = this.Text()[text_offset - 1].charCodeAt(0);
                        if (
                            previous_code >= 0xDC00 &&
                            previous_code <= 0xDFFF
                        ) {
                            Set_Text_Offset(this.Element(), Math.max(0, text_offset - 2));
                        } else {
                            Set_Text_Offset(this.Element(), text_offset - 1);
                        }
                    }
                }
            }
        } else if (event.key === Keyboard.Key.ARROW_RIGHT) {
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
                const child_index: Index = Array.from(parent.children)
                    .indexOf(selection.anchorNode as Element);
                if (
                    child_index >= 0 &&
                    child_index < parent.children.length - 1
                ) {
                    selection.getRangeAt(0).setStart(parent.children[child_index + 1], 0);
                    selection.getRangeAt(0).setEnd(parent.children[child_index + 1], 1);
                }
            } else {
                const text_offset: Count | null = Text_Offset(this.Element());
                if (text_offset != null) {
                    event.preventDefault();

                    const text: string = this.Text();
                    if (text_offset + 2 <= text.length) {
                        const next_code: Integer = text[text_offset + 1].charCodeAt(0);
                        if (
                            next_code >= 0xDC00 &&
                            next_code <= 0xDFFF
                        ) {
                            Set_Text_Offset(this.Element(), text_offset + 2);
                        } else {
                            Set_Text_Offset(this.Element(), text_offset + 1);
                        }
                    } else if (text_offset < text.length) {
                        Set_Text_Offset(this.Element(), text_offset + 1);
                    }
                }
            }
        } else if (event.key === LETTER_KEY) {
            event.preventDefault();

            if (this.Editor().Is_Meta_Key_Active()) {
                const selected: Dictionary_Entry | null = Selected_Part();
                if (selected) {
                    if (selected.class === Part_Class.UNKNOWN_POINT) {
                        this.Editor().Dictionary().Add_Letter(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_LETTER) {
                        this.Editor().Dictionary().Remove_Letter(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (
                        selected.class === Part_Class.UNKNOWN_WORD ||
                        selected.class === Part_Class.KNOWN_WORD
                    ) {
                        if (Unicode.Is_Point(selected.text)) {
                            this.Editor().Dictionary().Remove_Letter(selected.text, selected.language);
                            this.Editor().Touch();
                        }
                    }
                }
            }
        } else if (event.key === MARKER_KEY) {
            event.preventDefault();

            if (this.Editor().Is_Meta_Key_Active()) {
                const selected: Dictionary_Entry | null = Selected_Part();
                if (selected) {
                    if (selected.class === Part_Class.UNKNOWN_POINT) {
                        this.Editor().Dictionary().Add_Marker(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_MARKER) {
                        this.Editor().Dictionary().Remove_Marker(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (
                        selected.class === Part_Class.UNKNOWN_BREAK ||
                        selected.class === Part_Class.KNOWN_BREAK
                    ) {
                        if (Unicode.Is_Point(selected.text)) {
                            this.Editor().Dictionary().Remove_Marker(selected.text, selected.language);
                            this.Editor().Touch();
                        }
                    }
                }
            }
        } else if (event.key === WORD_KEY) {
            event.preventDefault();

            if (this.Editor().Is_Meta_Key_Active()) {
                const selected: Dictionary_Entry | null = Selected_Part();
                if (selected) {
                    if (selected.class === Part_Class.UNKNOWN_WORD) {
                        this.Editor().Dictionary().Add_Word(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_WORD) {
                        this.Editor().Dictionary().Remove_Word(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_WORD_ERROR) {
                        this.Editor().Dictionary().Remove_Word_Error(selected.text, selected.language);
                        this.Editor().Dictionary().Add_Word(selected.text, selected.language);
                        this.Editor().Touch();
                    }
                }
            }
        } else if (event.key === BREAK_KEY) {
            event.preventDefault();

            if (this.Editor().Is_Meta_Key_Active()) {
                const selected: Dictionary_Entry | null = Selected_Part();
                if (selected) {
                    if (selected.class === Part_Class.UNKNOWN_BREAK) {
                        this.Editor().Dictionary().Add_Break(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_BREAK) {
                        this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_BREAK_ERROR) {
                        this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Dictionary().Add_Break(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    }
                }
            }
        } else if (event.key === ERROR_KEY) {
            if (this.Editor().Is_Meta_Key_Active()) {
                event.preventDefault();

                const selected: Dictionary_Entry | null = Selected_Part();
                if (selected) {
                    if (selected.class === Part_Class.UNKNOWN_WORD) {
                        this.Editor().Dictionary().Add_Word_Error(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_WORD) {
                        this.Editor().Dictionary().Remove_Word(selected.text, selected.language);
                        this.Editor().Dictionary().Add_Word_Error(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.UNKNOWN_BREAK) {
                        this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_BREAK) {
                        this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary, selected.language);
                        this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_WORD_ERROR) {
                        this.Editor().Dictionary().Remove_Word_Error(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_BREAK_ERROR) {
                        this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    }
                }
            }
        } else if (event.key === WORD_ERROR_KEY) {
            if (this.Editor().Is_Meta_Key_Active()) {
                event.preventDefault();

                const selected: Dictionary_Entry | null = Selected_Part();
                if (selected) {
                    if (selected.class === Part_Class.UNKNOWN_POINT) {
                        this.Editor().Dictionary().Add_Word_Error(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.UNKNOWN_WORD) {
                        this.Editor().Dictionary().Add_Word_Error(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_WORD) {
                        this.Editor().Dictionary().Remove_Word(selected.text, selected.language);
                        this.Editor().Dictionary().Add_Word_Error(selected.text, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_WORD_ERROR) {
                        this.Editor().Dictionary().Remove_Word_Error(selected.text, selected.language);
                        this.Editor().Touch();
                    }
                }
            }
        } else if (event.key === BREAK_ERROR_KEY) {
            if (this.Editor().Is_Meta_Key_Active()) {
                event.preventDefault();

                const selected: Dictionary_Entry | null = Selected_Part();
                if (selected) {
                    if (selected.class === Part_Class.UNKNOWN_POINT) {
                        this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.UNKNOWN_BREAK) {
                        this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_BREAK) {
                        this.Editor().Dictionary().Remove_Break(selected.text, selected.boundary, selected.language);
                        this.Editor().Dictionary().Add_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    } else if (selected.class === Part_Class.KNOWN_BREAK_ERROR) {
                        this.Editor().Dictionary().Remove_Break_Error(selected.text, selected.boundary, selected.language);
                        this.Editor().Touch();
                    }
                }
            }
        }
    }

    private async After_Insert_Or_Paste_Or_Delete_Impl(
        this: Line,
    ):
        Promise<void>
    {
        const text_offset: Count = Text_Offset(this.Element()) as Count;

        this.Touch();
        Set_Text_Offset(this.Element(), text_offset);
    }
}

class Line
{
    private editor: Editor;

    private parent: HTMLElement;
    private element: HTMLDivElement;

    private keyboard_hook: Line_Keyboard_Hook;

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

                direction: ${editor.Direction() === Language.Direction.LEFT_TO_RIGHT ? `ltr` : `rtl`};
            `,
        );

        this.parent.appendChild(this.element);

        this.keyboard_hook = new Line_Keyboard_Hook(Keyboard.Singleton(), this);

        this.element.addEventListener(
            `dblclick`,
            function (
                this: Line,
                event: MouseEvent,
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
                            event.clientX >= rect.left &&
                            event.clientX <= rect.right &&
                            event.clientY >= rect.top &&
                            event.clientY <= rect.bottom
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
    }

    Destruct():
        void
    {
        this.keyboard_hook.Destruct();

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
        Index
    {
        const index: Index = this.Editor().Lines().indexOf(this);
        Utils.Assert(index > -1);

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
            this.element.innerHTML = this.Treat_As_Points(text);
            this.element.style.display = `block`;
        } else {
            const treatment: Dictionary_Treatment = this.Treat(text);
            this.element.innerHTML = treatment.html;
            if (treatment.is_centered) {
                this.element.style.display = `flex`;
            } else {
                this.element.style.display = `block`;
            }
            if (treatment.padding_count > 0) {
                const direction: Language.Direction = this.Editor().Direction();
                if (direction === Language.Direction.RIGHT_TO_LEFT) {
                    this.element.style.paddingRight = `${treatment.padding_count * INDENT_AMOUNT}em`;
                } else {
                    this.element.style.paddingLeft = `${treatment.padding_count * INDENT_AMOUNT}em`;
                }
            }
        }
    }

    Touch():
        void
    {
        const text_offset: Count | null = Text_Offset(this.Element());

        this.Set_Text(this.Text());
        if (this.Editor().Direction() === Language.Direction.LEFT_TO_RIGHT) {
            this.Element().style.direction = `ltr`;
        } else {
            this.Element().style.direction = `rtl`;
        }
        if (text_offset) {
            Set_Text_Offset(this.Element(), text_offset);
        }
    }

    Treat(
        text: string,
    ):
        Dictionary_Treatment
    {
        const model: Model.Instance = new Model.Instance(
            {
                dictionary: this.Editor().Dictionary(),
                value: text,
            },
        );
        Utils.Assert(
            // strangely the browser sometimes adds line break when copying and pasting text
            // with commands? try copying a short line and pasting it into a new line.
            model.Line_Count() === 1,
            `model's line count should be 1, but it's ${model.Line_Count()}.`,
        );

        const line: Model.Line.Instance = model.Line(0);

        let inner_html: string = ``;
        let is_centered: boolean | null = null;
        let padding_count: Count | null = null;

        for (
            let column_idx = 0, column_end = line.Column_Count();
            column_idx < column_end;
            column_idx += 1
        ) {
            const column: Model.Column.Instance = line.Column(column_idx);

            for (
                let row_idx = 0, row_end = column.Row_Count();
                row_idx < row_end;
                row_idx += 1
            ) {
                const row: Model.Row.Instance = column.Row(row_idx);

                if (is_centered == null) {
                    is_centered = row.Is_Centered();
                }
                if (padding_count == null) {
                    padding_count = row.Padding_Count();
                }

                for (
                    let part_idx = 0, part_end = row.Macro_Part_Count();
                    part_idx < part_end;
                    part_idx += 1
                ) {
                    const part: Model.Part.Instance = row.Macro_Part(part_idx);
                    const size: Float | null = part.Size();
                    const language_name: Language.Name | null = part.Language();
                    const script_position: Script_Position = part.Script_Position();

                    let primary_classes: string = ``;
                    let command_classes: string = ``;
                    let styles: string | null = null;

                    if (part.Is_Command()) {
                        const command = part as Model.Part.Command.Instance;

                        if (command.Is_Good()) {
                            primary_classes += `COMMAND`;
                        } else {
                            primary_classes += `BAD_COMMAND`;
                        }

                        if (command.Is_Indent()) {
                            command_classes += ` INDENT`;
                        } else if (command.Is_Column()) {
                            command_classes += ` COLUMN`;
                        } else if (command.Is_Row()) {
                            if (this.editor.Are_Rows_Expanded()) {
                                command_classes += ` EXPANDED_ROW`;
                            } else {
                                command_classes += ` COLLAPSED_ROW`;
                            }
                        } else if (command.Is_Margin()) {
                            command_classes += ` MARGIN`;
                        } else if (command.Is_Interlinear()) {
                            command_classes += ` INTERLINEAR`;
                        }
                    } else {
                        if (part.Is_Point()) {
                            primary_classes += `UNKNOWN_POINT`;
                        } else if (part.Is_Word()) {
                            if (part.Is_Good()) {
                                primary_classes += `KNOWN_WORD`;
                            } else if (part.Is_Error()) {
                                primary_classes += `KNOWN_WORD_ERROR`;
                            } else if (part.Is_Unknown()) {
                                primary_classes += `UNKNOWN_WORD`;
                            } else {
                                Utils.Assert(
                                    false,
                                    `unknown part state.`,
                                );
                            }
                        } else if (part.Is_Break()) {
                            if (part.Is_Good()) {
                                primary_classes += `KNOWN_BREAK`;
                            } else if (part.Is_Error()) {
                                primary_classes += `KNOWN_BREAK_ERROR`;
                            } else if (part.Is_Unknown()) {
                                primary_classes += `UNKNOWN_BREAK`;
                            } else {
                                Utils.Assert(
                                    false,
                                    `unknown part state.`,
                                );
                            }
                            primary_classes +=
                                ` ` +
                                (part as Model.Part.Break.Instance).Boundary();
                        } else {
                            Utils.Assert(
                                false,
                                `invalid macro part.`,
                            );
                        }

                        if (part.Has_Italic_Style()) {
                            command_classes += ` ITALIC`;
                        }
                        if (part.Has_Bold_Style()) {
                            command_classes += ` BOLD`;
                        }
                        if (part.Has_Underline_Style()) {
                            command_classes += ` UNDERLINE`;
                        }
                        if (part.Has_Small_Caps_Style()) {
                            command_classes += ` SMALL_CAPS`;
                        }
                        if (script_position === Script_Position.SUPER) {
                            command_classes += ` SUPERSCRIPT`;
                        } else if (script_position === Script_Position.SUB) {
                            command_classes += ` SUBSCRIPT`;
                        }
                        if (part.Has_Error_Style()) {
                            command_classes += ` ERROR`;
                        }
                        if (part.Has_Argument_Style()) {
                            command_classes += ` ARGUMENT`;
                        }

                        if (language_name != null) {
                            Utils.Assert(
                                DEFAULT_FONT_STYLES[language_name] != null,
                                `should have default_font_styles for ${language_name}!`,
                            );

                            styles = DEFAULT_FONT_STYLES[language_name][script_position];
                        }
                    }

                    if (size != null) {
                        styles = this.Resize_Styles_String(
                            styles,
                            size,
                            script_position,
                        );
                    }

                    inner_html +=
                        `<span ` +
                        `class="${primary_classes}${command_classes}" ` +
                        `data-language="${language_name || ``}" ` +
                        `style="${styles || ``}" ` +
                        `>` +
                        Escape_Text(part.Value()) +
                        `</span>`;
                }
            }
        }

        return ({
            html: inner_html,
            is_centered: is_centered != null ? is_centered : false,
            padding_count: padding_count != null ? padding_count : 0,
        });
    }

    Treat_As_Points(
        text: string,
    ):
        string
    {
        const model: Model.Instance = new Model.Instance(
            {
                dictionary: this.Editor().Dictionary(),
                value: text,
            },
        );
        Utils.Assert(
            model.Line_Count() === 1,
            `model's line count should be 1.`,
        );

        const line: Model.Line.Instance = model.Line(0);

        let inner_html: string = ``;

        for (
            let column_idx = 0, column_end = line.Column_Count();
            column_idx < column_end;
            column_idx += 1
        ) {
            const column: Model.Column.Instance = line.Column(column_idx);

            for (
                let row_idx = 0, row_end = column.Row_Count();
                row_idx < row_end;
                row_idx += 1
            ) {
                const row: Model.Row.Instance = column.Row(row_idx);

                for (
                    let part_idx = 0, part_end = row.Micro_Part_Count();
                    part_idx < part_end;
                    part_idx += 1
                ) {
                    const part = row.Micro_Part(part_idx);
                    const size: Float | null = part.Size();
                    const language_name: Language.Name | null = part.Language();
                    const script_position: Script_Position = part.Script_Position();

                    let styles: string | null = null;

                    if (part.Is_Command()) {
                        let it: Unicode.Iterator = new Unicode.Iterator(
                            {
                                text: part.Value(),
                                index: 0,
                            },
                        );

                        if (size != null) {
                            styles = this.Resize_Styles_String(
                                styles,
                                size,
                                script_position,
                            );
                        }

                        for (; !it.Is_At_End(); it = it.Next()) {
                            inner_html +=
                                `<span ` +
                                `class="COMMAND SEPARATE_POINT" ` +
                                `data-language="${language_name || ``}" ` +
                                `style="${styles || ``}" ` +
                                `>` +
                                Escape_Text(it.Point()) +
                                `</span>`;
                        }
                    } else {
                        let classes: string = ``;

                        if (part.Is_Letter()) {
                            classes += `KNOWN_LETTER SEPARATE_POINT`;
                        } else if (part.Is_Marker()) {
                            classes += `KNOWN_MARKER SEPARATE_POINT`;
                        } else if (part.Is_Point()) {
                            classes += `UNKNOWN_POINT SEPARATE_POINT`;
                        } else {
                            Utils.Assert(
                                false,
                                `invalid micro part.`,
                            );
                        }

                        if (language_name != null) {
                            Utils.Assert(
                                DEFAULT_FONT_STYLES[language_name] != null,
                                `should have default_font_styles for ${language_name}!`,
                            );

                            styles = DEFAULT_FONT_STYLES[language_name][script_position];
                        }

                        if (size != null) {
                            styles = this.Resize_Styles_String(
                                styles,
                                size,
                                script_position,
                            );
                        }

                        inner_html +=
                            `<span ` +
                            `class="${classes}" ` +
                            `data-language="${language_name || ``}" ` +
                            `style="${styles || ``}" ` +
                            `>` +
                            Escape_Text(part.Value()) +
                            `</span>`;
                    }
                }
            }
        }

        return inner_html;
    }

    private Resize_Styles_String(
        styles: string | null,
        size: Float,
        script_position: Script_Position,
    ):
        string
    {
        if (styles == null) {
            const language_name: Language.Name =
                this.keyboard_hook.Keyboard().Current_Language_Name();

            styles = DEFAULT_FONT_STYLES[language_name][script_position];
        }

        styles = styles.replace(
            /font-size\s*:\s*(\d+)/,
            function (
                match: string,
                px: string,
            ):
                string
            {
                return `font-size:${parseFloat(px) * size}`;
            },
        );

        styles = styles.replace(
            /line-height\s*:\s*(\d+)/,
            function (
                match: string,
                px: string,
            ):
                string
            {
                return `line-height:${parseFloat(px) * size}`;
            },
        );

        return styles;
    }

    Try_To_Update_Dictionary_With_Parts():
        void
    {
        const dictionary: Model.Dictionary.Instance =
            this.Editor().Dictionary();
        const model: Model.Instance = new Model.Instance(
            {
                dictionary: dictionary,
                value: this.Text(),
            },
        );

        dictionary.Add_All_Possible_From_Text(model);
    }
}

class Editor
{
    private dictionary: Model.Dictionary.Instance;
    private lines: Array<Line>;

    private saved_dictionary: string | null;
    private saved_file: string | null;

    private is_meta_key_active: boolean;
    private is_in_point_mode: boolean;
    private are_rows_expanded: boolean;
    private will_touch_by_request: boolean;
    private direction: Language.Direction;

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
        this.are_rows_expanded = true;
        this.will_touch_by_request = false;
        this.direction = Language.Direction.LEFT_TO_RIGHT;

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
                padding: 7px 7px 0 7px;

                border-width: 0;

                background-color: #0f1318;
                color: #E0ECFF;

                overflow-y: auto;
            `,
        );

        this.element.addEventListener(
            `keydown`,
            this.On_Key_Down.bind(this),
            {
                capture: true,
            },
        );
        this.element.addEventListener(
            `keyup`,
            this.On_Key_Up.bind(this),
            {
                capture: true,
            },
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

                font-size: 16px;
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
                    const text_offset: Count = Text_Offset(this.children.dictionary_name) as Count;

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
                        this.Dictionary().To_JSON() !== new Model.Dictionary.Instance({}).To_JSON() :
                        this.saved_dictionary !== this.Dictionary().To_JSON()
                ) {
                    if (!await this.Try_To_Save_Dictionary()) {
                        return;
                    }
                }

                this.Set_Dictionary_Name(`New Dictionary`);
                this.dictionary = new Model.Dictionary.Instance({});
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
                    await this.Set_Dictionary_JSON(file_text);
                    this.children.dictionary_load_input.value = ``;

                    this.saved_dictionary = this.Dictionary().To_JSON();
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
                    this.saved_dictionary == null ?
                        this.Dictionary().To_JSON() !== new Model.Dictionary.Instance({}).To_JSON() :
                        this.saved_dictionary !== this.Dictionary().To_JSON()
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
                    const text_offset: Count = Text_Offset(this.children.file_name) as Count;

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

                    Utils.Assert(this.Text() === file_text.replaceAll(/\r/g, ``));
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

        this.dictionary = new Model.Dictionary.Instance({});
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
        Model.Dictionary.Instance
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
        return this.Dictionary().To_JSON();
    }

    async Set_Dictionary_JSON(
        json: string,
    ):
        Promise<void>
    {
        this.dictionary = new Model.Dictionary.Instance(
            {
                json: json,
            },
        );

        if (this.dictionary.Maybe_Validation_Error() != null) {
            this.dictionary = new Model.Dictionary.Instance();
            await this.Message_Invalid_Dictionary_JSON();
        }

        this.Touch();
    }

    async Message_Invalid_Dictionary_JSON():
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
                modal.classList.add(`Modal`);

                const message: HTMLDivElement = document.createElement(`div`);
                message.classList.add(`Modal_Message`);
                message.innerHTML = `<div>
                    The loaded dictionary is invalid, and probably not a dictionary.
                    You are instead working with a new dictionary.
                </div>`;

                const options: HTMLDivElement = document.createElement(`div`);
                options.classList.add(`Modal_Options`, `Modal_Options_1`);

                const okay_button: HTMLDivElement = document.createElement(`div`);
                okay_button.classList.add(`Modal_Button`);
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
                        resolve(true);
                    }.bind(this),
                );

                options.appendChild(okay_button);

                modal.appendChild(message);
                modal.appendChild(options);
                document.body.appendChild(modal);
            }.bind(this),
        );
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
                modal.classList.add(`Modal`);

                const message: HTMLDivElement = document.createElement(`div`);
                message.classList.add(`Modal_Message`);
                message.innerHTML = `<div>
                    There are unsaved changes to the current dictionary.
                </div>`;

                const options: HTMLDivElement = document.createElement(`div`);
                options.classList.add(`Modal_Options`, `Modal_Options_3`);

                const save_button: HTMLDivElement = document.createElement(`div`);
                save_button.classList.add(`Modal_Button`);
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
                discard_button.classList.add(`Modal_Button`);
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
                cancel_button.classList.add(`Modal_Button`);
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
                modal.classList.add(`Modal`);

                const message: HTMLDivElement = document.createElement(`div`);
                message.classList.add(`Modal_Message`);
                message.innerHTML = `<div>
                    There are unsaved changes to the current file.
                </div>`;

                const options: HTMLDivElement = document.createElement(`div`);
                options.classList.add(`Modal_Options`, `Modal_Options_3`);

                const save_button: HTMLDivElement = document.createElement(`div`);
                save_button.classList.add(`Modal_Button`);
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
                discard_button.classList.add(`Modal_Button`);
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
                cancel_button.classList.add(`Modal_Button`);
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
        Count
    {
        return this.lines.length;
    }

    Lines():
        Array<Line>
    {
        return Array.from(this.lines);
    }

    Line(
        line_index: Index,
    ):
        Line
    {
        Utils.Assert(line_index >= 0);
        Utils.Assert(line_index < this.lines.length);

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
        line_index: Index,
    ):
        void
    {
        Utils.Assert(line_index > 0 || this.lines.length > 1);
        Utils.Assert(line_index < this.lines.length);

        this.lines.splice(line_index, 1)[0].Destruct();
    }

    Insert_Line(
        at_line_index: Index,
        text: string,
    ):
        void
    {
        Utils.Assert(at_line_index >= 0);
        Utils.Assert(at_line_index <= this.lines.length);

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

        if (this.Direction() === Language.Direction.LEFT_TO_RIGHT) {
            this.children.dictionary_name.style.direction = `ltr`;
            this.children.file_name.style.direction = `ltr`;
        } else {
            this.children.dictionary_name.style.direction = `rtl`;
            this.children.file_name.style.direction = `rtl`;
        }

        for (const line of this.lines) {
            line.Touch();
        }
    }

    async Request_Touch():
        Promise<void>
    {
        if (!this.will_touch_by_request) {
            this.will_touch_by_request = true;

            await Utils.Wait_Milliseconds(1);
            this.Touch();

            this.will_touch_by_request = false;
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

    Are_Rows_Expanded():
        boolean
    {
        return this.are_rows_expanded;
    }

    Direction():
        Language.Direction
    {
        return this.direction;
    }

    Set_Direction(
        direction: Language.Direction,
    ):
        void
    {
        this.direction = direction;

        this.Touch();
    }

    Try_To_Update_Dictionary_With_Parts():
        void
    {
        for (const line of this.lines) {
            line.Try_To_Update_Dictionary_With_Parts();
        }
    }

    Highlight_Next(
        targets: Array<string>,
    ):
        void
    {
        const selected_line_idx: Index | null = this.Focused_Line_Index();
        const selection: Selection | null = document.getSelection();
        if (
            selected_line_idx != null &&
            selection != null &&
            !selection.isCollapsed &&
            selection.anchorNode != null &&
            selection.anchorNode === selection.focusNode &&
            (
                (selection.anchorOffset === 0 && selection.focusOffset === 1) ||
                (selection.anchorOffset === 1 && selection.focusOffset === 0)
            )
        ) {
            // we have a highlight already, so we look for the next one in this line or the lines that follow
            const selected_line_element: Element =
                this.lines[selected_line_idx].Element();
            const selected_child_idx: Index =
                Array.from(selected_line_element.children).indexOf(selection.anchorNode as Element);
            Utils.Assert(selected_child_idx > -1);

            const selected_child_element: Element =
                selected_line_element.children[selected_child_idx];
            const next_element: Element | null =
                (function (
                    this: Editor,
                ):
                    Element | null
                {
                    let line_idx: Index = selected_line_idx;
                    let child_idx: Index = selected_child_idx + 1;
                    while (true) {
                        const line: Element = this.lines[line_idx].Element();
                        for (let end = line.children.length; child_idx < end; child_idx += 1) {
                            const child: Element = line.children[child_idx];
                            if (targets.includes((child.textContent || ``).replaceAll(/ /g, ` `))) {
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

            if (next_element) {
                Put_Child_At_Parent_Top_Y(this.children.lines, next_element);
                selection.getRangeAt(0).setStart(next_element, 0);
                selection.getRangeAt(0).setEnd(next_element, 1);
            } else {
                this.lines[0].Element().focus();
                selection.getRangeAt(0).setStart(this.lines[0].Element(), 0);
                selection.getRangeAt(0).setEnd(this.lines[0].Element(), 0);
            }
        } else {
            // we have to look for the first instance and highlight it
            for (let line of this.lines) {
                for (let child of line.Element().children) {
                    if (targets.includes((child.textContent || ``).replaceAll(/ /g, ` `))) {
                        line.Element().focus();

                        const selection: Selection = document.getSelection() as Selection;
                        Put_Child_At_Parent_Top_Y(this.children.lines, child);
                        selection.getRangeAt(0).setStart(child, 0);
                        selection.getRangeAt(0).setEnd(child, 1);
                        return;
                    }
                }
            }

            this.lines[0].Element().focus();
            (document.getSelection() as Selection).getRangeAt(0).setStart(this.lines[0].Element(), 0);
            (document.getSelection() as Selection).getRangeAt(0).setEnd(this.lines[0].Element(), 0);
        }
    }

    Highlight_Next_Class(
        targets: Array<string>,
    ):
        void
    {
        const selected_line_idx: Index | null = this.Focused_Line_Index();
        const selection: Selection | null = document.getSelection();
        if (
            selected_line_idx != null &&
            selection != null &&
            !selection.isCollapsed &&
            selection.anchorNode != null &&
            selection.anchorNode === selection.focusNode &&
            (
                (selection.anchorOffset === 0 && selection.focusOffset === 1) ||
                (selection.anchorOffset === 1 && selection.focusOffset === 0)
            )
        ) {
            // we have a highlight already, so we look for the next one in this line or the lines that follow
            const selected_line_element: Element =
                this.lines[selected_line_idx].Element();
            const selected_child_idx: Index =
                Array.from(selected_line_element.children).indexOf(selection.anchorNode as Element);
            Utils.Assert(selected_child_idx > -1);

            const selected_child_element: Element =
                selected_line_element.children[selected_child_idx];
            const next_element: Element | null =
                (function (
                    this: Editor,
                ):
                    Element | null
                {
                    let line_idx: Index = selected_line_idx;
                    let child_idx: Index = selected_child_idx + 1;
                    while (true) {
                        const line: Element = this.lines[line_idx].Element();
                        for (let end = line.children.length; child_idx < end; child_idx += 1) {
                            const child: Element = line.children[child_idx];
                            for (const class_name of child.classList.values()) {
                                if (targets.includes(class_name)) {
                                    return child;
                                } else if (child === selected_child_element) {
                                    return null;
                                }
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

            if (next_element) {
                Put_Child_At_Parent_Top_Y(this.children.lines, next_element);
                selection.getRangeAt(0).setStart(next_element, 0);
                selection.getRangeAt(0).setEnd(next_element, 1);
            } else {
                this.lines[0].Element().focus();
                selection.getRangeAt(0).setStart(this.lines[0].Element(), 0);
                selection.getRangeAt(0).setEnd(this.lines[0].Element(), 0);
            }
        } else {
            // we have to look for the first instance and highlight it
            for (let line of this.lines) {
                for (let child of line.Element().children) {
                    for (const class_name of child.classList.values()) {
                        if (targets.includes(class_name)) {
                            line.Element().focus();

                            const selection: Selection = document.getSelection() as Selection;
                            Put_Child_At_Parent_Top_Y(this.children.lines, child);
                            selection.getRangeAt(0).setStart(child, 0);
                            selection.getRangeAt(0).setEnd(child, 1);
                            return;
                        }
                    }
                }
            }

            this.lines[0].Element().focus();
            (document.getSelection() as Selection).getRangeAt(0).setStart(this.lines[0].Element(), 0);
            (document.getSelection() as Selection).getRangeAt(0).setEnd(this.lines[0].Element(), 0);
        }
    }

    Focused_Line_Index():
        Index | null
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

    private On_Key_Down(
        event: KeyboardEvent,
    ):
        void
    {
        if (this.Is_Meta_Key_Active()) {
            if (event.key === `ArrowLeft`) {
                event.preventDefault();

                this.Set_Direction(Language.Direction.LEFT_TO_RIGHT);
            } else if (event.key === `ArrowRight`) {
                event.preventDefault();

                this.Set_Direction(Language.Direction.RIGHT_TO_LEFT);
            } else if (event.key === `ArrowDown`) {
                event.preventDefault();

                this.is_in_point_mode = true;
                this.Touch();
            } else if (event.key === `ArrowUp`) {
                event.preventDefault();

                this.is_in_point_mode = false;
                this.Touch();
            } else if (event.key === `|`) {
                event.preventDefault();

                this.are_rows_expanded = !this.are_rows_expanded;
                this.Touch();
            } else if (event.key === `+`) {
                event.preventDefault();

                this.Try_To_Update_Dictionary_With_Parts();
                this.Touch();
            } else if (event.key === `\``) {
                event.preventDefault();

                this.Highlight_Next_Class(
                    [
                        `UNKNOWN_POINT`,
                        `UNKNOWN_WORD`,
                        `UNKNOWN_BREAK`,
                    ],
                );
            } else if (event.key === `1`) {
                event.preventDefault();

                this.Highlight_Next_Class(
                    [
                        `KNOWN_WORD_ERROR`,
                        `KNOWN_BREAK_ERROR`,
                        `BAD_COMMAND`,
                    ],
                );
            } else if (event.key === `~`) {
                event.preventDefault();

                this.Highlight_Next(
                    [
                        `⸨fix⸩`,
                        `⸨/fix⸩`,
                    ],
                );
            } else if (event.key === `!`) {
                event.preventDefault();

                this.Highlight_Next(
                    [
                        `⸨b⸩`,
                        `⸨/b⸩`,
                    ],
                );
            }
        } else if (event.key === `Escape`) {
            event.preventDefault();

            this.is_meta_key_active = true;
        }
    }

    private On_Key_Up(
        event: KeyboardEvent,
    ):
        void
    {
        if (event.key === `Escape`) {
            event.preventDefault();

            this.is_meta_key_active = false;
        }
    }
}

(function Main():
    void
{
    Utils.Create_Style_Element(`
        ${Fonts.Singleton().CSS_Definitions()}
        
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
            font-size: ${UNDERLYING_FONT_SIZE_PX}px;
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
        
        .SUPERSCRIPT {
            /* font-variant-position might be nice, but still experimental in chromium */

            font-size: ${Font.Consts.SUPERSCRIPT_FONT_SIZE_MULTIPLIER}em;
            line-height: ${Font.Consts.SUPERSCRIPT_LINE_HEIGHT_MULTIPLIER}em;
            vertical-align: super;
        }

        .SUBSCRIPT {
            /* font-variant-position might be nice, but still experimental in chromium */

            font-size: ${Font.Consts.SUBSCRIPT_FONT_SIZE_MULTIPLIER}em;
            line-height: ${Font.Consts.SUBSCRIPT_LINE_HEIGHT_MULTIPLIER}em;
            vertical-align: sub;
        }

        .ERROR {
            color: #ffcbcb;
        }

        .Argument {

        }

        .INDENT {
            width: ${INDENT_AMOUNT}em;
        }

        .SEPARATE_POINT {
            display: inline-block;

            min-width: 7px;

            text-align: center;
        }

        .UNKNOWN_POINT {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #ffff00;

            overflow-wrap: normal;
        }

        .KNOWN_LETTER {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .KNOWN_MARKER {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .UNKNOWN_WORD {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #ff5858;

            overflow-wrap: normal;
        }

        .KNOWN_WORD {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .UNKNOWN_BREAK {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #00da6f;

            overflow-wrap: normal;
        }

        .KNOWN_BREAK {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;

            overflow-wrap: normal;
        }

        .KNOWN_WORD_ERROR {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #e767c3;

            overflow-wrap: normal;
        }

        .KNOWN_BREAK_ERROR {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #e767c3;

            overflow-wrap: normal;
        }

        .COMMAND {
            align-self: baseline;

            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;
            
            overflow-wrap: normal;
        }

        .BAD_COMMAND {
            align-self: baseline;
            
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: orange;
            
            overflow-wrap: normal;
        }

        .COLUMN {
            width: 100%;

            text-align: center;
        }

        .COLLAPSED_ROW {

        }

        .EXPANDED_ROW {
            width: 100%;

            text-align: right;
        }

        .MARGIN {
            width: 100%;

            text-align: center;
        }

        .INTERLINEAR {
            width: 100%;

            text-align: center;
        }

        .Modal {
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
        }

        .Modal_Message {
            width: 67%;
            margin: 2px;
            padding: 7px;

            background-color: #0f1318;

            color: #E0ECFF;
            text-align: center;
        }

        .Modal_Options {
            display: grid;
            grid-template-columns: 1fr;

            grid-gap: 12px;

            width: 67%;
            padding: 7px;

            background-color: #0f1318;

            color: #E0ECFF;
        }

        .Modal_Options_1 {
            grid-template-rows: 1fr;
        }

        .Modal_Options_3 {
            grid-template-rows: 1fr 1fr 1fr;
        }

        .Modal_Button {
            display: flex;
            justify-content: center;
            align-items: center;

            border-width: 2px;
            border-style: solid;
            border-color: #3B3A32;

            cursor: pointer;
            user-select: none;
        }
    `);

    new Editor(
        {
            parent: document.body,
        },
    );
})();
