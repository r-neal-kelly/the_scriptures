import * as Utils from "../../utils.js";

import * as Text_Module from "../text.js";
import * as Class_Module from "./class.js";
import * as Token from "./token.js";

export enum Type
{
    TEXT,
    CLASS,
    OR,
    XOR,
    NOT,
    CASE,
    ALIGN,
    META,
    SEQUENCE,
    MAYBE_ONE,
    MAYBE_MANY,
    ONE_OR_MANY,
    END,
}

export class Instance
{
    private type: Type;
    private next: Instance | null;

    constructor(
        {
            type,
        }: {
            type: Type,
        },
    )
    {
        this.type = type;
        this.next = null;
    }

    Type():
        Type
    {
        return this.type;
    }

    Next():
        Instance
    {
        Utils.Assert(
            this.next != null,
            `Internal compiler error, next is null!`,
        );

        return this.next as Instance;
    }

    Set_Next(
        next: Instance | null,
    ):
        void
    {
        this.next = next;

        Object.freeze(this);
    }
}

export class Text extends Instance
{
    private token: Token.Text;

    constructor(
        {
            token,
        }: {
            token: Token.Text,
        },
    )
    {
        super(
            {
                type: Type.TEXT,
            },
        );

        this.token = token;
    }

    Token():
        Token.Text
    {
        return this.token;
    }

    Part():
        Text_Module.Part.Instance
    {
        return this.Token().Part();
    }
}

export class Class extends Instance
{
    private token: Token.Class;

    constructor(
        {
            token,
        }: {
            token: Token.Class,
        },
    )
    {
        super(
            {
                type: Type.CLASS,
            },
        );

        this.token = token;
    }

    Token():
        Token.Class
    {
        return this.token;
    }

    Value():
        Class_Module.Instance
    {
        return this.Token().Value();
    }

    Recognizes(
        part: Text_Module.Part.Instance,
    ):
        boolean
    {
        return this.Value().Recognizes(part);
    }
}

export class Binary extends Instance
{
    private right_operand: Instance;

    constructor(
        {
            type,
            left_operand,
            right_operand,
        }: {
            type: Type,
            left_operand: Instance,
            right_operand: Instance,
        },
    )
    {
        super(
            {
                type: type,
            },
        );

        this.right_operand = right_operand;
        super.Set_Next(left_operand);
    }

    override Next():
        Instance
    {
        Utils.Assert(
            false,
            `Unused method.`,
        );

        return END;
    }

    override Set_Next(
        next: Instance | null,
    ):
        void
    {
        Utils.Assert(
            false,
            `Unused method.`,
        );
    }

    Left_Operand():
        Instance
    {
        return super.Next();
    }

    Right_Operand():
        Instance
    {
        return this.right_operand;
    }
}

export class Or extends Binary
{
    constructor(
        {
            left_operand,
            right_operand,
        }: {
            left_operand: Instance,
            right_operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.OR,
                left_operand: left_operand,
                right_operand: right_operand,
            },
        );
    }
}

export class Xor extends Binary
{
    constructor(
        {
            left_operand,
            right_operand,
        }: {
            left_operand: Instance,
            right_operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.XOR,
                left_operand: left_operand,
                right_operand: right_operand,
            },
        );
    }
}

export class Unary extends Instance
{
    private operand: Instance;

    constructor(
        {
            type,
            operand,
        }: {
            type: Type,
            operand: Instance,
        },
    )
    {
        super(
            {
                type: type,
            },
        );

        this.operand = operand;
    }

    Operand():
        Instance
    {
        return this.operand;
    }
}

export class Not extends Unary
{
    constructor(
        {
            operand,
        }: {
            operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.NOT,
                operand: operand,
            },
        );
    }
}

export class Case extends Unary
{
    constructor(
        {
            operand,
        }: {
            operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.CASE,
                operand: operand,
            },
        );
    }
}

export class Align extends Unary
{
    constructor(
        {
            operand,
        }: {
            operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.ALIGN,
                operand: operand,
            },
        );
    }
}

export class Meta extends Unary
{
    constructor(
        {
            operand,
        }: {
            operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.META,
                operand: operand,
            },
        );
    }
}

export class Sequence extends Unary
{
    private token: Token.Close_Sequence;

    constructor(
        {
            operand,
            token,
        }: {
            operand: Instance,
            token: Token.Close_Sequence,
        },
    )
    {
        super(
            {
                type: Type.SEQUENCE,
                operand: operand,
            },
        );

        this.token = token;
    }

    Token():
        Token.Close_Sequence
    {
        return this.token;
    }

    Is_Complex():
        boolean
    {
        return this.Token().Is_Complex();
    }
}

export class Maybe_One extends Unary
{
    constructor(
        {
            operand,
        }: {
            operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.MAYBE_ONE,
                operand: operand,
            },
        );
    }
}

export class Maybe_Many extends Unary
{
    constructor(
        {
            operand,
        }: {
            operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.MAYBE_MANY,
                operand: operand,
            },
        );
    }
}

export class One_Or_Many extends Unary
{
    constructor(
        {
            operand,
        }: {
            operand: Instance,
        },
    )
    {
        super(
            {
                type: Type.ONE_OR_MANY,
                operand: operand,
            },
        );
    }
}

export class End extends Instance
{
    constructor()
    {
        super(
            {
                type: Type.END,
            },
        );
    }

    override Next():
        Instance
    {
        Utils.Assert(
            false,
            `Unused method.`,
        );

        return END;
    }

    override Set_Next(
        next: Instance | null,
    ):
        void
    {
        Utils.Assert(
            false,
            `Unused method.`,
        );
    }
}
export const END = new End();
