export enum Name
{
    ENGLISH = `English`,
    HEBREW = `Hebrew`,
    GREEK = `Greek`,
    LATIN = `Latin`,
}

export enum Direction
{
    LEFT_TO_RIGHT,
    RIGHT_TO_LEFT,
}

export function Default_Direction(
    language: Name,
):
    Direction
{
    if (language === Name.HEBREW) {
        return Direction.RIGHT_TO_LEFT;
    } else {
        return Direction.LEFT_TO_RIGHT;
    }
}

export function Default_Styles():
    { [index: string]: string }
{
    return {
        "font-family": `sans-serif`,
        "font-size": `1em`, // 16px
        "line-height": `normal`,
    };
}

export function Styles(
    language: Name | null,
):
    { [index: string]: string }
{
    if (language == null) {
        return Default_Styles();
    } else if (language === Name.ENGLISH) {
        return {
            "font-family": `Orkney-Regular`,
            "font-size": `1em`, // 16px
            "line-height": `1.2`,
        };
    } else if (language === Name.HEBREW) {
        return {
            "font-family": `Ezra SIL SR`,
            "font-size": `1.125em`, // 18px
            "line-height": `1.45`,
        };
    } else if (language === Name.GREEK) {
        return {
            "font-family": `Gentium Plus`,
            "font-size": `1.25em`, // 20px
            "line-height": `1.3`,
        };
    } else if (language === Name.LATIN) {
        return {
            "font-family": `Gentium Plus`,
            "font-size": `1.125em`, // 18px
            "line-height": `1.1`,
        };
    } else {
        return Default_Styles();
    }
}
