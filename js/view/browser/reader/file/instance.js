import * as Entity from "../../../../entity.js";
import * as Model from "../../../../model/browser/reader/file.js";
import * as Line from "./line.js";
export class Instance extends Entity.Instance {
    constructor({ model, reader, }) {
        super({
            element: `div`,
            parent: reader,
            event_grid: reader.Event_Grid()
        });
        this.model = model;
    }
    On_Life() {
        this.Add_Children_CSS(`
                /* Lines */
                .Line {
                    display: block;

                    color: inherit;
                }

                .Blank_Line {
                    display: none;

                    color: transparent;
                }

                .New_Line {
                    color: transparent;
                }

                .Centered_Line {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;

                    text-align: center;
                }

                /* Segments */
                .Segment {
                    display: inline-block;

                    color: inherit;
                }

                .Blank_Segment {
                    display: none;

                    color: transparent;
                }

                /* Parts */
                .Part {
                    display: inline-block;

                    width: auto;

                    border-style: solid;
                    border-width: 0 0 2px 0;
                    border-color: transparent;

                    color: inherit;
                    font-style: normal;
                    font-weight: normal;
                    font-variant: normal;
                    text-decoration: none;
                }

                .Blank_Part {
                    display: none;
                }
                
                .Indented_Part {
                    width: 3em;
                }

                .Italic_Part {
                    font-style: italic;
                }

                .Bold_Part {
                    font-weight: bold;
                }

                .Underline_Part {
                    text-decoration: underline;
                }

                .Small_Caps_Part {
                    font-variant: small-caps;
                }

                .Error_Part {
                    border-color: #ffcbcb;

                    color: #ffcbcb;
                }
            `);
        return [];
    }
    On_Refresh() {
        const model = this.Model();
        const target = Math.max(Model.Instance.Min_Line_Count(), model.Line_Count());
        const count = this.Child_Count();
        for (let idx = count, end = target; idx < end; idx += 1) {
            new Line.Instance({
                model: () => this.Model().Line_At(idx),
                file: this,
            });
        }
    }
    On_Restyle() {
        return `
            width: 100%;
            padding: 0 4px;
        `;
    }
    Model() {
        return this.model();
    }
}
