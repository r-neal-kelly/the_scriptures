import { Name } from "../../../../types.js";

import * as Entity from "../../../entity.js";
import * as Languages from "../../../languages.js";
import * as Data from "../../../data.js";
import * as Text from "../../../text.js";
import * as Buffer from "../../../buffer.js";
import * as Body from "../instance.js";

export class Instance extends Entity.Instance
{
    private static blank_file: Buffer.Text.Instance = new Buffer.Text.Instance(
        {
            default_language_name: Languages.Name.ENGLISH,
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
        Buffer.Text.Instance
    {
        return this.blank_file;
    }

    private body: Body.Instance;
    private current_data: Data.File.Instance | null;
    private current_file: Buffer.Text.Instance;

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
        this.current_data = null;
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

    Maybe_Current_Data():
        Data.File.Instance | null
    {
        return this.current_data;
    }

    File():
        Buffer.Text.Instance
    {
        return this.current_file;
    }

    async Refresh_File():
        Promise<void>
    {
        const new_data: Data.File.Instance | null =
            this.Body().Selector().Maybe_File();
        if (this.Maybe_Current_Data() != new_data) {
            this.current_data = new_data;
            if (new_data != null) {
                this.current_file = new Buffer.Text.Instance(
                    {
                        default_language_name: new_data.Default_Language_Name(),
                        text: await new_data.Text(),
                    },
                );
            } else {
                this.current_file = Instance.Blank_File();
            }
            await this.current_file.Ready();
        }
    }
}
