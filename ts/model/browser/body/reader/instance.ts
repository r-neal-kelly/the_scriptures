import * as Data from "../../../data.js";
import * as Text from "../../../text.js";

import * as Entity from "../../../entity.js";
import * as Body from "../instance.js";
import * as File from "./file.js";

export class Instance extends Entity.Instance
{
    private static blank_file: File.Instance = new File.Instance(
        {
            reader: null,
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

    static Blank_File():
        File.Instance
    {
        return this.blank_file;
    }

    private body: Body.Instance;
    private current_file: File.Instance;

    constructor(
        {
            body,
        }: {
            body: Body.Instance,
        },
    )
    {
        super();

        this.body = body;
        this.current_file = Instance.Blank_File();

        this.Add_Dependencies(
            [
                this.current_file,
            ],
        );
    }

    Body():
        Body.Instance
    {
        return this.body;
    }

    File():
        File.Instance
    {
        return this.current_file;
    }

    async Open_File(
        file: Data.File.Instance | null,
    ):
        Promise<void>
    {
        if (this.current_file.Maybe_Data() != file) {
            if (file != null) {
                this.current_file = new File.Instance(
                    {
                        reader: this,
                        data: file,
                        text: await file.Text(),
                    },
                );

                await this.current_file.Ready();
            } else {
                this.current_file = Instance.Blank_File();

                await this.current_file.Ready();
            }
        }
    }
}
