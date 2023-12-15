import { Count } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Async from "../../async.js";
import * as Compressor from "../../compressor.js";

import * as Consts from "./consts.js";
import * as Info from "./info.js";

export class Instance extends Async.Instance
{
    private info: Info.Instance | null;

    constructor()
    {
        super();

        this.info = null;

        this.Add_Dependencies(
            [
            ],
        );
    }

    async Info(
        force_download: boolean = false,
    ):
        Promise<Info.Instance | null>
    {
        if (force_download) {
            this.info = null;
        }

        if (this.info != null) {
            return this.info;
        } else {
            const text: string | null =
                await this.Text(Consts.INFO_PATH);

            if (text != null) {
                this.info = new Info.Instance(
                    {
                        json: Compressor.LZSS_Decompress(text),
                    },
                );
            }

            return this.info;
        }
    }

    private async Text(
        path: Path,
        {
            fetch_attempt_count,
            fetch_attempt_limit,
        }: {
            fetch_attempt_count: Count,
            fetch_attempt_limit: Count,
        } =
            {
                fetch_attempt_count: 0,
                fetch_attempt_limit: 10,
            },
    ):
        Promise<string | null>
    {
        if (fetch_attempt_count < fetch_attempt_limit) {
            const response: Response =
                await fetch(Utils.Resolve_Path(path));
            if (response.ok) {
                return await response.text();
            } else {
                return this.Text(
                    path,
                    {
                        fetch_attempt_count: fetch_attempt_count + 1,
                        fetch_attempt_limit: fetch_attempt_limit,
                    },
                );
            }
        } else {
            return null;
        }
    }
}
