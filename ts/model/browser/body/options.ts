import { Float } from "../../../types.js";

import * as Body from "./instance.js";

export class Instance
{
    private body: Body.Instance;
    private underlying_font_size_px: Float;

    constructor(
        {
            body,
            underlying_font_size_px,
        }: {
            body: Body.Instance,
            underlying_font_size_px: Float,
        },
    )
    {
        this.body = body;
        this.underlying_font_size_px = underlying_font_size_px;
    }

    Body():
        Body.Instance
    {
        return this.body;
    }

    Underlying_Font_Size_PX():
        Float
    {
        return this.underlying_font_size_px;
    }

    Set_Underlying_Font_Size_PX(
        underlying_font_size_px: Float,
    ):
        void
    {
        this.underlying_font_size_px = underlying_font_size_px;
    }
}
