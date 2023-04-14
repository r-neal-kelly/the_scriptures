import * as Utils from "../../utils.js";

export enum Type
{
    TEXT,
    OR,
    XOR,
    NOT,
    CASE,
    ALIGN,
    SEQUENCE,
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
    private value: string;

    constructor(
        {
            value,
        }: {
            value: string,
        },
    )
    {
        super(
            {
                type: Type.TEXT,
            },
        );

        this.value = value;
    }

    Value():
        string
    {
        return this.value;
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

        super.Set_Next(left_operand);
        this.right_operand = right_operand;

        Object.freeze(this);
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
        return this.Next();
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

export class Sequence extends Unary
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
                type: Type.SEQUENCE,
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
