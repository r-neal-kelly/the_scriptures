import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import { Family } from "./family.js";

export class Instance
{
    private css_family: Family;
    private css_url: Path;
    private css_weight: string | null;
    private css_style: string | null;
    private css: string;

    constructor(
        {
            css_family,
            css_url,
            css_weight = null,
            css_style = null,
        }: {
            css_family: Family,
            css_url: Path,
            css_weight?: string | null,
            css_style?: string | null,
        },
    )
    {
        this.css_family = css_family;
        this.css_url = Utils.Resolve_Path(css_url);
        this.css_weight = css_weight;
        this.css_style = css_style;

        this.css = `@font-face {`;
        this.css += `    font-family: "${this.css_family}";`;
        if (this.css_weight != null) {
            this.css += `    font-weight: ${this.css_weight};`;
        }
        if (this.css_style != null) {
            this.css += `    font-style: ${this.css_style};`;
        }
        this.css += `    src: url("${this.css_url}");`;
        this.css += `}`;
    }

    CSS_Family():
        Family
    {
        return this.css_family;
    }

    CSS_URL():
        Path
    {
        return this.css_url;
    }

    CSS_Weight():
        string | null
    {
        return this.css_weight;
    }

    CSS_Style():
        string | null
    {
        return this.css_style;
    }

    CSS():
        string
    {
        return this.css;
    }
}
