export enum Type
{
    OPEN_GROUP,
    CLOSE_GROUP,
    OPEN_SEQUENCE,
    CLOSE_SEQUENCE,

    NOT,
    FUZZY,

    AND,

    XOR,

    OR,

    TEXT,
}

export class Instance
{
    private type: Type;

    constructor(
        {
            type,
        }: {
            type: Type,
        },
    )
    {
        this.type = type;
    }

    Type():
        Type
    {
        return this.type;
    }
}

export class Operator extends Instance
{
}

export class Open_Group extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.OPEN_GROUP,
            },
        );
    }
}

export class Close_Group extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.CLOSE_GROUP,
            },
        );
    }
}

export class Open_Sequence extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.OPEN_SEQUENCE,
            },
        );
    }
}

export class Close_Sequence extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.CLOSE_SEQUENCE,
            },
        );
    }
}

export class Not extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.NOT,
            },
        );
    }
}

export class Fuzzy extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.FUZZY,
            },
        );
    }
}

export class And extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.AND,
            },
        );
    }
}

export class Xor extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.XOR,
            },
        );
    }
}

export class Or extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.OR,
            },
        );
    }
}

export class Text extends Instance
{
    private value: string;

    constructor(
        value: string,
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
