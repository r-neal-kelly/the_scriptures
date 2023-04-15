import * as Text_Module from "../text.js";

export enum Type
{
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

export class Text extends Instance
{
    private line: Text_Module.Line.Instance;
    private is_in_sequence: boolean;
    private has_start_boundary_in_sequence: boolean;

    constructor(
        {
            line,
            is_in_sequence,
            has_start_boundary_in_sequence,
        }: {
            line: Text_Module.Line.Instance,
            is_in_sequence: boolean,
            has_start_boundary_in_sequence: boolean,
        },
    )
    {
        super(
            {
                type: Type.TEXT,
            },
        );

        this.line = line;
        this.is_in_sequence = is_in_sequence;
        this.has_start_boundary_in_sequence = has_start_boundary_in_sequence;
    }

    Line():
        Text_Module.Line.Instance
    {
        return this.line;
    }

    Is_In_Sequence():
        boolean
    {
        return this.is_in_sequence;
    }

    Has_Start_Boundary_In_Sequence():
        boolean
    {
        return (
            this.is_in_sequence &&
            this.has_start_boundary_in_sequence
        );
    }
}
