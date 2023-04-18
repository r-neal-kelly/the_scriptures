import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Text from "../text.js";
import * as Parser from "./parser.js";
import * as Compiler from "./compiler.js";
import * as Token from "./token.js";
import * as Node from "./node.js";
import * as Result from "./result.js";

export enum Mode
{
    INITIAL = 0,
    COMPLEX_SEQUENCE = 1 << 0,
    NOT = 1 << 1,
    CASE = 1 << 2,
    ALIGN = 1 << 3,
    META = 1 << 4,
}

export enum Position
{
    ANY_OR_START,
    MIDDLE_OR_END,
    OUT_OF_BOUNDS,
}

export class Instance
{
    private parser: Parser.Instance;
    private compiler: Compiler.Instance;
    // We could cache results of expression by the text's value.

    constructor()
    {
        this.parser = new Parser.Instance();
        this.compiler = new Compiler.Instance();
    }

    Execute(
        expression: string,
        text: Text.Instance,
    ):
        Array<Result.Instance> | Parser.Help
    {
        const tokens_or_help: Array<Token.Instance> | Parser.Help =
            this.parser.Parse(
                expression,
                text.Dictionary(),
            );
        if (tokens_or_help instanceof Parser.Help) {
            return tokens_or_help as Parser.Help;
        } else {
            const node: Node.Instance =
                this.compiler.Compile(
                    tokens_or_help as Array<Token.Instance>,
                );
            const results: Array<Result.Instance> = [];

            for (let idx = 0, end = text.Line_Count(); idx < end; idx += 1) {
                const line: Text.Line.Instance = text.Line(idx);
                const maybe_result: Result.Instance | null = this.Step(
                    node,
                    Mode.INITIAL,
                    Position.ANY_OR_START,
                    new Result.Instance(line),
                );
                if (maybe_result != null) {
                    results.push(maybe_result as Result.Instance);
                }
            }

            return results;
        }
    }

    private Step(
        node: Node.Instance,
        mode: Mode,
        position: Position,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const node_type: Node.Type = node.Type();
        if (
            node_type === Node.Type.MAYBE_ONE ||
            node_type === Node.Type.MAYBE_MANY ||
            node_type === Node.Type.ONE_OR_MANY
        ) {
            const unary: Node.Unary = node as Node.Unary;
            const maybe_next_result: Result.Instance | null =
                this.Step(unary.Next(), mode, position, result.Copy());
            const maybe_operand_result: Result.Instance | null =
                this.Step(unary.Operand(), mode, position, result.Copy());

            if (maybe_next_result != null) {
                if (maybe_operand_result != null) {
                    return maybe_next_result.Combine(maybe_operand_result);
                } else {
                    return maybe_next_result as Result.Instance;
                }
            } else if (maybe_operand_result != null) {
                return maybe_operand_result as Result.Instance;
            } else {
                return null;
            }

        } else if (node_type === Node.Type.SEQUENCE) {
            const sequence: Node.Sequence = node as Node.Sequence;
            const sequence_result: Result.Instance | null = this.Step(
                sequence.Operand(),
                sequence.Is_Complex() ?
                    mode | Mode.COMPLEX_SEQUENCE :
                    mode,
                Position.ANY_OR_START,
                new Result.Instance(result.Line()),
            );

            if (sequence_result != null) {
                return this.Step(
                    sequence.Next(),
                    mode,
                    position,
                    result.Combine(sequence_result as Result.Instance),
                );
            } else {
                return null;
            }

        } else if (node_type === Node.Type.NOT) {
            const not: Node.Not = node as Node.Not;
            const not_result: Result.Instance | null = this.Step(
                not.Operand(),
                mode ^ Mode.NOT,
                position,
                result,
            );

            if (not_result != null) {
                return this.Step(
                    not.Next(),
                    mode,
                    position,
                    not_result,
                );
            } else {
                return null;
            }

        } else if (node_type === Node.Type.CASE) {
            const case_: Node.Case = node as Node.Case;
            const case_result: Result.Instance | null = this.Step(
                case_.Operand(),
                mode ^ Mode.CASE,
                position,
                result,
            );

            if (case_result != null) {
                return this.Step(
                    case_.Next(),
                    mode,
                    position,
                    case_result,
                );
            } else {
                return null;
            }

        } else if (node_type === Node.Type.ALIGN) {
            const align: Node.Align = node as Node.Align;
            const align_result: Result.Instance | null = this.Step(
                align.Operand(),
                mode ^ Mode.ALIGN,
                position,
                result,
            );

            if (align_result != null) {
                return this.Step(
                    align.Next(),
                    mode,
                    position,
                    align_result,
                );
            } else {
                return null;
            }

        } else if (node_type === Node.Type.META) {
            const meta: Node.Meta = node as Node.Meta;
            const meta_result: Result.Instance | null = this.Step(
                meta.Operand(),
                mode ^ Mode.META,
                position,
                result,
            );

            if (meta_result != null) {
                return this.Step(
                    meta.Next(),
                    mode,
                    position,
                    meta_result,
                );
            } else {
                return null;
            }

        } else if (node_type === Node.Type.XOR) {
            const xor: Node.Xor = node as Node.Xor;
            const maybe_left_result: Result.Instance | null =
                this.Step(xor.Left_Operand(), mode, position, result.Copy());
            const maybe_right_result: Result.Instance | null =
                this.Step(xor.Right_Operand(), mode, position, result.Copy());

            if (maybe_left_result != null) {
                if (maybe_right_result != null) {
                    return null;
                } else {
                    return maybe_left_result as Result.Instance;
                }
            } else if (maybe_right_result != null) {
                return maybe_right_result as Result.Instance;
            } else {
                return null;
            }

        } else if (node_type === Node.Type.OR) {
            const or: Node.Or = node as Node.Or;
            const maybe_left_result: Result.Instance | null =
                this.Step(or.Left_Operand(), mode, position, result.Copy());
            const maybe_right_result: Result.Instance | null =
                this.Step(or.Right_Operand(), mode, position, result.Copy());

            if (maybe_left_result != null) {
                if (maybe_right_result != null) {
                    return maybe_left_result.Combine(maybe_right_result);
                } else {
                    return maybe_left_result as Result.Instance;
                }
            } else if (maybe_right_result != null) {
                return maybe_right_result as Result.Instance;
            } else {
                return null;
            }

        } else if (node_type === Node.Type.TEXT) {
            const text: Node.Text = node as Node.Text;
            if (position === Position.ANY_OR_START) {
                let text_result_any: Result.Instance | null;
                if (mode & Mode.COMPLEX_SEQUENCE) {
                    text_result_any = this.Complex_Sequence_Any(text, mode, result);
                } else {
                    text_result_any = this.Sequence_Any(text, mode, result);
                }
                if (text_result_any != null) {
                    text_result_any = this.Step(
                        text.Next(),
                        mode,
                        Position.OUT_OF_BOUNDS,
                        text_result_any,
                    );
                    if (text_result_any != null) {
                        return text_result_any;
                    } else {
                        let text_result_start: Result.Instance | null;
                        if (mode & Mode.COMPLEX_SEQUENCE) {
                            text_result_start = this.Complex_Sequence_Start(text, mode, result);
                        } else {
                            text_result_start = this.Sequence_Start(text, mode, result);
                        }
                        if (text_result_start != null) {
                            return this.Step(
                                text.Next(),
                                mode,
                                Position.MIDDLE_OR_END,
                                text_result_start,
                            );
                        } else {
                            return null;
                        }
                    }
                } else {
                    let text_result_start: Result.Instance | null;
                    if (mode & Mode.COMPLEX_SEQUENCE) {
                        text_result_start = this.Complex_Sequence_Start(text, mode, result);
                    } else {
                        text_result_start = this.Sequence_Start(text, mode, result);
                    }
                    if (text_result_start != null) {
                        return this.Step(
                            text.Next(),
                            mode,
                            Position.MIDDLE_OR_END,
                            text_result_start,
                        );
                    } else {
                        return null;
                    }
                }
            } else if (position === Position.MIDDLE_OR_END) {
                let text_result_middle: Result.Instance | null;
                if (mode & Mode.COMPLEX_SEQUENCE) {
                    text_result_middle = this.Complex_Sequence_Middle(text, mode, result);
                } else {
                    text_result_middle = this.Sequence_Middle(text, mode, result);
                }
                if (text_result_middle != null) {
                    text_result_middle = this.Step(
                        text.Next(),
                        mode,
                        Position.MIDDLE_OR_END,
                        text_result_middle,
                    );
                    if (text_result_middle != null) {
                        return text_result_middle;
                    } else {
                        let text_result_end: Result.Instance | null;
                        if (mode & Mode.COMPLEX_SEQUENCE) {
                            text_result_end = this.Complex_Sequence_End(text, mode, result);
                        } else {
                            text_result_end = this.Sequence_End(text, mode, result);
                        }
                        if (text_result_end != null) {
                            return this.Step(
                                text.Next(),
                                mode,
                                Position.OUT_OF_BOUNDS,
                                text_result_end,
                            );
                        } else {
                            return null;
                        }
                    }
                } else {
                    let text_result_end: Result.Instance | null;
                    if (mode & Mode.COMPLEX_SEQUENCE) {
                        text_result_end = this.Complex_Sequence_End(text, mode, result);
                    } else {
                        text_result_end = this.Sequence_End(text, mode, result);
                    }
                    if (text_result_end != null) {
                        return this.Step(
                            text.Next(),
                            mode,
                            Position.OUT_OF_BOUNDS,
                            text_result_end,
                        );
                    } else {
                        return null;
                    }
                }

            } else {
                return null;

            }

        } else if (node_type === Node.Type.END) {
            return result;

        } else {
            Utils.Assert(
                false,
                `Unknown node_type: ${node_type}`,
            );

            return null;

        }
    }

    private Sequence_Any(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        Utils.Assert(
            result.Match_Count() === 0,
            `Should not have any matches at any.`,
        );

        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let search_idx = 0, search_end = search_line.Macro_Part_Count();
            search_idx < search_end;
            search_idx += 1
        ) {
            if (
                (mode & Mode.META) ||
                !search_line.Macro_Part(search_idx).Is_Command()
            ) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (mode & Mode.ALIGN) {
                    if (search_value === expression_value) {
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: search_idx,
                                    end_part_index: search_idx + 1,
                                    first_part_first_unit_index: 0,
                                    last_part_end_unit_index: search_value.length,
                                },
                            ),
                        );
                    }
                } else {
                    let is_match: boolean = false;
                    let first_part_first_unit_index: Index = 0;
                    let last_part_end_unit_index: Index = 0;
                    for (
                        let search_value_idx = 0, search_value_end = search_value.length;
                        search_value_idx < search_value_end - (expression_value.length - 1);
                    ) {
                        if (!is_match) {
                            if (
                                search_value.slice(
                                    search_value_idx,
                                    search_value_idx + expression_value.length,
                                ) === expression_value
                            ) {
                                is_match = true;
                                first_part_first_unit_index = search_value_idx;
                                search_value_idx += expression_value.length;
                                last_part_end_unit_index = search_value_idx;
                            } else {
                                search_value_idx += 1;
                            }
                        } else {
                            if (
                                search_value.slice(
                                    search_value_idx,
                                    search_value_idx + expression_value.length,
                                ) === expression_value
                            ) {
                                search_value_idx += expression_value.length;
                                last_part_end_unit_index = search_value_idx;
                            } else {
                                break;
                            }
                        }
                    }
                    if (is_match) {
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: search_idx,
                                    end_part_index: search_idx + 1,
                                    first_part_first_unit_index: first_part_first_unit_index,
                                    last_part_end_unit_index: last_part_end_unit_index,
                                },
                            ),
                        );
                    }
                }
            }
        }
        if (mode & Mode.NOT) {
            if (new_result.Match_Count() > 0) {
                return null;
            } else {
                return new_result;
            }
        } else {
            if (new_result.Match_Count() > 0) {
                return new_result;
            } else {
                return null;
            }
        }
    }

    private Sequence_Start(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        Utils.Assert(
            result.Match_Count() === 0,
            `Should not have any matches at start.`,
        );

        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let search_idx = 0, search_end = search_line.Macro_Part_Count();
            search_idx < search_end;
            search_idx += 1
        ) {
            if (
                (mode & Mode.META) ||
                !search_line.Macro_Part(search_idx).Is_Command()
            ) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (mode & Mode.ALIGN) {
                    if (search_value === expression_value) {
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: search_idx,
                                    end_part_index: search_idx + 1,
                                    first_part_first_unit_index: 0,
                                    last_part_end_unit_index: search_value.length,
                                },
                            ),
                        );
                    }
                } else {
                    if (
                        search_value.length >= expression_value.length &&
                        search_value.slice(
                            search_value.length - expression_value.length,
                            search_value.length,
                        ) === expression_value
                    ) {
                        let first_part_first_unit_index =
                            search_value.length - expression_value.length;
                        for (
                            let search_value_idx = first_part_first_unit_index, search_value_end = 0;
                            search_value_idx > search_value_end + (expression_value.length - 1);
                        ) {
                            if (
                                search_value.slice(
                                    search_value_idx - expression_value.length,
                                    search_value_idx,
                                ) === expression_value
                            ) {
                                search_value_idx -= expression_value.length;
                                first_part_first_unit_index = search_value_idx;
                            } else {
                                break;
                            }
                        }
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: search_idx,
                                    end_part_index: search_idx + 1,
                                    first_part_first_unit_index: first_part_first_unit_index,
                                    last_part_end_unit_index: search_value.length,
                                },
                            ),
                        );
                    }
                }
            }
        }
        if (mode & Mode.NOT) {
            return new_result;
        } else {
            if (new_result.Match_Count() > 0) {
                return new_result;
            } else {
                return null;
            }
        }
    }

    private Sequence_Middle(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let match_idx = 0, match_end = result.Match_Count();
            match_idx < match_end;
            match_idx += 1
        ) {
            const old_match: Result.Match = result.Match(match_idx);
            let search_idx: Index = old_match.End_Part_Index();
            const search_end: Index = search_line.Macro_Part_Count();
            let command_count: Count = 0;
            if (!(mode & Mode.META)) {
                while (
                    search_idx + command_count < search_end &&
                    search_line.Macro_Part(search_idx + command_count).Is_Command()
                ) {
                    command_count += 1;
                }
            }
            if (search_idx + command_count < search_end) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx + command_count);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (search_value === expression_value) {
                    new_result.Try_Add_Match(
                        new Result.Match(
                            {
                                first_part_index: old_match.First_Part_Index(),
                                end_part_index: search_idx + command_count + 1,
                                first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                last_part_end_unit_index: search_value.length,
                            },
                        ),
                    );
                }
            }
        }
        if (mode & Mode.NOT) {
            return new_result;
        } else {
            if (new_result.Match_Count() > 0) {
                return new_result;
            } else {
                return null;
            }
        }
    }

    private Sequence_End(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let match_idx = 0, match_end = result.Match_Count();
            match_idx < match_end;
            match_idx += 1
        ) {
            const old_match: Result.Match = result.Match(match_idx);
            let search_idx: Index = old_match.End_Part_Index();
            const search_end: Index = search_line.Macro_Part_Count();
            let command_count: Count = 0;
            if (!(mode & Mode.META)) {
                while (
                    search_idx + command_count < search_end &&
                    search_line.Macro_Part(search_idx + command_count).Is_Command()
                ) {
                    command_count += 1;
                }
            }
            if (search_idx + command_count < search_end) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx + command_count);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (mode & Mode.ALIGN) {
                    if (search_value === expression_value) {
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: old_match.First_Part_Index(),
                                    end_part_index: search_idx + command_count + 1,
                                    first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                    last_part_end_unit_index: search_value.length,
                                },
                            ),
                        );
                    }
                } else {
                    if (
                        search_value.length >= expression_value.length &&
                        search_value.slice(
                            0,
                            expression_value.length,
                        ) === expression_value
                    ) {
                        let last_part_end_unit_index =
                            expression_value.length;
                        for (
                            let search_value_idx = last_part_end_unit_index, search_value_end = search_value.length;
                            search_value_idx < search_value_end - (expression_value.length - 1);
                        ) {
                            if (
                                search_value.slice(
                                    search_value_idx,
                                    search_value_idx + expression_value.length,
                                ) === expression_value
                            ) {
                                search_value_idx += expression_value.length;
                                last_part_end_unit_index = search_value_idx;
                            } else {
                                break;
                            }
                        }
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: old_match.First_Part_Index(),
                                    end_part_index: search_idx + command_count + 1,
                                    first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                    last_part_end_unit_index: last_part_end_unit_index,
                                },
                            ),
                        );
                    }
                }
            }
        }
        if (mode & Mode.NOT) {
            if (new_result.Match_Count() > 0) {
                return null;
            } else {
                return new_result;
            }
        } else {
            if (new_result.Match_Count() > 0) {
                return new_result;
            } else {
                return null;
            }
        }
    }

    private Complex_Sequence_Any(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        Utils.Assert(
            result.Match_Count() === 0,
            `Should not have any matches at any.`,
        );

        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let search_idx = 0, search_end = search_line.Macro_Part_Count();
            search_idx < search_end;
            search_idx += 1
        ) {
            if (
                (mode & Mode.META) ||
                !search_line.Macro_Part(search_idx).Is_Command()
            ) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (mode & Mode.ALIGN) {
                    if (mode & Mode.NOT) {
                        if (search_value !== expression_value) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: 0,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    } else {
                        if (search_value === expression_value) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: 0,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    }
                } else {
                    let is_match: boolean = false;
                    let first_part_first_unit_index: Index = 0;
                    let last_part_end_unit_index: Index = 0;
                    for (
                        let search_value_idx = 0, search_value_end = search_value.length;
                        search_value_idx < search_value_end - (expression_value.length - 1);
                    ) {
                        if (!is_match) {
                            if (
                                search_value.slice(
                                    search_value_idx,
                                    search_value_idx + expression_value.length,
                                ) === expression_value
                            ) {
                                is_match = true;
                                first_part_first_unit_index = search_value_idx;
                                search_value_idx += expression_value.length;
                                last_part_end_unit_index = search_value_idx;
                            } else {
                                search_value_idx += 1;
                            }
                        } else {
                            if (
                                search_value.slice(
                                    search_value_idx,
                                    search_value_idx + expression_value.length,
                                ) === expression_value
                            ) {
                                search_value_idx += expression_value.length;
                                last_part_end_unit_index = search_value_idx;
                            } else {
                                break;
                            }
                        }
                    }
                    if (mode & Mode.NOT) {
                        if (!is_match) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: 0,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    } else {
                        if (is_match) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: first_part_first_unit_index,
                                        last_part_end_unit_index: last_part_end_unit_index,
                                    },
                                ),
                            );
                        }
                    }
                }
            }
        }
        if (new_result.Match_Count() > 0) {
            return new_result;
        } else {
            return null;
        }
    }

    private Complex_Sequence_Start(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        Utils.Assert(
            result.Match_Count() === 0,
            `Should not have any matches at start.`,
        );

        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let search_idx = 0, search_end = search_line.Macro_Part_Count();
            search_idx < search_end;
            search_idx += 1
        ) {
            if (
                (mode & Mode.META) ||
                !search_line.Macro_Part(search_idx).Is_Command()
            ) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (mode & Mode.ALIGN) {
                    if (mode & Mode.NOT) {
                        if (search_value !== expression_value) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: 0,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    } else {
                        if (search_value === expression_value) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: 0,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    }
                } else {
                    if (mode & Mode.NOT) {
                        if (
                            search_value.length < expression_value.length ||
                            search_value.slice(
                                search_value.length - expression_value.length,
                                search_value.length,
                            ) !== expression_value
                        ) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: 0,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    } else {
                        if (
                            search_value.length >= expression_value.length &&
                            search_value.slice(
                                search_value.length - expression_value.length,
                                search_value.length,
                            ) === expression_value
                        ) {
                            let first_part_first_unit_index =
                                search_value.length - expression_value.length;
                            for (
                                let search_value_idx = first_part_first_unit_index, search_value_end = 0;
                                search_value_idx > search_value_end + (expression_value.length - 1);
                            ) {
                                if (
                                    search_value.slice(
                                        search_value_idx - expression_value.length,
                                        search_value_idx,
                                    ) === expression_value
                                ) {
                                    search_value_idx -= expression_value.length;
                                    first_part_first_unit_index = search_value_idx;
                                } else {
                                    break;
                                }
                            }
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + 1,
                                        first_part_first_unit_index: first_part_first_unit_index,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    }
                }
            }
        }
        if (new_result.Match_Count() > 0) {
            return new_result;
        } else {
            return null;
        }
    }

    private Complex_Sequence_Middle(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let match_idx = 0, match_end = result.Match_Count();
            match_idx < match_end;
            match_idx += 1
        ) {
            const old_match: Result.Match = result.Match(match_idx);
            let search_idx: Index = old_match.End_Part_Index();
            const search_end: Index = search_line.Macro_Part_Count();
            let command_count: Count = 0;
            if (!(mode & Mode.META)) {
                while (
                    search_idx + command_count < search_end &&
                    search_line.Macro_Part(search_idx + command_count).Is_Command()
                ) {
                    command_count += 1;
                }
            }
            if (search_idx + command_count < search_end) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx + command_count);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (mode & Mode.NOT) {
                    if (search_value !== expression_value) {
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: old_match.First_Part_Index(),
                                    end_part_index: search_idx + command_count + 1,
                                    first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                    last_part_end_unit_index: search_value.length,
                                },
                            ),
                        );
                    }
                } else {
                    if (search_value === expression_value) {
                        new_result.Try_Add_Match(
                            new Result.Match(
                                {
                                    first_part_index: old_match.First_Part_Index(),
                                    end_part_index: search_idx + command_count + 1,
                                    first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                    last_part_end_unit_index: search_value.length,
                                },
                            ),
                        );
                    }
                }
            }
        }
        if (new_result.Match_Count() > 0) {
            return new_result;
        } else {
            return null;
        }
    }

    private Complex_Sequence_End(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const search_line: Text.Line.Instance = result.Line();
        const expression_part: Text.Part.Instance = text.Part();
        const expression_value: Text.Value = mode & Mode.CASE ?
            expression_part.Value() :
            expression_part.Value().toLowerCase();

        const new_result: Result.Instance = new Result.Instance(result.Line());
        for (
            let match_idx = 0, match_end = result.Match_Count();
            match_idx < match_end;
            match_idx += 1
        ) {
            const old_match: Result.Match = result.Match(match_idx);
            let search_idx: Index = old_match.End_Part_Index();
            const search_end: Index = search_line.Macro_Part_Count();
            let command_count: Count = 0;
            if (!(mode & Mode.META)) {
                while (
                    search_idx + command_count < search_end &&
                    search_line.Macro_Part(search_idx + command_count).Is_Command()
                ) {
                    command_count += 1;
                }
            }
            if (search_idx + command_count < search_end) {
                const search_part: Text.Part.Instance =
                    search_line.Macro_Part(search_idx + command_count);
                const search_value: Text.Value = mode & Mode.CASE ?
                    search_part.Value() :
                    search_part.Value().toLowerCase();
                if (mode & Mode.ALIGN) {
                    if (mode & Mode.NOT) {
                        if (search_value !== expression_value) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: old_match.First_Part_Index(),
                                        end_part_index: search_idx + command_count + 1,
                                        first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    } else {
                        if (search_value === expression_value) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: old_match.First_Part_Index(),
                                        end_part_index: search_idx + command_count + 1,
                                        first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    }
                } else {
                    if (mode & Mode.NOT) {
                        if (
                            search_value.length < expression_value.length ||
                            search_value.slice(
                                0,
                                expression_value.length,
                            ) !== expression_value
                        ) {
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: old_match.First_Part_Index(),
                                        end_part_index: search_idx + command_count + 1,
                                        first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    } else {
                        if (
                            search_value.length >= expression_value.length &&
                            search_value.slice(
                                0,
                                expression_value.length,
                            ) === expression_value
                        ) {
                            let last_part_end_unit_index =
                                expression_value.length;
                            for (
                                let search_value_idx = last_part_end_unit_index, search_value_end = search_value.length;
                                search_value_idx < search_value_end - (expression_value.length - 1);
                            ) {
                                if (
                                    search_value.slice(
                                        search_value_idx,
                                        search_value_idx + expression_value.length,
                                    ) === expression_value
                                ) {
                                    search_value_idx += expression_value.length;
                                    last_part_end_unit_index = search_value_idx;
                                } else {
                                    break;
                                }
                            }
                            new_result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: old_match.First_Part_Index(),
                                        end_part_index: search_idx + command_count + 1,
                                        first_part_first_unit_index: old_match.First_Part_First_Unit_Index(),
                                        last_part_end_unit_index: last_part_end_unit_index,
                                    },
                                ),
                            );
                        }
                    }
                }
            }
        }
        if (new_result.Match_Count() > 0) {
            return new_result;
        } else {
            return null;
        }
    }
}
