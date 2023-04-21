import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Line from "./line.js";
import * as Point from "./point.js";

export class Instance extends Entity.Instance
{
    private static min_point_count: Count = 8;

    private static blank_point: Point.Instance = new Point.Instance(
        {
            segment: null,
            index: null,
            text: null,
        },
    );

    static Min_Point_Count():
        Count
    {
        return Instance.min_point_count;
    }

    static Set_Min_Point_Count(
        min_point_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_point_count >= 0,
            `min_point_count must be greater than or equal to 0.`,
        );

        Instance.min_point_count = min_point_count;
    }

    private line: Line.Instance | null;
    private index: Index | null;
    private text: Text.Segment.Instance | null;
    private points: Array<Point.Instance>;

    constructor(
        {
            line,
            index,
            text,
        }: {
            line: Line.Instance | null,
            index: Index | null,
            text: Text.Segment.Instance | null,
        },
    )
    {
        super();

        this.line = line;
        this.index = index;
        this.text = text;
        this.points = [];

        if (text == null) {
            Utils.Assert(
                line == null,
                `line must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                line != null,
                `line must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            for (let idx = 0, end = text.Item_Count(); idx < end; idx += 1) {
                this.points.push(
                    new Point.Instance(
                        {
                            segment: this,
                            index: idx,
                            text: text.Item(idx) as Text.Part.Instance,
                        },
                    ),
                );
            }
        }

        this.Add_Dependencies(
            this.points,
        );
    }

    Line():
        Line.Instance
    {
        Utils.Assert(
            this.line != null,
            `Doesn't have line.`,
        );

        return this.line as Line.Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.index != null,
            `Doesn't have an index.`,
        );

        return this.index as Index;
    }

    Text():
        Text.Segment.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Segment.Instance;
    }

    Point_Count():
        Count
    {
        return this.points.length;
    }

    Point_At(
        point_index: Index,
    ):
        Point.Instance
    {
        Utils.Assert(
            point_index > -1,
            `point_index (${point_index}) must be greater than -1.`,
        );

        if (point_index < this.Point_Count()) {
            return this.points[point_index];
        } else {
            return Instance.blank_point;
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }
}
