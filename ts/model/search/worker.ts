import * as Data from "../data.js";

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

    postMessage(
        executor.Execute(
            file_transfer.Text(),
            expression,
        ),
    );
}
