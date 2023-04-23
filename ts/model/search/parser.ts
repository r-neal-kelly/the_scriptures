import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Unicode from "../../unicode.js";

import * as Text from "../text.js";
import { Operator } from "./operator.js";
import { Operand } from "./operand.js";
import { Sequence_Type } from "./sequence_type.js";
import * as Class from "./class.js";
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
        let sequence_has_and: boolean = false;

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
                    last_token.Type() === Token.Type.MAYBE_ONE ||
                    last_token.Type() === Token.Type.MAYBE_MANY ||
                    last_token.Type() === Token.Type.ONE_OR_MANY ||
                    last_token.Type() === Token.Type.CLOSE_GROUP ||
                    last_token.Type() === Token.Type.CLOSE_SEQUENCE ||
                    last_token.Type() === Token.Type.CLASS ||
                    last_token.Type() === Token.Type.TEXT
                )
            ) {
                if (sequence_depth > 0) {
                    sequence_has_and = true;
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
                tokens.push(new Token.Open_Sequence());
                for (let idx = 0, end = text.Line(0).Macro_Part_Count(); idx < end; idx += 1) {
                    tokens.push(
                        new Token.Text(
                            {
                                part: text.Line(0).Macro_Part(idx),
                            },
                        ),
                    );
                    if (idx < end - 1) {
                        tokens.push(new Token.And());
                    }
                }
                sequence_depth -= 1;
                tokens.push(
                    new Token.Close_Sequence(
                        {
                            sequence_type: Sequence_Type.SIMPLE_SEQUENCE,
                        },
                    ),
                );
            } else {
                const text_part_count: Count = text.Line(0).Macro_Part_Count();
                const has_group: boolean = text_part_count > 1 || sequence_has_and;
                if (has_group) {
                    group_depth += 1;
                    tokens.push(new Token.Open_Group());
                }
                if (sequence_has_and && false) {
                    const text_first_part: Text.Part.Instance =
                        text.Line(0).Macro_Part(0);
                    if (text_first_part.Is_Word()) {
                        tokens.push(
                            new Token.Class(
                                {
                                    value: Class.BREAK,
                                }
                            ),
                        );
                    } else if (text_first_part.Is_Break()) {
                        tokens.push(
                            new Token.Class(
                                {
                                    value: Class.WORD,
                                }
                            ),
                        );
                    }
                    tokens.push(new Token.Maybe_One());
                    tokens.push(new Token.And());
                }
                for (let idx = 0, end = text_part_count; idx < end; idx += 1) {
                    tokens.push(
                        new Token.Text(
                            {
                                part: text.Line(0).Macro_Part(idx),
                            },
                        ),
                    );
                    if (idx < end - 1) {
                        sequence_has_and = true;
                        tokens.push(new Token.And());
                    }
                }
                if (has_group) {
                    group_depth -= 1;
                    tokens.push(new Token.Close_Group());
                }
            }
        }

        function Add_Class(
            class_: Token.Class,
        ):
            void
        {
            if (sequence_depth < 1) {
                sequence_depth += 1;
                tokens.push(new Token.Open_Sequence());

                tokens.push(class_);

                sequence_depth -= 1;
                tokens.push(
                    new Token.Close_Sequence(
                        {
                            sequence_type: Sequence_Type.SIMPLE_SEQUENCE,
                        },
                    ),
                );
            } else {
                tokens.push(class_);
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

                } else if (point === Operator.MAYBE_ONE) {
                    if (sequence_depth < 1) {
                        return new Help(
                            `Invalid ${Operator.MAYBE_ONE} outside sequence`,
                            it.Index(),
                        );
                    } else {
                        const last_token: Token.Instance | null = Last();
                        if (last_token == null) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} at beginning`,
                                it.Index(),
                            );
                        } else if (last_token.Type() === Token.Type.MAYBE_ONE) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.MAYBE_ONE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.MAYBE_MANY) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.MAYBE_MANY}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.ONE_OR_MANY) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.ONE_OR_MANY}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.OPEN_GROUP}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.OPEN_SEQUENCE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.NOT) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.NOT}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.CASE) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.CASE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.ALIGN) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.ALIGN}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.META) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.META}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.AND) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.AND}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.XOR) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.XOR}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OR) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_ONE} after ${Operator.OR}`,
                                last_expression_index,
                            );
                        } else {
                            last_expression_index = it.Index();
                            tokens.push(new Token.Maybe_One());
                        }
                    }

                } else if (point === Operator.MAYBE_MANY) {
                    if (sequence_depth < 1) {
                        return new Help(
                            `Invalid ${Operator.MAYBE_MANY} outside sequence`,
                            it.Index(),
                        );
                    } else {
                        const last_token: Token.Instance | null = Last();
                        if (last_token == null) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} at beginning`,
                                it.Index(),
                            );
                        } else if (last_token.Type() === Token.Type.MAYBE_ONE) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.MAYBE_ONE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.MAYBE_MANY) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.MAYBE_MANY}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.ONE_OR_MANY) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.ONE_OR_MANY}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.OPEN_GROUP}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.OPEN_SEQUENCE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.NOT) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.NOT}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.CASE) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.CASE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.ALIGN) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.ALIGN}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.META) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.META}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.AND) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.AND}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.XOR) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.XOR}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OR) {
                            return new Help(
                                `Invalid ${Operator.MAYBE_MANY} after ${Operator.OR}`,
                                last_expression_index,
                            );
                        } else {
                            last_expression_index = it.Index();
                            tokens.push(new Token.Maybe_Many());
                        }
                    }

                } else if (point === Operator.ONE_OR_MANY) {
                    if (sequence_depth < 1) {
                        return new Help(
                            `Invalid ${Operator.ONE_OR_MANY} outside sequence`,
                            it.Index(),
                        );
                    } else {
                        const last_token: Token.Instance | null = Last();
                        if (last_token == null) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} at beginning`,
                                it.Index(),
                            );
                        } else if (last_token.Type() === Token.Type.MAYBE_ONE) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.MAYBE_ONE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.MAYBE_MANY) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.MAYBE_MANY}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.ONE_OR_MANY) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.ONE_OR_MANY}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OPEN_GROUP) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.OPEN_GROUP}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OPEN_SEQUENCE) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.OPEN_SEQUENCE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.NOT) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.NOT}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.CASE) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.CASE}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.ALIGN) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.ALIGN}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.META) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.META}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.AND) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.AND}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.XOR) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.XOR}`,
                                last_expression_index,
                            );
                        } else if (last_token.Type() === Token.Type.OR) {
                            return new Help(
                                `Invalid ${Operator.ONE_OR_MANY} after ${Operator.OR}`,
                                last_expression_index,
                            );
                        } else {
                            last_expression_index = it.Index();
                            tokens.push(new Token.One_Or_Many());
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
                        sequence_group_depth = 0;
                        sequence_has_and = false;
                        tokens.push(new Token.Open_Sequence());
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
                        last_expression_index = it.Index();
                        sequence_depth -= 1;
                        sequence_group_depth = 0;
                        sequence_has_and = false;
                        tokens.push(
                            new Token.Close_Sequence(
                                {
                                    sequence_type:
                                        Sequence_Type.COMPLEX_SEQUENCE,
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
                            sequence_has_and = true;
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
                        if (sequence_depth > 0 && sequence_group_depth === 0) {
                            sequence_has_and = false;
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
                        if (sequence_depth > 0 && sequence_group_depth === 0) {
                            sequence_has_and = false;
                        }
                        tokens.push(new Token.Or());
                    }

                } else if (point === Operand.PART) {
                    Try_Add_And();
                    last_expression_index = it.Index();
                    Add_Class(
                        new Token.Class(
                            {
                                value: Class.PART,
                            }
                        ),
                    );

                } else {
                    Try_Add_And();
                    const first: Unicode.Iterator = it;
                    it = it.Next();
                    for (; !it.Is_At_End(); it = it.Next()) {
                        const point: string = it.Point();
                        if (
                            /\s/.test(point) ||
                            point === Operator.VERBATIM ||
                            point === Operator.MAYBE_ONE ||
                            point === Operator.MAYBE_MANY ||
                            point === Operator.ONE_OR_MANY ||
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
                            point === Operator.OR ||
                            point === Operand.PART
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
