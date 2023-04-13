// From highest to lowest precedence,
// and those with equal precedence
// grouped together.
export enum Operator
{
    VERBATIM = `"`,

    OPEN_GROUP = `(`,
    CLOSE_GROUP = `)`,
    OPEN_SEQUENCE = `<`,
    CLOSE_SEQUENCE = `>`,

    NOT = `!`,
    CASE = `*`,
    ALIGN = `@`,

    AND = `&`,

    XOR = `^`,

    OR = `|`,
}
