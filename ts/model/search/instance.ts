/*
    - ("God " & <("loves" | !"hates") & " David">) | *Lord

    The executor could simply know that it's in sequence mode
    and it could look for any sequence of a Part:"loves" Break:any Part:"David".
    So it would pick up "loves David", "loves. David", "loves: David", etc.
    If we do the clever thing, then this would pick up any three parts where the middle is
    any word and the left break has the ", " and the right break the " ". I do like that idea,
    I think. It avoids the explicit need for classes, like "{Word}" or "{Break}", which we can
    add later. I do believe it's logically sound because lines have to follow that pattern,
    except when commands get in the way of course. It's always interwoven words and breaks.
    Also points get in the way. I guess if ignoring commands, then it would skip them until
    it sees either a word/break/point?

    I think it can skip the clever logic if it determines that there is more than one part
    in the text value it's given from the text node. That makes sense. Otherwise, if the text
    is just one part, it can try to work with it in smarter ways. At any text node, it can look
    at the next node and see if it too is a text node and then work on the logic from there.
    I think all of this only matters in the sequence mode,I don't think default mode needs this.

    In any case, we could pass executor the data file, one by one and then we can let caller
    figure out how they're going to work with that asynchronously. That gives them the ability
    to show what they want when they can. Or we can do it version by version (which includes
    a book and a language.)

    Something else that we can make clever about the executor is to have it only look at commands
    when one is present in a text node. Else it just skips them entirely. I like that kind of
    implicit behavior for that, I think it's probably fine in this case. I know that having
    too much implicit behavior is not good, but there needs to be a balance between average users
    and power users. I think it just makes perfect sense to only look when one is explicitly asked for
    in the search language itself.
    
    The align operator brings into
    question how the executor will handle boundaries for alignment. Maybe the parser can help to
    determine that. Seeing how we only care about boundaries in a sequence, when it sees a text
    token is in a sequence, it can know what index that text is. But it should only increment the
    index on the AND operator right? I think so. We'd need to make sure that all the implicit AND
    tokens also add it up when in a sequence too. But really, it's not the index that's interesting
    it whether the text value is at the first, middle, last, or all/none of the sequence. It would be able to tell
    for first and middle, but it would either have to look forward or back to tell for last and all/none.
    But it would be worth doing that upfront so that executor doesn't have to dink around with that complication.

    Of course out of sequence, it should just check all boundaries.

    - !water
    Should return an array of lines that have no matches. The matches are there for the view to know what to highlight.
    See how we asked to highlight not water, it might be considered that we should highlight everything that is not
    water, but I think this is a mistake.
    - !water & fire
    Should return an array of lines that have matches for "fire" but not "water". See why it would be frustrating for the
    user to highlight every that is not water? We're really not interested in the non-sequence scope.
    However, in the sequence scope
    - <!water & fire>
    Should return an array lof lines that have a sequence of some word followed by a break, and then "fire", all of which
    should be highlighted. We can do look befores and look aheads too that simply aren't added to the matches but only verify
    if a match succeeds, but the default behavior is to match.

    Also this really does point out how we need
    classes in the language so that we can simply say {Break} or {Word}, etc. It's implicitly added
    here because the algorithm might be able to infer that somehow, but maybe not in the parser?
    If we do that in the parser, we'd have to pass a dictionary, which would increase the number
    of compilations that would be cached, but might be worth it. Parse would just look to the left
    to see if it's a text token, or close_group token I think, maybe two back if the and operator is
    present.

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

    The presence of matches:[] indicates that the expression does result in the line, however, there
    are no matches, nothing to highlight.
*/

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Parser from "./parser.js";
import * as Compiler from "./compiler.js";
import * as Executor from "./executor.js";

export class Instance extends Entity.Instance
{
    private parser: Parser.Instance;
    private compiler: Compiler.Instance;
    private executor: Executor.Instance;

    constructor()
    {
        super();

        this.parser = new Parser.Instance();
        this.compiler = new Compiler.Instance();
        this.executor = new Executor.Instance();

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }
}
