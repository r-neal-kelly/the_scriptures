import * as Text_Module from "../text.js";
import * as Class_Module from "./class.js";
import { Sequence_Type } from "./sequence_type.js";

export enum Type
{
    MAYBE_ONE,
    MAYBE_MANY,
    ONE_OR_MANY,

    OPEN_GROUP,
    CLOSE_GROUP,
    OPEN_SEQUENCE,
    CLOSE_SEQUENCE,

    NOT,
    CASE,
    ALIGN,
    META,

    AND,

    XOR,

    OR,

    CLASS,
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

export class Maybe_One extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.MAYBE_ONE,
            },
        );
    }
}

export class Maybe_Many extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.MAYBE_MANY,
            },
        );
    }
}

export class One_Or_Many extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.ONE_OR_MANY,
            },
        );
    }
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
    private sequence_type: Sequence_Type;

    constructor(
        {
            sequence_type,
        }: {
            sequence_type: Sequence_Type,
        },
    )
    {
        super(
            {
                type: Type.CLOSE_SEQUENCE,
            },
        );

        this.sequence_type = sequence_type;
    }

    Sequence_Type():
        Sequence_Type
    {
        return this.sequence_type;
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

export class Case extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.CASE,
            },
        );
    }
}

export class Align extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.ALIGN,
            },
        );
    }
}

export class Meta extends Operator
{
    constructor()
    {
        super(
            {
                type: Type.META,
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

export class Class extends Instance
{
    private value: Class_Module.Instance;

    constructor(
        {
            value,
        }: {
            value: Class_Module.Instance;
        },
    )
    {
        super(
            {
                type: Type.CLASS,
            },
        );

        this.value = value;
    }

    Value():
        Class_Module.Instance
    {
        return this.value;
    }
}

export class Text extends Instance
{
    private part: Text_Module.Part.Instance;

    constructor(
        {
            part,
        }: {
            part: Text_Module.Part.Instance,
        },
    )
    {
        super(
            {
                type: Type.TEXT,
            },
        );

        this.part = part;
    }

    Part():
        Text_Module.Part.Instance
    {
        return this.part;
    }
}
