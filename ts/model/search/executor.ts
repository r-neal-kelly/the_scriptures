import { Count } from "../../types.js";

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
    SEQUENCE = 1 << 0,
    NOT = 1 << 1,
    CASE = 1 << 2,
    ALIGN = 1 << 3,
    META = 1 << 4,
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
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const node_type: Node.Type = node.Type();
        if (node_type === Node.Type.SEQUENCE) {
            const sequence: Node.Sequence = node as Node.Sequence;
            const sequence_result: Result.Instance | null = this.Step(
                sequence.Operand(),
                mode | Mode.SEQUENCE,
                new Result.Instance(result.Line()),
            );

            if (sequence_result != null) {
                return this.Step(
                    sequence.Next(),
                    mode,
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
                result,
            );

            if (not_result != null) {
                return this.Step(
                    not.Next(),
                    mode,
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
                result,
            );

            if (case_result != null) {
                return this.Step(
                    case_.Next(),
                    mode,
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
                result,
            );

            if (align_result != null) {
                return this.Step(
                    align.Next(),
                    mode,
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
                result,
            );

            if (meta_result != null) {
                return this.Step(
                    meta.Next(),
                    mode,
                    meta_result,
                );
            } else {
                return null;
            }

        } else if (node_type === Node.Type.XOR) {
            const xor: Node.Xor = node as Node.Xor;
            const maybe_left_result: Result.Instance | null =
                this.Step(xor.Left_Operand(), mode, result.Copy());
            const maybe_right_result: Result.Instance | null =
                this.Step(xor.Right_Operand(), mode, result.Copy());

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
                this.Step(or.Left_Operand(), mode, result.Copy());
            const maybe_right_result: Result.Instance | null =
                this.Step(or.Right_Operand(), mode, result.Copy());

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

            let text_result: Result.Instance | null;
            if (mode & Mode.SEQUENCE) {
                if (mode & Mode.NOT) {
                    text_result = this.Not_Sequence(text, mode, result);
                } else {
                    text_result = this.Sequence(text, mode, result);
                }
            } else {
                if (mode & Mode.NOT) {
                    text_result = this.Not_Text(text, mode, result);
                } else {
                    text_result = this.Text(text, mode, result);
                }
            }
            if (text_result != null) {
                return this.Step(
                    text.Next(),
                    mode,
                    text_result,
                );
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

    private Text(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const search_line: Text.Line.Instance = result.Line();
        const expression_line: Text.Line.Instance = text.Line();

        let found_match: boolean = false;

        for (
            let search_idx = 0, search_end = search_line.Macro_Part_Count();
            search_idx < search_end;
            search_idx += 1
        ) {
            let command_count: Count = 0;
            for (
                let expression_idx = 0, expression_end = expression_line.Macro_Part_Count();
                expression_idx < expression_end;
                expression_idx += 1
            ) {
                if (!(mode & Mode.META)) {
                    while (
                        search_idx + command_count + expression_idx < search_end &&
                        search_line.Macro_Part(search_idx + command_count + expression_idx).Is_Command()
                    ) {
                        command_count += 1;
                    }
                }

                if (search_idx + command_count + expression_idx < search_end) {
                    const search_part: Text.Part.Instance =
                        search_line.Macro_Part(search_idx + command_count + expression_idx);
                    const expression_part: Text.Part.Instance =
                        expression_line.Macro_Part(expression_idx);
                    const search_value: Text.Value =
                        search_part.Value();
                    const expression_value: Text.Value =
                        expression_part.Value();

                    if (search_value === expression_value) {
                        if (expression_idx === expression_end - 1) {
                            found_match = true;
                            result.Try_Add_Match(
                                new Result.Match(
                                    {
                                        first_part_index: search_idx,
                                        end_part_index: search_idx + command_count + expression_end,
                                        first_part_first_unit_index: 0,
                                        last_part_end_unit_index: search_value.length,
                                    },
                                ),
                            );
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        if (found_match) {
            return result;
        } else {
            return null;
        }
    }

    private Not_Text(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const text_result: Result.Instance | null =
            this.Text(text, mode, result);

        if (text_result == null) {
            return result;
        } else {
            return null;
        }
    }

    private Sequence(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        Utils.Assert(
            false,
            `Not implemented yet.`,
        );

        return null;
    }

    private Not_Sequence(
        text: Node.Text,
        mode: Mode,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        Utils.Assert(
            false,
            `Not implemented yet.`,
        );

        return null;
    }
}
