import { Index } from "../../types.js";

import * as Text from "./instance.js";
import { Value } from "./value.js";
import * as Command from "./command.js";
import * as Word from "./word.js";
import * as Break from "./break.js";
import * as Letter from "./letter.js";
import * as Marker from "./marker.js";

export class Instance
{
    private text: Text.Instance;
    private index: Index;
    private value: Value;
    private parts: Array<
        Command.Instance |
        Word.Instance |
        Break.Instance |
        Letter.Instance |
        Marker.Instance
    >;
    private points: Array<
        Command.Instance |
        Letter.Instance |
        Marker.Instance
    >;
    private centered: boolean;

    constructor(
        {
            text,
            index,
            value,
        }: {
            text: Text.Instance,
            index: Index,
            value: Value,
        },
    )
    {
        this.text = text;
        this.index = index;
        this.value = value;
        this.parts = [];
        this.points = [];
        this.centered = value.slice(0, Command.Value.CENTER.length) === Command.Value.CENTER;

        // I think the idea is that we should go ahead and create parts and points in one loop
        // although if it's too convoluted we can just do two loops
    }

    Text():
        Text.Instance
    {
        return this.text;
    }

    Index():
        Index
    {
        return this.index;
    }

    Value():
        Value
    {
        return this.value;
    }

    Parts():
        Array<
            Command.Instance |
            Word.Instance |
            Break.Instance |
            Letter.Instance |
            Marker.Instance
        >
    {
        return Array.from(this.parts);
    }

    Points():
        Array<
            Command.Instance |
            Letter.Instance |
            Marker.Instance
        >
    {
        return Array.from(this.points);
    }

    Centered():
        boolean
    {
        return this.centered;
    }
}
