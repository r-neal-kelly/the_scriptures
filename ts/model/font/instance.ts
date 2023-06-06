import * as Utils from "../../utils.js";

import { Name } from "./name.js";
import { Family } from "./family.js";
import * as Face from "./face.js";

export class Instance
{
    private name: Name;
    private family: Family;
    private faces: Array<Face.Instance>;
    private css_definition: string;

    constructor(
        {
            name,
            faces,
        }: {
            name: Name,
            faces: Array<Face.Instance>,
        },
    )
    {
        Utils.Assert(
            faces.length > 0,
            `font must have at least 1 face.`,
        );

        this.name = name;
        this.family = faces[0].CSS_Family();
        this.faces = faces;
        this.css_definition = ``;
        for (const face of this.faces) {
            this.css_definition += face.CSS();
            this.css_definition += `\n`;
        }

        if (!Object.isFrozen(this.faces)) {
            Object.freeze(this.faces);
        }
    }

    Name():
        Name
    {
        return this.name;
    }

    Family():
        Family
    {
        return this.family;
    }

    Faces():
        Array<Face.Instance>
    {
        return Array.from(this.faces);
    }

    CSS_Definition():
        string
    {
        return this.css_definition;
    }
}
