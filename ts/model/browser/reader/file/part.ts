import { Index } from "../../../../types.js";

import * as Text from "../../../text.js";

import * as Parts from "./parts.js";

export class Instance
{
    private parts: Parts.Instance;
    private index: Index;
    private text: Text.Part.Instance;

    constructor(
        {
            parts,
            index,
            text,
        }: {
            parts: Parts.Instance,
            index: Index,
            text: Text.Part.Instance,
        },
    )
    {
        this.parts = parts;
        this.index = index;
        this.text = text;
    }

    Parts():
        Parts.Instance
    {
        return this.parts;
    }

    Index():
        Index
    {
        return this.index;
    }

    Text():
        Text.Part.Instance
    {
        return this.text;
    }
}
