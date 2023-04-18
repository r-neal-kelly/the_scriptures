// Would eventually like to have Hebrew, English, and other meta aspects.
// Error, Unknown, Good, etc.
export enum Type
{
    PART,
    WORD,
    BREAK,
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
}

export class Part extends Instance
{
    constructor()
    {
        super(
            {
                type: Type.PART,
            },
        );
    }
}

export class Word extends Instance
{
    constructor()
    {
        super(
            {
                type: Type.WORD,
            },
        );
    }
}

export class Break extends Instance
{
    constructor()
    {
        super(
            {
                type: Type.BREAK,
            },
        );
    }
}
