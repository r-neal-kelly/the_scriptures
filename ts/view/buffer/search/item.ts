import { Count } from "../../../types.js";

import * as Model from "../../../model/buffer/search/item.js";
import * as Model_Language from "../../../model/language.js";
import * as Model_Languages from "../../../model/languages.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Segment from "./segment.js";
import * as Division from "./division.js";

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
        const count: Count = this.Child_Count();

        if (count > 0 && model.Is_Blank()) {
            this.Skip_Children();

            if (this.Element().classList.contains(`Blank`)) {
                this.Skip_Remaining_Siblings();
            }
        } else {
            const target: Count = Math.max(model.Min_Division_Count(), model.Division_Count());

            for (let idx = count, end = target; idx < end; idx += 1) {
                new Division.Instance(
                    {
                        item: this,
                        model: () => this.Model().Division_At(idx),
                    },
                );
            }
        }
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model.Instance = this.Model();
        if (!model.Is_Blank()) {
            const language: Model_Language.Name | null =
                model.Override_Language_Name();
            if (language) {
                return Model_Languages.Singleton().Default_Global_Font_Styles(language);
            } else {
                return ``;
            }
        } else {
            return ``;
        }
    }
}
