var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, parts, }) {
        super({
            element: `span`,
            parent: parts,
            event_grid: parts.Event_Grid(),
        });
        this.model = model;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model();
            const is_error = model.Text().Is_Error() ||
                model.Text().Has_Error_Style();
            const width = model.Index() === 0 && model.Parts().Line().Text().Is_Indented() ?
                `3em` :
                `auto`;
            const border_color = is_error ?
                `#ffcbcb` :
                `transparent`;
            const color = is_error ?
                `#ffcbcb` :
                `inherit`;
            const font_style = model.Text().Has_Italic_Style() ?
                `italic` :
                `normal`;
            const font_weight = model.Text().Has_Bold_Style() ?
                `bold` :
                `normal`;
            const font_variant = model.Text().Has_Small_Caps_Style() ?
                `small-caps` :
                `normal`;
            const text_decoration = model.Text().Has_Underline_Style() ?
                `underline` :
                `none`;
            return `
            display: inline-block;

            width: ${width};

            border-style: solid;
            border-width: 0 0 2px 0;
            border-color: ${border_color};

            color: ${color};
            font-style: ${font_style};
            font-weight: ${font_weight};
            font-variant: ${font_variant};
            text-decoration: ${text_decoration};
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model();
            if (model.Text().Is_Command()) {
                this.Element().textContent = ``;
            }
            else {
                // Doing this in reader causes the dictionary to think some things are
                // errors, because the dictionary doesn't recognize the non-breaking space.
                this.Element().textContent = model.Text().Value().replace(/ /g, ` `);
            }
        });
    }
    Model() {
        return this.model();
    }
    Parts() {
        return this.Parent();
    }
}
