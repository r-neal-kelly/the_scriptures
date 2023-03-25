export enum Value
{
    CENTER = `｟cen｠`,

    INDENT = `｟in｠`,

    OPEN_BOLD = `｟b｠`,
    CLOSE_BOLD = `｟/b｠`,

    OPEN_ITALIC = `｟i｠`,
    CLOSE_ITALIC = `｟/i｠`,

    OPEN_UNDERLINE = `｟u｠`,
    CLOSE_UNDERLINE = `｟/u｠`,

    OPEN_SMALL_CAPS = `｟sc｠`,
    CLOSE_SMALL_CAPS = `｟/sc｠`,

    OPEN_ERROR = `｟err｠`,
    CLOSE_ERROR = `｟/err｠`,
}

export class Instance
{
    private value: Value;

    constructor(
        {
            value,
        }: {
            value: Value,
        },
    )
    {
        this.value = value;
    }

    Value():
        Value
    {
        return this.value;
    }

    Indented():
        boolean
    {
        return this.value === Value.INDENT;
    }
}

export const CENTER = new Instance(
    {
        value: Value.CENTER,
    },
);

export const INDENT = new Instance(
    {
        value: Value.INDENT,
    },
);

export const OPEN_BOLD = new Instance(
    {
        value: Value.OPEN_BOLD,
    },
);
export const CLOSE_BOLD = new Instance(
    {
        value: Value.CLOSE_BOLD,
    },
);

export const OPEN_ITALIC = new Instance(
    {
        value: Value.OPEN_ITALIC,
    },
);
export const CLOSE_ITALIC = new Instance(
    {
        value: Value.CLOSE_ITALIC,
    },
);

export const OPEN_UNDERLINE = new Instance(
    {
        value: Value.OPEN_UNDERLINE,
    },
);
export const CLOSE_UNDERLINE = new Instance(
    {
        value: Value.CLOSE_UNDERLINE,
    },
);

export const OPEN_SMALL_CAPS = new Instance(
    {
        value: Value.OPEN_SMALL_CAPS,
    },
);
export const CLOSE_SMALL_CAPS = new Instance(
    {
        value: Value.CLOSE_SMALL_CAPS,
    },
);

export const OPEN_ERROR = new Instance(
    {
        value: Value.OPEN_ERROR,
    },
);
export const CLOSE_ERROR = new Instance(
    {
        value: Value.CLOSE_ERROR,
    },
);
