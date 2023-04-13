export var Type;
(function (Type) {
    Type[Type["OPEN_GROUP"] = 0] = "OPEN_GROUP";
    Type[Type["CLOSE_GROUP"] = 1] = "CLOSE_GROUP";
    Type[Type["OPEN_SEQUENCE"] = 2] = "OPEN_SEQUENCE";
    Type[Type["CLOSE_SEQUENCE"] = 3] = "CLOSE_SEQUENCE";
    Type[Type["NOT"] = 4] = "NOT";
    Type[Type["FUZZY"] = 5] = "FUZZY";
    Type[Type["AND"] = 6] = "AND";
    Type[Type["XOR"] = 7] = "XOR";
    Type[Type["OR"] = 8] = "OR";
    Type[Type["TEXT"] = 9] = "TEXT";
})(Type || (Type = {}));
export class Instance {
    constructor({ type, }) {
        this.type = type;
    }
    Type() {
        return this.type;
    }
}
export class Operator extends Instance {
}
export class Open_Group extends Operator {
    constructor() {
        super({
            type: Type.OPEN_GROUP,
        });
    }
}
export class Close_Group extends Operator {
    constructor() {
        super({
            type: Type.CLOSE_GROUP,
        });
    }
}
export class Open_Sequence extends Operator {
    constructor() {
        super({
            type: Type.OPEN_SEQUENCE,
        });
    }
}
export class Close_Sequence extends Operator {
    constructor() {
        super({
            type: Type.CLOSE_SEQUENCE,
        });
    }
}
export class Not extends Operator {
    constructor() {
        super({
            type: Type.NOT,
        });
    }
}
export class Fuzzy extends Operator {
    constructor() {
        super({
            type: Type.FUZZY,
        });
    }
}
export class And extends Operator {
    constructor() {
        super({
            type: Type.AND,
        });
    }
}
export class Xor extends Operator {
    constructor() {
        super({
            type: Type.XOR,
        });
    }
}
export class Or extends Operator {
    constructor() {
        super({
            type: Type.OR,
        });
    }
}
export class Text extends Instance {
    constructor(value) {
        super({
            type: Type.TEXT,
        });
        this.value = value;
    }
    Value() {
        return this.value;
    }
}
