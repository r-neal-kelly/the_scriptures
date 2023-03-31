export var Type;
(function (Type) {
    /*
        Can contain:
            Part.Point,
            Part.Letter,
            Part.Marker,
            Part.Command
    */
    Type[Type["MICRO"] = 0] = "MICRO";
    /*
        Can contain:
            Part.Point,
            Part.Word,
            Part.Command,
            Split
    */
    Type[Type["MACRO"] = 1] = "MACRO";
})(Type || (Type = {}));
