// From highest to lowest precedence,
// and those with equal precedence
// grouped together.
export var Operator;
(function (Operator) {
    Operator["VERBATIM"] = "\"";
    Operator["OPEN_GROUP"] = "(";
    Operator["CLOSE_GROUP"] = ")";
    Operator["OPEN_SEQUENCE"] = "<";
    Operator["CLOSE_SEQUENCE"] = ">";
    Operator["NOT"] = "!";
    Operator["FUZZY"] = "*";
    Operator["AND"] = "&";
    Operator["XOR"] = "^";
    Operator["OR"] = "|";
})(Operator || (Operator = {}));
