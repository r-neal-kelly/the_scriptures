export enum Type
{
    /*
        Can contain:
            Part.Point,
            Part.Letter,
            Part.Marker,
            Part.Command
    */
    MICRO,

    /*
        Can contain:
            Part.Point,
            Part.Word,
            Part.Command,
            Split
    */
    MACRO,
    MACRO_LEFT_TO_RIGHT,
    MACRO_RIGHT_TO_LEFT,
}
