import * as Utils from "../../utils.js";
export var Type;
(function (Type) {
    Type[Type["TEXT"] = 0] = "TEXT";
    Type[Type["OR"] = 1] = "OR";
    Type[Type["XOR"] = 2] = "XOR";
    Type[Type["AND"] = 3] = "AND";
    Type[Type["NOT"] = 4] = "NOT";
    Type[Type["FUZZY"] = 5] = "FUZZY";
    Type[Type["SEQUENCE"] = 6] = "SEQUENCE";
    Type[Type["END"] = 7] = "END";
})(Type || (Type = {}));
export class Instance {
    constructor({ type, }) {
        this.type = type;
        this.next = null;
    }
    Type() {
        return this.type;
    }
    Next() {
        return this.next;
    }
    Set_Next(next) {
        this.next = next;
        Object.freeze(this);
    }
}
export class Text extends Instance {
    constructor({ value, }) {
        super({
            type: Type.TEXT,
        });
        this.value = value;
    }
    Value() {
        return this.value;
    }
}
export class Binary extends Instance {
    constructor({ type, left_operand, right_operand, }) {
        super({
            type: type,
        });
        super.Set_Next(left_operand);
        this.right_operand = right_operand;
        Object.freeze(this);
    }
    Next() {
        Utils.Assert(false, `Unused method.`);
        return null;
    }
    Set_Next(next) {
        Utils.Assert(false, `Unused method.`);
    }
    Left_Operand() {
        return this.Next();
    }
    Right_Operand() {
        return this.right_operand;
    }
}
export class Or extends Binary {
    constructor({ left_operand, right_operand, }) {
        super({
            type: Type.OR,
            left_operand: left_operand,
            right_operand: right_operand,
        });
    }
}
export class Xor extends Binary {
    constructor({ left_operand, right_operand, }) {
        super({
            type: Type.XOR,
            left_operand: left_operand,
            right_operand: right_operand,
        });
    }
}
export class Unary extends Instance {
    constructor({ type, operand, }) {
        super({
            type: type,
        });
        this.operand = operand;
    }
    Operand() {
        return this.operand;
    }
}
export class Not extends Unary {
    constructor({ operand, }) {
        super({
            type: Type.NOT,
            operand: operand,
        });
    }
}
export class Fuzzy extends Unary {
    constructor({ operand, }) {
        super({
            type: Type.FUZZY,
            operand: operand,
        });
    }
}
export class Sequence extends Unary {
    constructor({ operand, }) {
        super({
            type: Type.SEQUENCE,
            operand: operand,
        });
    }
}
export class End extends Instance {
    constructor() {
        super({
            type: Type.END,
        });
    }
    Next() {
        Utils.Assert(false, `Unused method.`);
        return null;
    }
    Set_Next(next) {
        Utils.Assert(false, `Unused method.`);
    }
}
export const END = new End();
