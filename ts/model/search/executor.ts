import * as Utils from "../../utils.js";

import * as Text from "../text.js";
import * as Node from "./node.js";
import * as Result from "./result.js";

export enum Mode
{
    INITIAL = 0,
    SEQUENCED = 1 << 0,
    NEGATED = 1 << 1,
    CASED = 1 << 2,
    ALIGNED = 1 << 3,
}

export class Instance
{
    // We could cache matches by expression + given data (which is from the singleton).

    constructor()
    {
    }

    Execute(
        node: Node.Instance, // make this the expression, and this type will carry parser and compiler. That way we can pass dictionary to parser.
        text: Text.Instance,
    ):
        Array<Result.Instance>
    {
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
                mode | Mode.SEQUENCED,
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
                mode ^ Mode.NEGATED,
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
                mode ^ Mode.CASED,
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
                mode ^ Mode.ALIGNED,
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
            if (mode & Mode.SEQUENCED) {
                if (mode & Mode.NEGATED) {
                    if (mode & Mode.CASED) {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Sequenced_Negated_Cased_Aligned_Text(text, result);
                        } else {
                            text_result = this.Sequenced_Negated_Cased_Text(text, result);
                        }
                    } else {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Sequenced_Negated_Aligned_Text(text, result);
                        } else {
                            text_result = this.Sequenced_Negated_Text(text, result);
                        }
                    }
                } else {
                    if (mode & Mode.CASED) {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Sequenced_Cased_Aligned_Text(text, result);
                        } else {
                            text_result = this.Sequenced_Cased_Text(text, result);
                        }
                    } else {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Sequenced_Aligned_Text(text, result);
                        } else {
                            text_result = this.Sequenced_Text(text, result);
                        }
                    }
                }
            } else {
                if (mode & Mode.NEGATED) {
                    if (mode & Mode.CASED) {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Negated_Cased_Aligned_Text(text, result);
                        } else {
                            text_result = this.Negated_Cased_Text(text, result);
                        }
                    } else {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Negated_Aligned_Text(text, result);
                        } else {
                            text_result = this.Negated_Text(text, result);
                        }
                    }
                } else {
                    if (mode & Mode.CASED) {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Cased_Aligned_Text(text, result);
                        } else {
                            text_result = this.Cased_Text(text, result);
                        }
                    } else {
                        if (mode & Mode.ALIGNED) {
                            text_result = this.Aligned_Text(text, result);
                        } else {
                            text_result = this.Text(text, result);
                        }
                    }
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

    private Sequenced_Negated_Cased_Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Sequenced_Negated_Cased_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Sequenced_Negated_Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Sequenced_Negated_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Sequenced_Cased_Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Sequenced_Cased_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Sequenced_Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Sequenced_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Negated_Cased_Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Negated_Cased_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Negated_Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Negated_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Cased_Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Cased_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Aligned_Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        return result;
    }

    private Text(
        node: Node.Text,
        result: Result.Instance,
    ):
        Result.Instance | null
    {
        const dictionary: Text.Dictionary.Instance =
            result.Line().Text().Dictionary();

        return result;
    }
}
