import * as Entity from "../../../../../entity.js";
import * as Model from "../../../../../model/browser/body/reader/file.js";
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
        this.Add_This_CSS(`
                .File {
                    width: 100%;
                    padding: 0 4px;
                }
            `);
        this.Add_Children_CSS(`
                .Line {
                    display: block;

                    color: inherit;
                }

                .Centered_Line {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;

                    text-align: center;
                }

                .Segment {
                    display: inline-block;

                    color: inherit;
                }

                .Item {
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
                
                .Indented_Item {
                    width: 3em;
                }

                .Blank {
                    display: none;

                    color: transparent;
                }

                .Transparent {
                    color: transparent;
                }

                .Italic {
                    font-style: italic;
                }

                .Bold {
                    font-weight: bold;
                }

                .Underline {
                    text-decoration: underline;
                }

                .Small_Caps {
                    font-variant: small-caps;
                }

                .Error {
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
    On_Reclass() {
        return [`File`];
    }
    Model() {
        return this.model();
    }
    Reader() {
        return this.Parent();
    }
}
