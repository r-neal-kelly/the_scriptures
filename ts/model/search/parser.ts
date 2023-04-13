import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import { Operator } from "./operator.js";
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
    // We could cache tokenized expressions.

    constructor()
    {
    }

    Tokenize(
        expression: string,
    ):
        Array<Token.Instance> | Help
    {
        function Last(
            tokens: Array<Token.Instance>,
        ):
            Token.Instance | null
        {
            return tokens.length > 0 ?
                tokens[tokens.length - 1] :
                null;
        }

        const tokens: Array<Token.Instance> = [];

        let last_expression_index: Index = 0;
        let group_depth: Count = 0;
        let sequence_depth: Count = 0;

        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: expression,
            },
        );
        for (; !it.Is_At_End(); it = it.Next()) {
            const point: string = it.Point();
            if (!/\s/.test(point)) {
                if (point === Operator.VERBATIM) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (
                        last_token != null &&
                        (
                            last_token.Type() === Token.Type.CLOSE_GROUP ||
                            last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                            last_token.Type() === Token.Type.TEXT
                        )
                    ) {
                        tokens.push(new Token.And());
                    }
                    it = it.Next();
                    if (it.Is_At_End()) {
                        return new Help(
                            `Unclosed '${Operator.VERBATIM}'.`,
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
                                `Unclosed '${Operator.VERBATIM}'.`,
                                it.Previous().Index(),
                            );
                        } else {
                            last_expression_index = it.Index();
                            tokens.push(
                                new Token.Text(
                                    expression.slice(first.Index(), it.Index()),
                                ),
                            );
                        }
                    }
                } else if (point === Operator.OPEN_GROUP) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (
                        last_token != null &&
                        (
                            last_token.Type() === Token.Type.CLOSE_GROUP ||
                            last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                            last_token.Type() === Token.Type.TEXT
                        )
                    ) {
                        tokens.push(new Token.And());
                    }
                    last_expression_index = it.Index();
                    group_depth += 1;
                    tokens.push(new Token.Open_Group());
                } else if (point === Operator.CLOSE_GROUP) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (last_token == null) {
                        return new Help(
                            `Invalid '${Operator.CLOSE_GROUP}' at beginning.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Empty '${Operator.OPEN_GROUP}${Operator.CLOSE_GROUP}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid '${Operator.OPEN_SEQUENCE}' followed by '${Operator.CLOSE_GROUP}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid '${Operator.NOT}' followed by '${Operator.CLOSE_GROUP}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.FUZZY) {
                        return new Help(
                            `Invalid '${Operator.FUZZY}' followed by '${Operator.CLOSE_GROUP}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid '${Operator.AND}' followed by '${Operator.CLOSE_GROUP}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid '${Operator.XOR}' followed by '${Operator.CLOSE_GROUP}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid '${Operator.OR}' followed by '${Operator.CLOSE_GROUP}'.`,
                            last_expression_index,
                        );
                    } else if (group_depth < 1) {
                        return new Help(
                            `Extra '${Operator.CLOSE_GROUP}'.`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        group_depth -= 1;
                        tokens.push(new Token.Close_Group());
                    }
                } else if (point === Operator.OPEN_SEQUENCE) {
                    if (sequence_depth > 0) {
                        return new Help(
                            `Interior '${Operator.OPEN_SEQUENCE}' within sequence.`,
                            last_expression_index,
                        );
                    } else {
                        const last_token: Token.Instance | null = Last(tokens);
                        if (
                            last_token != null &&
                            (
                                last_token.Type() === Token.Type.CLOSE_GROUP ||
                                last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                                last_token.Type() === Token.Type.TEXT
                            )
                        ) {
                            tokens.push(new Token.And());
                        }
                        last_expression_index = it.Index();
                        sequence_depth += 1;
                        tokens.push(new Token.Open_Sequence());
                    }
                } else if (point === Operator.CLOSE_SEQUENCE) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (last_token === null) {
                        return new Help(
                            `Invalid '${Operator.CLOSE_SEQUENCE}' at beginning.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid '${Operator.OPEN_GROUP}' followed by '${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Empty '${Operator.OPEN_SEQUENCE}${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.CLOSE_SEQUENCE) {
                        return new Help(
                            `Invalid '${Operator.CLOSE_SEQUENCE}' followed by '${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid '${Operator.NOT}' followed by '${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.FUZZY) {
                        return new Help(
                            `Invalid '${Operator.FUZZY}' followed by '${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid '${Operator.AND}' followed by '${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid '${Operator.XOR}' followed by '${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid '${Operator.OR}' followed by '${Operator.CLOSE_SEQUENCE}'.`,
                            last_expression_index,
                        );
                    } else if (sequence_depth < 1) {
                        return new Help(
                            `Extra '${Operator.CLOSE_SEQUENCE}'.`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        sequence_depth -= 1;
                        tokens.push(new Token.Close_Sequence());
                    }
                } else if (point === Operator.NOT) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (
                        last_token != null &&
                        (
                            last_token.Type() === Token.Type.CLOSE_GROUP ||
                            last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                            last_token.Type() === Token.Type.TEXT
                        )
                    ) {
                        tokens.push(new Token.And());
                    }
                    last_expression_index = it.Index();
                    tokens.push(new Token.Not());
                } else if (point === Operator.FUZZY) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (
                        last_token != null &&
                        (
                            last_token.Type() === Token.Type.CLOSE_GROUP ||
                            last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                            last_token.Type() === Token.Type.TEXT
                        )
                    ) {
                        tokens.push(new Token.And());
                    }
                    last_expression_index = it.Index();
                    tokens.push(new Token.Fuzzy());
                } else if (point === Operator.AND) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (last_token === null) {
                        return new Help(
                            `Invalid '${Operator.AND}' at beginning.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid '${Operator.AND}' after '${Operator.OPEN_GROUP}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid '${Operator.AND}' after '${Operator.OPEN_SEQUENCE}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid '${Operator.AND}' after '${Operator.NOT}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.FUZZY) {
                        return new Help(
                            `Invalid '${Operator.AND}' after '${Operator.FUZZY}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid '${Operator.AND}' after '${Operator.AND}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid '${Operator.AND}' after '${Operator.XOR}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid '${Operator.AND}' after '${Operator.OR}'.`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        tokens.push(new Token.And());
                    }
                } else if (point === Operator.XOR) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (last_token === null) {
                        return new Help(
                            `Invalid '${Operator.XOR}' at beginning.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid '${Operator.XOR}' after '${Operator.OPEN_GROUP}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid '${Operator.XOR}' after '${Operator.OPEN_SEQUENCE}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid '${Operator.XOR}' after '${Operator.NOT}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.FUZZY) {
                        return new Help(
                            `Invalid '${Operator.XOR}' after '${Operator.FUZZY}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid '${Operator.XOR}' after '${Operator.AND}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid '${Operator.XOR}' after '${Operator.XOR}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid '${Operator.XOR}' after '${Operator.OR}'.`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        tokens.push(new Token.Xor());
                    }
                } else if (point === Operator.OR) {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (last_token === null) {
                        return new Help(
                            `Invalid '${Operator.OR}' at beginning.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                        return new Help(
                            `Invalid '${Operator.OR}' after '${Operator.OPEN_GROUP}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                        return new Help(
                            `Invalid '${Operator.OR}' after '${Operator.OPEN_SEQUENCE}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.NOT) {
                        return new Help(
                            `Invalid '${Operator.OR}' after '${Operator.NOT}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.FUZZY) {
                        return new Help(
                            `Invalid '${Operator.OR}' after '${Operator.FUZZY}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.AND) {
                        return new Help(
                            `Invalid '${Operator.OR}' after '${Operator.AND}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.XOR) {
                        return new Help(
                            `Invalid '${Operator.OR}' after '${Operator.XOR}'.`,
                            it.Index(),
                        );
                    } else if (last_token.Type() === Token.Type.OR) {
                        return new Help(
                            `Invalid '${Operator.OR}' after '${Operator.OR}'.`,
                            it.Index(),
                        );
                    } else {
                        last_expression_index = it.Index();
                        tokens.push(new Token.Or());
                    }
                } else {
                    const last_token: Token.Instance | null = Last(tokens);
                    if (
                        last_token != null &&
                        (
                            last_token.Type() === Token.Type.CLOSE_GROUP ||
                            last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                            last_token.Type() === Token.Type.TEXT
                        )
                    ) {
                        tokens.push(new Token.And());
                    }
                    const first: Unicode.Iterator = it;
                    for (it = it.Next(); !it.Is_At_End(); it = it.Next()) {
                        if (/\s/.test(it.Point())) {
                            break;
                        }
                    }
                    last_expression_index = first.Index();
                    tokens.push(
                        new Token.Text(
                            expression.slice(first.Index(), it.Index()),
                        ),
                    );
                }
            }
        }

        if (tokens.length < 1) {
            return new Help(
                `Empty expression.`,
                0,
            );
        } else if (group_depth > 0) {
            return new Help(
                `Unclosed '${Operator.OPEN_GROUP}'.`,
                it.Previous().Index(),
            );
        } else if (sequence_depth > 0) {
            return new Help(
                `Unclosed '${Operator.OPEN_SEQUENCE}'.`,
                it.Previous().Index(),
            );
        } else {
            const last_token: Token.Instance = tokens[tokens.length - 1];
            if (last_token.Type() === Token.Type.OPEN_GROUP) {
                return new Help(
                    `Invalid '${Operator.OPEN_GROUP}' at end.`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                return new Help(
                    `Invalid '${Operator.OPEN_SEQUENCE}' at end.`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.NOT) {
                return new Help(
                    `Invalid '${Operator.NOT}' at end.`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.FUZZY) {
                return new Help(
                    `Invalid '${Operator.FUZZY}' at end.`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.AND) {
                return new Help(
                    `Invalid '${Operator.AND}' at end.`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.XOR) {
                return new Help(
                    `Invalid '${Operator.XOR}' at end.`,
                    last_expression_index,
                );
            } else if (last_token.Type() === Token.Type.OR) {
                return new Help(
                    `Invalid '${Operator.OR}' at end.`,
                    last_expression_index,
                );
            }
        }

        return tokens;
    }
}
