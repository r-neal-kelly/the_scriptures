import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Text from "./instance.js";
import { Value } from "./value.js";
import * as Dictionary from "./dictionary.js";

import { Status } from "./part/status.js";
import { Style } from "./part/style.js";
import * as Command from "./part/command.js";
import * as Word from "./part/word.js";
import * as Break from "./part/break.js";
import * as Letter from "./part/letter.js";
import * as Marker from "./part/marker.js";
import * as Point from "./part/point.js";

export type Points = Array<
    Command.Instance |
    Letter.Instance |
    Marker.Instance |
    Point.Instance
>;

export type Parts = Array<
    Command.Instance |
    Word.Instance |
    Break.Instance |
    Point.Instance
>;

export class Instance
{
    private text: Text.Instance;
    private value: Value;
    private points: Points;
    private parts: Parts;
    private is_centered: boolean;
    private is_indented: boolean;

    constructor(
        {
            text,
            value,
        }: {
            text: Text.Instance,
            value: Value,
        },
    )
    {
        this.text = text;
        this.value = ``;
        this.points = [];
        this.parts = [];
        this.is_centered = false;
        this.is_indented = false;

        this.Set_Value(value);
    }

    Text():
        Text.Instance
    {
        return this.text;
    }

    Index():
        Index
    {
        return this.Text().Line_Index(this);
    }

    Value():
        Value
    {
        return this.value;
    }

    Set_Value(
        value: Value,
    ):
        void
    {
        Utils.Assert(
            !/\r?\n/.test(value),
            `A line cannot have any line-breaks.`,
        );

        this.value = value;
        this.points = [];
        this.parts = [];
        this.is_centered =
            this.value.slice(0, Command.Known_Value.CENTER.length) === Command.Known_Value.CENTER;
        this.is_indented =
            this.value.slice(0, Command.Known_Value.INDENT.length) === Command.Known_Value.INDENT;

        enum Current_Type
        {
            WORD,
            BREAK,
            POINT,
        }

        const dictionary: Dictionary.Instance = this.Text().Dictionary();

        let current_style: Style = Style._NONE_;
        let current_type: Current_Type = Current_Type.POINT;
        let current_start: Unicode.Iterator = new Unicode.Iterator(
            {
                text: this.value,
            },
        );

        let first_non_command_index: Index | null = null;

        for (let it = current_start; !it.Is_At_End();) {
            const maybe_valid_command: Value | null =
                Command.Maybe_Valid_Value_From(it.Points());

            if (maybe_valid_command != null) {
                const command: Command.Instance = new Command.Instance(
                    {
                        value: maybe_valid_command,
                    },
                );
                if (command.Is_Open_Italic()) {
                    current_style |= Style.ITALIC;
                } else if (command.Is_Close_Italic()) {
                    current_style &= ~Style.ITALIC;

                } else if (command.Is_Open_Bold()) {
                    current_style |= Style.BOLD;
                } else if (command.Is_Close_Bold()) {
                    current_style &= ~Style.BOLD;

                } else if (command.Is_Open_Underline()) {
                    current_style |= Style.UNDERLINE;
                } else if (command.Is_Close_Underline()) {
                    current_style &= ~Style.UNDERLINE;

                } else if (command.Is_Open_Small_Caps()) {
                    current_style |= Style.SMALL_CAPS;
                } else if (command.Is_Close_Small_Caps()) {
                    current_style &= ~Style.SMALL_CAPS;

                } else if (command.Is_Open_Error()) {
                    current_style |= Style.ERROR;
                } else if (command.Is_Close_Error()) {
                    current_style &= ~Style.ERROR;
                }

                this.points.push(command);
                this.parts.push(command);

                it = new Unicode.Iterator(
                    {
                        text: it.Text(),
                        index: it.Index() + maybe_valid_command.length,
                    },
                );

                current_start = it;
            } else {
                const this_point: Value = it.Point();
                const next_point: Value | null = it.Look_Forward_Point();
                const next_maybe_valid_command: Value | null = Command.Maybe_Valid_Value_From(
                    it.Look_Forward_Points() || ``,
                );

                if (dictionary.Has_Letter(this_point)) {
                    this.points.push(
                        new Letter.Instance(
                            {
                                value: this_point,
                                style: current_style,
                            },
                        ),
                    );

                    current_type = Current_Type.WORD;
                } else if (dictionary.Has_Marker(this_point)) {
                    this.points.push(
                        new Marker.Instance(
                            {
                                value: this_point,
                                style: current_style,
                            },
                        ),
                    );

                    current_type = Current_Type.BREAK;
                } else {
                    this.points.push(
                        new Point.Instance(
                            {
                                value: this_point,
                                style: current_style,
                            },
                        ),
                    );

                    current_type = Current_Type.POINT;
                }

                if (current_type === Current_Type.WORD) {
                    if (
                        next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Letter(next_point)
                    ) {
                        if (first_non_command_index == null) {
                            first_non_command_index = it.Index();
                        }

                        const word: Value = it.Text().slice(
                            current_start.Index(),
                            it.Look_Forward_Index(),
                        );
                        const status: Status = dictionary.Has_Word(word) ?
                            Status.GOOD :
                            dictionary.Has_Word_Error(word) ?
                                Status.ERROR :
                                Status.UNKNOWN;

                        this.parts.push(
                            new Word.Instance(
                                {
                                    value: word,
                                    status: status,
                                    style: current_style,
                                },
                            ),
                        );

                        current_start = it.Next();
                    }
                } else if (current_type === Current_Type.BREAK) {
                    if (
                        next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Marker(next_point)
                    ) {
                        if (first_non_command_index == null) {
                            first_non_command_index = it.Index();
                        }

                        const break_: Value = it.Text().slice(
                            current_start.Index(),
                            it.Look_Forward_Index(),
                        );
                        const boundary: Dictionary.Boundary = it.Index() === first_non_command_index ?
                            Dictionary.Boundary.START :
                            next_point == null ?
                                Dictionary.Boundary.END :
                                Dictionary.Boundary.MIDDLE;
                        const status: Status = dictionary.Has_Break(break_, boundary) ?
                            Status.GOOD :
                            dictionary.Has_Break_Error(break_, boundary) ?
                                Status.ERROR :
                                Status.UNKNOWN;

                        this.parts.push(
                            new Break.Instance(
                                {
                                    value: break_,
                                    status: status,
                                    style: current_style,
                                },
                            ),
                        );

                        current_start = it.Next();
                    }
                } else if (current_type === Current_Type.POINT) {
                    if (first_non_command_index == null) {
                        first_non_command_index = it.Index();
                    }

                    const point: Value = this_point;

                    this.parts.push(
                        new Point.Instance(
                            {
                                value: point,
                                style: current_style,
                            },
                        ),
                    );

                    current_start = it.Next();
                }

                it = it.Next();
            }
        }
    }

    Points():
        Points
    {
        return Array.from(this.points);
    }

    Parts():
        Parts
    {
        return Array.from(this.parts);
    }

    Is_Centered():
        boolean
    {
        return this.is_centered;
    }

    Is_Indented():
        boolean
    {
        return this.is_indented;
    }
}
