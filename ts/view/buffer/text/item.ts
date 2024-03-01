import * as Utils from "../../../utils.js";

import * as Model from "../../../model/buffer/text/item.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Segment from "./segment.js";

export class Instance extends Text_Base.Item.Instance<
    Model.Instance,
    Buffer.Instance,
    Segment.Instance
>
{
    constructor(
        {
            segment,
            model,
        }: {
            segment: Segment.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                segment: segment,
                model: model,
            },
        );

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (!model.Is_Blank()) {
            const element: HTMLElement = this.Element();

            if (element instanceof HTMLDivElement) {
                if (model.Has_Image_Value()) {
                    this.Replace_Element(`img`);
                    this.Element().setAttribute(`src`, model.Value());
                } else {
                    this.Element().textContent = model.Value();
                }
            } else if (element instanceof HTMLImageElement) {
                if (model.Has_Image_Value()) {
                    this.Element().setAttribute(`src`, model.Value());
                } else {
                    this.Replace_Element(`div`);
                    this.Element().textContent = model.Value();
                }
            } else {
                Utils.Assert(
                    false,
                    `invalid element type.`,
                );
            }
        }
    }
}
