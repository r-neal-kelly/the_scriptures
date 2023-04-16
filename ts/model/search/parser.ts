import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Unicode from "../../unicode.js";

import * as Text from "../text.js";
import { Operator } from "./operator.js";
import { Boundary } from "./boundary.js";
import * as Token from "./token.js";

export class Help
{
    private message: string;
    private expression_index: Index;

    constructor(
        message: string,
        expression_index: Index,
    )
    {
        this.message = message
            .replace(/\r?\n/g, ` `)
            .replace(/\s+/g, ` `);
        this.expression_index = expression_index;
    }

    Message():
        string
    {
        return this.message;
    }

    Expression_Index():
        Index
    {
        return this.expression_index;
    }
}

export class Instance
{
    // We could cache tokens by expression.

    constructor()
    {
    }

    Parse(
        expression: string,
        dictionary: Text.Dictionary.Instance,
    ):
        Array<Token.Instance> | Help
    {
        const tokens: Array<Token.Instance> = [];

        let last_expression_index: Index = 0;
        let group_depth: Count = 0;
        let sequence_depth: Count = 0;
        let sequence_group_depth: Count = 0;
        let sequence_and_counts: Array<Count> = [];

        function Last():
            Token.Instance | null
        {
            return tokens.length > 0 ?
                tokens[tokens.length - 1] :
                null;
        }

        function Try_Add_And():
            void
        {
            const last_token: Token.Instance | null = Last();
            if (
                last_token != null &&
                (
                    last_token.Type() === Token.Type.CLOSE_GROUP ||
                    last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                    last_token.Type() === Token.Type.TEXT
                )
            ) {
                if (sequence_depth > 0) {
                    sequence_and_counts[sequence_and_counts.length - 1] += 1;
                }
                tokens.push(new Token.And());
            }
        }

        function Add_Text(
            text: Text.Instance,
        ):
            void
        {
            if (sequence_depth < 1) {
                sequence_depth += 1;
                sequence_and_counts.push(0);
                tokens.push(
                    new Token.Open_Sequence(
                        {
                            is_complex: false,
                        },
                    ),
                );
                for (let idx = 0, end = text.Line(0).Macro_Part_Count(); idx < end; idx += 1) {
                    tokens.push(
                        new Token.Text(
                            {
                                part: text.Line(0).Macro_Part(idx),
                            },
                        ),
                    );
                    if (idx < end - 1) {
                        sequence_and_counts[sequence_and_counts.length - 1] += 1;
                        tokens.push(new Token.And());
                    }
                }
                Update_Sequence_Texts();
                sequence_depth -= 1;
                tokens.push(
                    new Token.Close_Sequence(
                        {
                            is_complex: false,
                        },
                    ),
                );
            } else {
                for (let idx = 0, end = text.Line(0).Macro_Part_Count(); idx < end; idx += 1) {
                    tokens.push(
                        new Token.Text(
                            {
                                part: text.Line(0).Macro_Part(idx),
                            },
                        ),
                    );
                    if (idx < end - 1) {
                        sequence_and_counts[sequence_and_counts.length - 1] += 1;
                        tokens.push(new Token.And());
                    }
                }
            }
        }

        function Update_Sequence_Texts():
            void
        {
            let idx = tokens.length;
            const end = 0;
            let group_depth = 0;
            while (sequence_and_counts.length > 0) {
                let sequence_and_count: Count = sequence_and_counts.pop() as Count;
                if (sequence_and_count > 0) {
                    for (; idx > end;) {
                        idx -= 1;
                        if (tokens[idx].Type() === Token.Type.CLOSE_GROUP) {
                            group_depth += 1;
                        } else if (tokens[idx].Type() === Token.Type.OPEN_GROUP) {
                            group_depth -= 1;
                        } else if (tokens[idx].Type() === Token.Type.AND) {
                            sequence_and_count -= 1;
                            break;
                        } else if (tokens[idx].Type() === Token.Type.TEXT) {
                            (tokens[idx] as Token.Text).Set_Boundary(Boundary.END);
                        }
                    }
                    for (; idx > end;) {
                        idx -= 1;
                        if (tokens[idx].Type() === Token.Type.CLOSE_GROUP) {
                            group_depth += 1;
                        } else if (tokens[idx].Type() === Token.Type.OPEN_GROUP) {
                            group_depth -= 1;
                        } else if (tokens[idx].Type() === Token.Type.AND) {
                            sequence_and_count -= 1;
                            if (sequence_and_count === 0) {
                                break;
                            }
                        } else if (tokens[idx].Type() === Token.Type.TEXT) {
                            (tokens[idx] as Token.Text).Set_Boundary(Boundary.MIDDLE);
                        }
                    }
                    for (; idx > end;) {
                        idx -= 1;
                        if (tokens[idx].Type() === Token.Type.CLOSE_GROUP) {
                            group_depth += 1;
                        } else if (tokens[idx].Type() === Token.Type.OPEN_GROUP) {
                            group_depth -= 1;
                        } else if (
                            tokens[idx].Type() === Token.Type.OPEN_SEQUENCE ||
                            (
                                group_depth === 0 &&
                                (
                                    tokens[idx].Type() === Token.Type.XOR ||
                                    tokens[idx].Type() === Token.Type.OR
                                )
                            )
                        ) {
                            break;
                        } else if (tokens[idx].Type() === Token.Type.TEXT) {
                            (tokens[idx] as Token.Text).Set_Boundary(Boundary.START);
                        }
                    }
                } else {
                    for (; idx > end;) {
                        idx -= 1;
                        if (tokens[idx].Type() === Token.Type.CLOSE_GROUP) {
                            group_depth += 1;
                        } else if (tokens[idx].Type() === Token.Type.OPEN_GROUP) {
                            group_depth -= 1;
                        } else if (
                            tokens[idx].Type() === Token.Type.OPEN_SEQUENCE ||
                            (
                                group_depth === 0 &&
                                (
                                    tokens[idx].Type() === Token.Type.XOR ||
                                    tokens[idx].Type() === Token.Type.OR
                                )
                            )
                        ) {
                            break;
                        } else if (tokens[idx].Type() === Token.Type.TEXT) {
                            (tokens[idx] as Token.Text).Set_Boundary(Boundary.ANY);
                        }
                    }
                }
            }
        }

        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: expression,
            },
        );
        for (; !it.Is_At_End(); it = it.Next()) {
            const point: string = it.Point();
            if (!/\s/.test(point)) {
                if (point === Operator.VERBATIM) {
                    Try_Add_And();
                    it = it.Next();
                    if (it.Is_At_End()) {
                        return new Help(
                            `Unclosed ${Operator.VERBATIM}`,
                            it.Previous().Index(),
                        );
                    } else {
                        const first: Unicode.Iterator = it;
                        for (; !it.Is_At_End(); it = it.Next()) {
                            if (it.Point() === Operator.VERBATIM) {
                                break;
                            }
                        }
                        if (it.Is_At_End()) {
                            return new Help(
                                `Unclosed ${Operator.VERBATIM}`,
                                it.Previous().Index(),
                            );
                        } else {
                            const text: Text.Instance = new Text.Instance(
                                {
                                    dictionary: dictionary,
                                    value: expression.slice(first.Index(), it.Index()),
                                },
                            );
                            if (text.Line_Count() > 1) {
                                return new Help(
                                    `Newline inside ${Operator.VERBATIM}`,
                                    it.Index(),
                                );
                            } else if (text.Line(0).Macro_Part_Count() === 0) {
                                return new Help(
                                    `Empty ${Operator.VERBATIM}`,
                                    it.Index(),
                                );
                            } else {
                                last_expression_index = it.Index();
                                Add_Text(text);
                            }
                        }
                    }

                } else if (point === Operator.OPEN_GROUP) {
                    Try_Add_And();
                    last_expression_index = it.Index();
                    group_depth += 1;
                    if (sequence_depth > 0) {
                        sequence_group_depth += 1;
                    }
                    tokens.push(new Token.Open_Group());

                } else if (point === Operator.CLOSE_GROUP) {
                    const last_token: Token.Instance | null = Last();
                    if (last_token == null) {
                        return new Help(
                            `Invalid ${Operator.CLOSE_GROUP} at beginning`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Empty ${Operator.OPEN_GROUP}${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid ${Operator.OPEN_SEQUENCE} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid ${Operator.NOT} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.CASE) {
                        return new Help(
                            `Invalid ${Operator.CASE} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.ALIGN) {
                        return new Help(
                            `Invalid ${Operator.ALIGN} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.META) {
                        return new Help(
                            `Invalid ${Operator.META} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid ${Operator.AND} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid ${Operator.XOR} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid ${Operator.OR} followed by ${Operator.CLOSE_GROUP}`,
                            last_expression_index,
                        );
                    } else if (group_depth < 1) {
                        return new Help(
                            `Extra ${Operator.CLOSE_GROUP}`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        group_depth -= 1;
                        if (sequence_depth > 0) {
                            sequence_group_depth -= 1;
                        }
                        tokens.push(new Token.Close_Group());
                    }

                } else if (point === Operator.OPEN_SEQUENCE) {
                    if (sequence_depth > 0) {
                        return new Help(
                            `Interior ${Operator.OPEN_SEQUENCE} within sequence`,
                            last_expression_index,
                        );
                    } else {
                        Try_Add_And();
                        last_expression_index = it.Index();
                        sequence_depth += 1;
                        sequence_and_counts.push(0);
                        tokens.push(
                            new Token.Open_Sequence(
                                {
                                    is_complex: true,
                                },
                            ),
                        );
                    }

                } else if (point === Operator.CLOSE_SEQUENCE) {
                    const last_token: Token.Instance | null = Last();
                    if (last_token === null) {
                        return new Help(
                            `Invalid ${Operator.CLOSE_SEQUENCE} at beginning`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid ${Operator.OPEN_GROUP} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Empty ${Operator.OPEN_SEQUENCE}${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.CLOSE_SEQUENCE) {
                        return new Help(
                            `Invalid ${Operator.CLOSE_SEQUENCE} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid ${Operator.NOT} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.CASE) {
                        return new Help(
                            `Invalid ${Operator.CASE} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.ALIGN) {
                        return new Help(
                            `Invalid ${Operator.ALIGN} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.META) {
                        return new Help(
                            `Invalid ${Operator.META} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid ${Operator.AND} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid ${Operator.XOR} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid ${Operator.OR} followed by ${Operator.CLOSE_SEQUENCE}`,
                            last_expression_index,
                        );
                    } else if (sequence_depth < 1) {
                        return new Help(
                            `Extra ${Operator.CLOSE_SEQUENCE}`,
                            it.Index(),
                        );
                    } else {
                        Update_Sequence_Texts();
                        last_expression_index = it.Index();
                        sequence_depth -= 1;
                        tokens.push(
                            new Token.Close_Sequence(
                                {
                                    is_complex: true,
                                },
                            ),
                        );
                    }

                } else if (point === Operator.NOT) {
                    Try_Add_And();
                    last_expression_index = it.Index();
                    tokens.push(new Token.Not());

                } else if (point === Operator.CASE) {
                    Try_Add_And();
                    last_expression_index = it.Index();
                    tokens.push(new Token.Case());

                } else if (point === Operator.ALIGN) {
                    Try_Add_And();
                    last_expression_index = it.Index();
                    tokens.push(new Token.Align());

                } else if (point === Operator.META) {
                    Try_Add_And();
                    last_expression_index = it.Index();
                    tokens.push(new Token.Meta());

                } else if (point === Operator.AND) {
                    const last_token: Token.Instance | null = Last();
                    if (last_token === null) {
                        return new Help(
                            `Invalid ${Operator.AND} at beginning`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.OPEN_GROUP}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.OPEN_SEQUENCE}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.NOT}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.CASE) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.CASE}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.ALIGN) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.ALIGN}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.META) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.META}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.AND}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.XOR}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid ${Operator.AND} after ${Operator.OR}`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        if (sequence_depth > 0) {
                            sequence_and_counts[sequence_and_counts.length - 1] += 1;
                        }
                        tokens.push(new Token.And());
                    }

                } else if (point === Operator.XOR) {
                    const last_token: Token.Instance | null = Last();
                    if (last_token === null) {
                        return new Help(
                            `Invalid ${Operator.XOR} at beginning`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.OPEN_GROUP}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.OPEN_SEQUENCE}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.NOT}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.CASE) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.CASE}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.ALIGN) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.ALIGN}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.META) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.META}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.AND}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.XOR}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid ${Operator.XOR} after ${Operator.OR}`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        if (
                            sequence_depth > 0 &&
                            sequence_group_depth === 0
                        ) {
                            sequence_and_counts.push(0);
                        }
                        tokens.push(new Token.Xor());
                    }

                } else if (point === Operator.OR) {
                    const last_token: Token.Instance | null = Last();
                    if (last_token === null) {
                        return new Help(
                            `Invalid ${Operator.OR} at beginning`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.OPEN_GROUP}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.OPEN_SEQUENCE}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.NOT}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.CASE) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.CASE}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.ALIGN) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.ALIGN}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.META) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.META}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.AND}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.XOR}`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid ${Operator.OR} after ${Operator.OR}`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        if (
                            sequence_depth > 0 &&
                            sequence_group_depth === 0
                        ) {
                            sequence_and_counts.push(0);
                        }
                        tokens.push(new Token.Or());
                    }

                } else {
                    Try_Add_And();
                    const first: Unicode.Iterator = it;
                    it = it.Next();
                    for (; !it.Is_At_End(); it = it.Next()) {
                        const point: string = it.Point();
                        if (
                            /\s/.test(point) ||
                            point === Operator.VERBATIM ||
                            point === Operator.OPEN_GROUP ||
                            point === Operator.CLOSE_GROUP ||
                            point === Operator.OPEN_SEQUENCE ||
                            point === Operator.CLOSE_SEQUENCE ||
                            point === Operator.NOT ||
                            point === Operator.CASE ||
                            point === Operator.ALIGN ||
                            point === Operator.META ||
                            point === Operator.AND ||
                            point === Operator.XOR ||
                            point === Operator.OR
                        ) {
                            break;
                        }
                    }
                    const text: Text.Instance = new Text.Instance(
                        {
                            dictionary: dictionary,
                            value: expression.slice(first.Index(), it.Index()),
                        },
                    );
                    it = it.Previous();
                    last_expression_index = first.Index();
                    Add_Text(text);

                }
            }
        }

        if (tokens.length < 1) {
            return new Help(
                `Empty expression`,
                0,
            );

        } else if (group_depth > 0) {
            return new Help(
                `Unclosed ${Operator.OPEN_GROUP}`,
                it.Previous().Index(),
            );

        } else if (sequence_depth > 0) {
            return new Help(
                `Unclosed ${Operator.OPEN_SEQUENCE}`,
                it.Previous().Index(),
            );

        } else {
            const last_token: Token.Instance = tokens[tokens.length - 1];
            if (last_token.Type() === Token.Type.OPEN_GROUP) {
                return new Help(
                    `Invalid ${Operator.OPEN_GROUP} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                return new Help(
                    `Invalid ${Operator.OPEN_SEQUENCE} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.NOT) {
                return new Help(
                    `Invalid ${Operator.NOT} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.CASE) {
                return new Help(
                    `Invalid ${Operator.CASE} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.ALIGN) {
                return new Help(
                    `Invalid ${Operator.ALIGN} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.META) {
                return new Help(
                    `Invalid ${Operator.META} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.AND) {
                return new Help(
                    `Invalid ${Operator.AND} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.XOR) {
                return new Help(
                    `Invalid ${Operator.XOR} at end`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.OR) {
                return new Help(
                    `Invalid ${Operator.OR} at end`,
                    last_expression_index,
                );
            }

        }

        return tokens;
    }
}
