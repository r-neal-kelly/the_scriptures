import * as Utils from "../../utils.js";

import * as Data from "../data.js";

import * as Parser from "./parser.js";
import * as Node from "./node.js";
import * as Executor from "./executor.js";

const executor: Executor.Instance = new Executor.Instance();

onmessage = function (
    event: MessageEvent<
        {
            file_transfer: Data.File.Transfer.Instance,
            expression: string,
        }
    >,
):
    void
{
    const {
        file_transfer,
        expression,
    } = event.data;

    Object.setPrototypeOf(file_transfer, Data.File.Transfer.Instance.prototype);

    const node_or_help: Node.Instance | Parser.Help = executor.Node_Or_Help(
        file_transfer.Dictionary(),
        expression,
    );

    Utils.Assert(
        !(node_or_help instanceof Parser.Help),
        `cannot return parser help from worker`,
    );

    postMessage(
        executor.Execute_With_Node(
            file_transfer.Text(),
            node_or_help as Node.Instance,
        ),
    );
}
