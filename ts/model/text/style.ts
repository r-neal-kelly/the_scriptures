
export class Instance
{
    private italic: boolean;
    private bold: boolean;
    private underline: boolean;
    private small_caps: boolean;
    private error: boolean;

    constructor(
        {
            italic = false,
            bold = false,
            underline = false,
            small_caps = false,
            error = false,
        }: {
            italic?: boolean,
            bold?: boolean,
            underline: boolean,
            small_caps: boolean,
            error: boolean,
        },
    )
    {
        this.italic = italic;
        this.bold = bold;
        this.underline = underline;
        this.small_caps = small_caps;
        this.error = error;
    }

    Italic():
        boolean
    {
        return this.italic;
    }

    Bold():
        boolean
    {
        return this.bold;
    }

    Underline():
        boolean
    {
        return this.underline;
    }

    Small_Caps():
        boolean
    {
        return this.small_caps;
    }

    Error():
        boolean
    {
        return this.error;
    }
}
