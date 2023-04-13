import * as Utils from "../../utils.js";
import * as Token from "./token.js";
import * as Node from "./node.js";
class Fragment {
    constructor(in_node, out_nodes) {
        this.in_node = in_node;
        this.out_nodes = out_nodes;
        Object.freeze(this.out_nodes);
        Object.freeze(this);
    }
    In_Node() {
        return this.in_node;
    }
    Out_Nodes() {
        return this.out_nodes;
    }
}
export class Instance {
    // We could cache compiled tokens.
    constructor() {
    }
    Compile(tokens) {
        function Evaluate_Fragments(operator, fragments) {
            const operator_type = operator.Type();
            if (operator_type === Token.Type.OPEN_SEQUENCE ||
                operator_type === Token.Type.NOT ||
                operator_type === Token.Type.FUZZY) {
                Utils.Assert(fragments.length >= 1, `Corrupt fragments.`);
                const fragment = fragments.pop();
                for (const out_node of fragment.Out_Nodes()) {
                    out_node.Set_Next(Node.END);
                }
                const unary = operator_type === Token.Type.OPEN_SEQUENCE ?
                    new Node.Sequence({
                        operand: fragment.In_Node(),
                    }) :
                    operator_type === Token.Type.NOT ?
                        new Node.Not({
                            operand: fragment.In_Node(),
                        }) :
                        new Node.Fuzzy({
                            operand: fragment.In_Node(),
                        });
                fragments.push(new Fragment(unary, [unary]));
            }
            else if (operator_type === Token.Type.AND) {
                Utils.Assert(fragments.length >= 2, `Corrupt fragments.`);
                const right_fragment = fragments.pop();
                const left_fragment = fragments.pop();
                for (const out_node of left_fragment.Out_Nodes()) {
                    out_node.Set_Next(right_fragment.In_Node());
                }
                fragments.push(new Fragment(left_fragment.In_Node(), right_fragment.Out_Nodes()));
            }
            else if (operator_type === Token.Type.OR ||
                operator_type === Token.Type.XOR) {
                Utils.Assert(fragments.length >= 2, `Corrupt fragments.`);
                const right_fragment = fragments.pop();
                const left_fragment = fragments.pop();
                const binary = operator_type === Token.Type.OR ?
                    new Node.Or({
                        left_operand: left_fragment.In_Node(),
                        right_operand: right_fragment.In_Node(),
                    }) :
                    new Node.Xor({
                        left_operand: left_fragment.In_Node(),
                        right_operand: right_fragment.In_Node(),
                    });
                fragments.push(new Fragment(binary, left_fragment.Out_Nodes().concat(right_fragment.Out_Nodes())));
            }
            else {
                Utils.Assert(false, `Unworkable operator_type: ${operator_type}.`);
            }
        }
        const operators = [];
        const fragments = [];
        for (const token of tokens) {
            const token_type = token.Type();
            if (token_type === Token.Type.OPEN_GROUP) {
                operators.push(token);
            }
            else if (token_type === Token.Type.CLOSE_GROUP) {
                for (let operator = operators.pop(); operator != null && operator.Type() != Token.Type.OPEN_GROUP; operator = operators.pop()) {
                    Evaluate_Fragments(operator, fragments);
                }
            }
            else if (token_type === Token.Type.OPEN_SEQUENCE) {
                operators.push(token);
            }
            else if (token_type === Token.Type.CLOSE_SEQUENCE) {
                let operator = operators.pop();
                for (; operator != null && operator.Type() != Token.Type.OPEN_SEQUENCE; operator = operators.pop()) {
                    Evaluate_Fragments(operator, fragments);
                }
                Evaluate_Fragments(operator, fragments);
            }
            else if (token_type === Token.Type.NOT || token_type === Token.Type.FUZZY) {
                operators.push(token);
            }
            else if (token_type === Token.Type.AND) {
                while (operators.length > 0 &&
                    operators[operators.length - 1].Type() === Token.Type.NOT ||
                    operators[operators.length - 1].Type() === Token.Type.FUZZY ||
                    operators[operators.length - 1].Type() === Token.Type.AND) {
                    Evaluate_Fragments(operators.pop(), fragments);
                }
                operators.push(token);
            }
            else if (token_type === Token.Type.XOR) {
                while (operators.length > 0 &&
                    operators[operators.length - 1].Type() === Token.Type.NOT ||
                    operators[operators.length - 1].Type() === Token.Type.FUZZY ||
                    operators[operators.length - 1].Type() === Token.Type.AND ||
                    operators[operators.length - 1].Type() === Token.Type.XOR) {
                    Evaluate_Fragments(operators.pop(), fragments);
                }
                operators.push(token);
            }
            else if (token_type === Token.Type.OR) {
                while (operators.length > 0 &&
                    operators[operators.length - 1].Type() === Token.Type.NOT ||
                    operators[operators.length - 1].Type() === Token.Type.FUZZY ||
                    operators[operators.length - 1].Type() === Token.Type.AND ||
                    operators[operators.length - 1].Type() === Token.Type.XOR ||
                    operators[operators.length - 1].Type() === Token.Type.OR) {
                    Evaluate_Fragments(operators.pop(), fragments);
                }
                operators.push(token);
            }
            else if (token_type === Token.Type.TEXT) {
                const text = new Node.Text({
                    value: token.Value(),
                });
                fragments.push(new Fragment(text, [text]));
            }
            else {
                Utils.Assert(fragments.length === 1, `Unknown token type: ${token.Type()}.`);
            }
        }
        while (operators.length > 0) {
            Evaluate_Fragments(operators.pop(), fragments);
        }
        Utils.Assert(fragments.length === 1, `Corrupt fragments.`);
        const fragment = fragments.pop();
        for (const out_node of fragment.Out_Nodes()) {
            out_node.Set_Next(Node.END);
        }
        return fragment.In_Node();
    }
}
