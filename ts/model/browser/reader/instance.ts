import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";

import * as Text from "../../text.js";

import * as Browser from "../instance.js";
import * as Data from "../data.js";
import * as File from "./file.js";

export class Instance extends Async.Instance
{
    private browser: Browser.Instance;
    private file: File.Instance | null;

    constructor(
        {
            browser,
        }: {
            browser: Browser.Instance,
        },
    )
    {
        super();

        this.browser = browser;
        this.file = null;
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    Has_File():
        boolean
    {
        return this.file != null;
    }

    File():
        File.Instance
    {
        Utils.Assert(
            this.Has_File(),
            `Has no file.`,
        );

        return this.file as File.Instance;
    }

    async Open_File(
        file: Data.File.Instance,
    ):
        Promise<void>
    {
        if (
            this.file == null ||
            this.file.Data() != file
        ) {
            this.file = new File.Instance(
                {
                    reader: this,
                    data: file,
                    text: new Text.Instance(
                        {
                            dictionary: (await file.Files().Dictionary()).Text_Dictionary(),
                            value: (await file.Maybe_Text() || ``).replace(/\r?\n\r?\n/g, `\n \n`),
                        },
                    ),
                },
            );
        }
    }
}
