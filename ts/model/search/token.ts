import * as Utils from "../../utils.js";

import * as Text_Module from "../text.js";
import { Boundary } from "./boundary.js";

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
    private is_complex: boolean;

    constructor(
        {
            is_complex,
        }: {
            is_complex: boolean,
        },
    )
    {
        super(
            {
                type: Type.OPEN_SEQUENCE,
            },
        );

        this.is_complex = is_complex;
    }

    Is_Complex():
        boolean
    {
        return this.is_complex;
    }
}

export class Close_Sequence extends Operator
{
    private is_complex: boolean;

    constructor(
        {
            is_complex,
        }: {
            is_complex: boolean,
        },
    )
    {
        super(
            {
                type: Type.CLOSE_SEQUENCE,
            },
        );

        this.is_complex = is_complex;
    }

    Is_Complex():
        boolean
    {
        return this.is_complex;
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
    private part: Text_Module.Part.Instance;
    private boundary: Boundary | null;

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
        this.boundary = null;
    }

    Part():
        Text_Module.Part.Instance
    {
        return this.part;
    }

    Boundary():
        Boundary
    {
        Utils.Assert(
            this.boundary != null,
            `boundary was not set on this token.`,
        );

        return this.boundary as Boundary;
    }

    Set_Boundary(
        boundary: Boundary,
    ):
        void
    {
        Utils.Assert(
            this.boundary == null,
            `boundary has already been set.`,
        );

        this.boundary = boundary;
    }

    May_Precede_Implicit_Word_In_Sequence():
        boolean
    {
        return (
            this.Boundary() != Boundary.ANY &&
            this.Boundary() != Boundary.END &&
            this.Part().Is_Break()
        );
    }

    May_Precede_Implicit_Break_In_Sequence():
        boolean
    {
        return (
            this.Boundary() != Boundary.ANY &&
            this.Boundary() != Boundary.END &&
            this.Part().Is_Word()
        );
    }
}
