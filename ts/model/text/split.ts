import { Index } from "../../types.js";

import { Value } from "./value.js";
import * as Item from "./item.js";
import * as Part from "./part";

export function From(
    break_: Part.Break.Instance,
):
    Array<Instance>
{
    const results: Array<Instance> = [];

    const matches: RegExpMatchArray | null =
        break_.Value().match(/\S+|\s/g);
    if (matches != null) {
        let index: Index = 0;
        for (const match of matches) {
            results.push(
                new Instance(
                    {
                        break_: break_,
                        from: index,
                        to: index += match.length,
                    },
                ),
            );
        }
    }

    return results;
}

export class Instance extends Item.Instance
{
    private break_: Part.Break.Instance;
    private from: Index;
    private to: Index;
    private value: Value;

    constructor(
        {
            break_,
            from,
            to,
        }: {
            break_: Part.Break.Instance,
            from: Index,
            to: Index,
        }
    )
    {
        super(
            {
                item_type: Item.Type.SPLIT,
            },
        );

        this.break_ = break_;
        this.from = from;
        this.to = to;
        this.value = break_.Value().slice(from, to);
    }

    Break():
        Part.Break.Instance
    {
        return this.break_;
    }

    From():
        Index
    {
        return this.from;
    }

    To():
        Index
    {
        return this.to;
    }

    override Value():
        Value
    {
        return this.value;
    }
}
