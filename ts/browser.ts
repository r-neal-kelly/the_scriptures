import { Assert } from "./common"

document.body.style.height = "400px";
document.body.style.backgroundColor = "blue";

document.body.onclick = function (
    event: MouseEvent,
):
    void
{
    Assert(false);
}
