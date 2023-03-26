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
            return `
            display: inline-block;

            border-color: transparent;
            border-style: solid;
            border-width: 0 0 2px 0;
            ${is_error ? `border-color: #ffcbcb;` : ``}

            ${model.Index() === 0 && model.Parts().Line().Text().Is_Indented() ? `width: 3em;` : ``}

            ${model.Text().Has_Italic_Style() ? `font-style: italic;` : ``}
            ${model.Text().Has_Bold_Style() ? `font-weight: bold;` : ``}
            ${model.Text().Has_Underline_Style() ? `text-decoration: underline;` : ``}
            ${model.Text().Has_Small_Caps_Style() ? `font-variant: small-caps;` : ``}
            ${is_error ? `color: #ffcbcb;` : ``}
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            // I would like to avoid altering the text here,
            // probably need to figure out what can be done
            // with styling instead.
            const model = this.Model();
            //const text: string = model.Text().Value().replaceAll(/  /g, `  `);
            if (model.Text().Is_Command()) {
                this.Element().textContent = ``;
            }
            else {
                this.Element().textContent = model.Text().Value().replace(/ /g, ` `);
            }
        });
    }
    Model() {
        return this.model;
    }
    Parts() {
        return this.Parent();
    }
}
