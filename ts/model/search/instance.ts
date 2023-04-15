/*  
    We should add classes so that we can simply say {Break} or {Word}, etc.
    Would be nice to have + and * operators also.

    !(!day & night)
    - "₀day₁ ₂night₃.₄"
        dont_negate.
        call !(!day & night) matches:[]
            do_negate.
            call !day & night matches:[]
                call !day matches:[]
                    dont_negate.
                    call day matches:[]
                    return matches:[0-1] // if do_negate, it would be null
                return matches:[0-1]
                call night matches:[0-1]
                return matches:[0-1] // if dont_negate, it would be matches:[0-1,2-3]
            return matches:[0-1]
        return matches:[0-1]
       ___
    - "day night."

    !<!water & fire>
    - "water fire." >>> "₀water₁ ₂fire₃.₄"
        call !<!water & fire> matches:[]
            call <!water & fire> matches:[]
                call !water & fire matches:[]
                    call !water matches:[]
                        call water matches:[]
                        return matches:[0-1] // could return matches[] if no matches, not null
                    return matches:[1-2,2-3,3-4] // doesn't switch to matches[] yet, unlike non-sequence
                    call [implicit_break] matches:[1-2,2-3,3-4]
                        matches:[2-3>4] // increments end for a matched sequence
                    return matches:[2-4] // would return matches[] if no matches, not null!
                    call fire matches:[2-4]
                        matches:[]
                    return matches:[]
                return matches;[]
            return null // now sequence mode is done, it returns only lines that have matches.
        return matches:[] // inverts null to matches:[] just like any other non-sequence.
*/

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";
import * as Parser from "./parser.js";
import * as Executor from "./executor.js";
import * as Result from "./result.js";

export class Instance extends Entity.Instance
{
    private executor: Executor.Instance;

    constructor()
    {
        super();

        this.executor = new Executor.Instance();

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    Value(
        value: Text.Value,
        dictionary: Text.Dictionary.Instance,
        expression: string,
    ):
        Array<Result.Instance> | Parser.Help
    {
        return this.Text(
            new Text.Instance(
                {
                    dictionary: dictionary,
                    value: value,
                },
            ),
            expression,
        );
    }

    Text(
        text: Text.Instance,
        expression: string,
    ):
        Array<Result.Instance> | Parser.Help
    {
        return this.executor.Execute(
            expression,
            text,
        );
    }

    /*
    async Version(
        version_name: Name,
        expression: string,
    ):
        Promise< | Parser.Help>
    {
        const versions: Array<Data.Version.Instance> =
            Data.Singleton().Versions(
                {
                    book_names: null,
                    language_names: null,
                    version_names: [version_name],
                },
            );

        for (const version of versions) {
            const version_text: Data.Version.Text.Instance =
                await version.Text();
            for (let idx = 0, end = version_text.File_Text_Count(); idx < end; idx += 1) {
                const file_text: Text.Instance = version_text.File_Text_At(idx);
                const results_or_help: Array<Result.Instance> | Parser.Help =
                    this.executor.Execute(
                        expression,
                        file_text,
                    );
                if (results_or_help instanceof Parser.Help) {
                    return results_or_help as Parser.Help;
                } else {

                }
            }
        }
    }
    */
}
