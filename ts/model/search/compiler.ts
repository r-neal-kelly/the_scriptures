import * as Utils from "../../utils.js";

import * as Token from "./token.js";
import * as Node from "./node.js";

class Fragment
{
    private in_node: Node.Instance;
    private out_nodes: Array<Node.Instance>;

    constructor(
        in_node: Node.Instance,
        out_nodes: Array<Node.Instance>,
    )
    {
        this.in_node = in_node;
        this.out_nodes = out_nodes;

        Object.freeze(this.out_nodes);
        Object.freeze(this);
    }

    In_Node():
        Node.Instance
    {
        return this.in_node;
    }

    Out_Nodes():
        Array<Node.Instance>
    {
        return this.out_nodes;
    }
}

export class Instance
{
    // We could cache nodes by expression.

    constructor()
    {
    }

    Compile(
        tokens: Array<Token.Instance>,
    ):
        Node.Instance
    {
        function Evaluate_Fragments(
            operator: Token.Operator,
            fragments: Array<Fragment>,
        ):
            void
        {
            const operator_type: Token.Type = operator.Type();
            if (
                operator_type === Token.Type.NOT ||
                operator_type === Token.Type.CASE ||
                operator_type === Token.Type.ALIGN ||
                operator_type === Token.Type.META
            ) {
                Utils.Assert(
                    fragments.length >= 1,
                    `Corrupt fragments.`,
                );
                const fragment: Fragment =
                    fragments.pop() as Fragment;
                for (const out_node of fragment.Out_Nodes()) {
                    out_node.Set_Next(Node.END);
                }
                const unary: Node.Unary =
                    operator_type === Token.Type.NOT ?
                        new Node.Not(
                            {
                                operand: fragment.In_Node(),
                            },
                        ) :
                        operator_type === Token.Type.CASE ?
                            new Node.Case(
                                {
                                    operand: fragment.In_Node(),
                                },
                            ) :
                            operator_type === Token.Type.ALIGN ?
                                new Node.Align(
                                    {
                                        operand: fragment.In_Node(),
                                    },
                                ) :
                                new Node.Meta(
                                    {
                                        operand: fragment.In_Node(),
                                    },
                                );
                fragments.push(
                    new Fragment(
                        unary,
                        [unary],
                    ),
                );

            } else if (
                operator_type === Token.Type.AND
            ) {
                Utils.Assert(
                    fragments.length >= 2,
                    `Corrupt fragments.`,
                );
                const right_fragment: Fragment =
                    fragments.pop() as Fragment;
                const left_fragment: Fragment =
                    fragments.pop() as Fragment;
                for (const out_node of left_fragment.Out_Nodes()) {
                    out_node.Set_Next(right_fragment.In_Node());
                }
                fragments.push(
                    new Fragment(
                        left_fragment.In_Node(),
                        right_fragment.Out_Nodes(),
                    ),
                );

            } else if (
                operator_type === Token.Type.OR ||
                operator_type === Token.Type.XOR
            ) {
                Utils.Assert(
                    fragments.length >= 2,
                    `Corrupt fragments.`,
                );
                const right_fragment: Fragment =
                    fragments.pop() as Fragment;
                const left_fragment: Fragment =
                    fragments.pop() as Fragment;
                const binary: Node.Binary =
                    operator_type === Token.Type.OR ?
                        new Node.Or(
                            {
                                left_operand: left_fragment.In_Node(),
                                right_operand: right_fragment.In_Node(),
                            },
                        ) :
                        new Node.Xor(
                            {
                                left_operand: left_fragment.In_Node(),
                                right_operand: right_fragment.In_Node(),
                            },
                        );
                fragments.push(
                    new Fragment(
                        binary,
                        left_fragment.Out_Nodes().concat(right_fragment.Out_Nodes()),
                    ),
                );

            } else {
                Utils.Assert(
                    false,
                    `Unworkable operator_type: ${operator_type}.`,
                );

            }
        }

        const operators: Array<Token.Operator> = [];
        const fragments: Array<Fragment> = [];

        for (const token of tokens) {
            const token_type: Token.Type = token.Type();
            if (token_type === Token.Type.OPEN_GROUP) {
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.CLOSE_GROUP) {
                for (
                    let operator: Token.Operator | undefined = operators.pop();
                    operator != null && operator.Type() != Token.Type.OPEN_GROUP;
                    operator = operators.pop()
                ) {
                    Evaluate_Fragments(
                        operator as Token.Operator,
                        fragments,
                    );
                }

            } else if (token_type === Token.Type.OPEN_SEQUENCE) {
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.CLOSE_SEQUENCE) {
                for (
                    let operator: Token.Operator | undefined = operators.pop();
                    operator != null && operator.Type() != Token.Type.OPEN_SEQUENCE;
                    operator = operators.pop()
                ) {
                    Evaluate_Fragments(
                        operator as Token.Operator,
                        fragments,
                    );
                }
                Utils.Assert(
                    fragments.length >= 1,
                    `Corrupt fragments.`,
                );
                const fragment: Fragment =
                    fragments.pop() as Fragment;
                for (const out_node of fragment.Out_Nodes()) {
                    out_node.Set_Next(Node.END);
                }
                const sequence: Node.Sequence =
                    new Node.Sequence(
                        {
                            operand: fragment.In_Node(),
                            token: token as Token.Close_Sequence,
                        },
                    );
                fragments.push(
                    new Fragment(
                        sequence,
                        [sequence],
                    ),
                );

            } else if (token_type === Token.Type.NOT) {
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.CASE) {
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.ALIGN) {
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.META) {
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.AND) {
                while (
                    operators.length > 0 &&
                    (
                        operators[operators.length - 1].Type() === Token.Type.NOT ||
                        operators[operators.length - 1].Type() === Token.Type.CASE ||
                        operators[operators.length - 1].Type() === Token.Type.ALIGN ||
                        operators[operators.length - 1].Type() === Token.Type.META ||
                        operators[operators.length - 1].Type() === Token.Type.AND
                    )
                ) {
                    Evaluate_Fragments(
                        operators.pop() as Token.Operator,
                        fragments,
                    );
                }
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.XOR) {
                while (
                    operators.length > 0 &&
                    (
                        operators[operators.length - 1].Type() === Token.Type.NOT ||
                        operators[operators.length - 1].Type() === Token.Type.CASE ||
                        operators[operators.length - 1].Type() === Token.Type.ALIGN ||
                        operators[operators.length - 1].Type() === Token.Type.META ||
                        operators[operators.length - 1].Type() === Token.Type.AND ||
                        operators[operators.length - 1].Type() === Token.Type.XOR
                    )
                ) {
                    Evaluate_Fragments(
                        operators.pop() as Token.Operator,
                        fragments,
                    );
                }
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.OR) {
                while (
                    operators.length > 0 &&
                    (
                        operators[operators.length - 1].Type() === Token.Type.NOT ||
                        operators[operators.length - 1].Type() === Token.Type.CASE ||
                        operators[operators.length - 1].Type() === Token.Type.ALIGN ||
                        operators[operators.length - 1].Type() === Token.Type.META ||
                        operators[operators.length - 1].Type() === Token.Type.AND ||
                        operators[operators.length - 1].Type() === Token.Type.XOR ||
                        operators[operators.length - 1].Type() === Token.Type.OR
                    )
                ) {
                    Evaluate_Fragments(
                        operators.pop() as Token.Operator,
                        fragments,
                    );
                }
                operators.push(token as Token.Operator);

            } else if (token_type === Token.Type.TEXT) {
                const text: Node.Text = new Node.Text(
                    {
                        token: (token as Token.Text),
                    },
                );
                fragments.push(
                    new Fragment(
                        text,
                        [text],
                    ),
                );

            } else {
                Utils.Assert(
                    fragments.length === 1,
                    `Unknown token type: ${token.Type()}.`,
                );

            }
        }

        while (operators.length > 0) {
            Evaluate_Fragments(
                operators.pop() as Token.Operator,
                fragments,
            );
        }
        Utils.Assert(
            fragments.length === 1,
            `Corrupt fragments.`,
        );
        const fragment: Fragment =
            fragments.pop() as Fragment;
        for (const out_node of fragment.Out_Nodes()) {
            out_node.Set_Next(Node.END);
        }
        return fragment.In_Node();
    }
}
