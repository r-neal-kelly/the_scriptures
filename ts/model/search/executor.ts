import { Index } from "../../types.js";

import * as Text from "../text.js";
import * as Node from "./node.js";

export enum Mode
{
    DEFAULT = 0,
    SEQUENCE = 1 << 0,
    CASED = 1 << 1,
    ALIGNED = 1 << 2,
}

export class Line
{
    private text: Text.Line.Instance;
    private matches: Array<Match>;

    constructor(
        text: Text.Line.Instance,
    )
    {
        this.text = text;
        this.matches = [];
    }
}

export class Match
{
    private start_part_index: Index;
    private end_part_index: Index;
    private start_part_start_unit_index: Index;
    private end_part_end_unit_index: Index;

    constructor(
        {
            start_part_index,
            end_part_index,
            start_part_start_unit_index,
            end_part_end_unit_index,
        }: {
            start_part_index: Index,
            end_part_index: Index,
            start_part_start_unit_index: Index,
            end_part_end_unit_index: Index,
        },
    )
    {
        this.start_part_index = start_part_index;
        this.end_part_index = end_part_index;
        this.start_part_start_unit_index = start_part_start_unit_index;
        this.end_part_end_unit_index = end_part_end_unit_index;
    }
}

export class Instance
{
    // We could cache matches by expression + given data (which is from the singleton).

    constructor()
    {
    }

    Execute(
        node: Node.Instance,
        lines: Array<Text.Line.Instance>,
    ):
        Array<Line>
    {
        return this.Start(
            node,
            Mode.DEFAULT,
            lines.map(line => new Line(line)),
        );
    }

    private Start(
        node: Node.Instance,
        mode: Mode,
        lines: Array<Line>,
    ):
        Array<Line>
    {
        return lines;
    }
}
