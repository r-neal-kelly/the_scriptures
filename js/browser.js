import { Assert } from "./common.js";
document.body.style.height = "400px";
document.body.style.backgroundColor = "blue";
document.body.onclick = function (event) {
    Assert(false);
};
