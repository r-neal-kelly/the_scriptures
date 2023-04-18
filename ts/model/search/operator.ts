// From highest to lowest precedence,
// and those with equal precedence
// grouped together.
export enum Operator
{
    // Values
    VERBATIM = `"`,

    // Left-to-Right Associative Unary
    MAYBE_ONE = `?`,
    MAYBE_MANY = `*`,
    ONE_OR_MANY = `+`,

    // Explicit Precedence
    OPEN_GROUP = `(`,
    CLOSE_GROUP = `)`,
    OPEN_SEQUENCE = `<`,
    CLOSE_SEQUENCE = `>`,

    // Right-to-Left Associative Unary
    NOT = `!`,
    CASE = `%`,
    ALIGN = `@`,
    META = `#`,

    // Logical
    AND = `&`,

    XOR = `^`,

    OR = `|`,
}
