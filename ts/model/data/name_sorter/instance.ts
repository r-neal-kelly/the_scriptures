import { Name } from "../../../types.js";
import { Type } from "./type.js";
import * as Language from "../../language.js"

const KNOWN_BOOK_NAMES: Set<Name> = new Set(
    [
        `Prolegomenon`,
        `Genesis`,
        `Exodus`,
        `Leviticus`,
        `Numbers`,
        `Deuteronomy`,
        `Jubilees`,
        `Masoretic Notes`,
        `Prolegomena to the History of Israel`,
    ],
);
Object.freeze(KNOWN_BOOK_NAMES);

const KNOWN_LANGUAGE_NAMES: Set<Name> = new Set(
    [
        Language.Name.HEBREW,
        Language.Name.GREEK,
        Language.Name.LATIN,
        Language.Name.GERMAN,
        Language.Name.FRENCH,
        Language.Name.ENGLISH,
        Language.Name.DUTCH,
    ],
);
Object.freeze(KNOWN_LANGUAGE_NAMES);

export class Instance
{
    constructor()
    {
    }

    With_Set(
        type: Type,
        names: Set<Name>,
    ):
        Array<Name>
    {
        const static_names: Set<Name> =
            type === Type.BOOKS ?
                KNOWN_BOOK_NAMES :
                type === Type.LANGUAGES ?
                    KNOWN_LANGUAGE_NAMES :
                    new Set();
        const known_names: Array<Name> = [];
        const unknown_names: Array<Name> = [];

        for (let static_name of static_names) {
            if (names.has(static_name)) {
                known_names.push(static_name);
            }
        }

        for (let name of names) {
            if (!static_names.has(name)) {
                unknown_names.push(name);
            }
        }

        return known_names.concat(unknown_names.sort());
    }

    With_Array(
        type: Type,
        names: Array<Name>,
    ):
        Array<Name>
    {
        const static_names: Set<Name> =
            type === Type.BOOKS ?
                KNOWN_BOOK_NAMES :
                type === Type.LANGUAGES ?
                    KNOWN_LANGUAGE_NAMES :
                    new Set();
        const known_names: Array<Name> = [];
        const unknown_names: Array<Name> = [];

        for (let static_name of static_names) {
            if (names.indexOf(static_name) > -1) {
                known_names.push(static_name);
            }
        }

        for (let name of names) {
            if (!static_names.has(name)) {
                unknown_names.push(name);
            }
        }

        return known_names.concat(unknown_names.sort());
    }
}
