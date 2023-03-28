import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";

import * as Text from "../../text.js";

import * as Browser from "../instance.js";
import * as Data from "../data.js";
import * as File from "./file.js";

export class Instance extends Async.Instance
{
    private browser: Browser.Instance;
    private blank_file: File.Instance;
    private current_file: File.Instance;

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
        this.blank_file = new File.Instance(
            {
                reader: this,
                data: null,
                text: new Text.Instance(
                    {
                        dictionary: new Text.Dictionary.Instance(
                            {
                                json: null,
                            },
                        ),
                        value: ``,
                    },
                ),
            },
        );
        this.current_file = this.blank_file;
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    File():
        File.Instance
    {
        return this.current_file;
    }

    async Open_File(
        file: Data.File.Instance,
    ):
        Promise<void>
    {
        if (this.current_file.Maybe_Data() != file) {
            const file_dictionary: Text.Dictionary.Instance =
                (await file.Files().Dictionary()).Text_Dictionary();
            const file_value: string =
                (await file.Maybe_Text() || ``).replace(/\r?\n\r?\n/g, `\n \n`);

            this.current_file = new File.Instance(
                {
                    reader: this,
                    data: file,
                    text: new Text.Instance(
                        {
                            dictionary: file_dictionary,
                            value: file_value,
                        },
                    ),
                },
            );
        }
    }
}
