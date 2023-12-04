import * as Selector_CSS from "../selector/css.js";

export function This_CSS():
    string
{
    return Selector_CSS.This_CSS() + `
        .Selector {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
        }
    `;
}

export function Children_CSS():
    string
{
    return Selector_CSS.Children_CSS() + `
        .Slots {
            grid-template-columns: repeat(2, 1fr);
        }
    `;
}

export function CSS():
    string
{
    return Selector_CSS.CSS();
}
