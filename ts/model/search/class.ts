import * as Utils from "../../utils.js";

import * as Text_Module from "../text.js";

// Would eventually like to have Hebrew, English, and other meta aspects.
// Error, Unknown, Good, etc.
// We could also have a user defined one that allows logical combinations,
// e.g. (Hebrew | Greek) & Word, but you can do that in the language proper,
// e.g. (:Hebrew: | :Greek:) & :Word:
// we would just expand it I guess? :(Hebrew | Greek) & Word:
// Seems overly complicated. I prefer (:Hebrew: | :Greek:) & :Word:
// Or whatever we use (-Hebrew- | -Greek-) & -Word-
// ([Hebrew] | [Greek]) & [Word]
// (:Hebrew | :Greek) & :Word
// Actually we would need to do this in the class, because & means next part
// in sequence. :(Hebrew | Greek) & Word: would just be referring to one part.
// We'll have to do a separate parser, compiler, and executor for classes to
// support that kind of functionality, which would be freaking awesome, truly.
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

    Type():
        Type
    {
        return this.type;
    }

    Recognizes(
        part: Text_Module.Part.Instance,
    ):
        boolean
    {
        Utils.Assert(
            false,
            `This method must be overriden.`,
        );

        return false;
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

    override Recognizes(
        part: Text_Module.Part.Instance,
    ):
        boolean
    {
        return part.Is_Part();
    }
}
export const PART: Part = new Part();

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

    override Recognizes(
        part: Text_Module.Part.Instance,
    ):
        boolean
    {
        return part.Is_Word();
    }
}
export const WORD: Word = new Word();

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

    override Recognizes(
        part: Text_Module.Part.Instance,
    ):
        boolean
    {
        return part.Is_Break();
    }
}
export const BREAK: Break = new Break();
