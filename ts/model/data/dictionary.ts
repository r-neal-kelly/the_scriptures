import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Async from "../../async.js";

import * as Text from "../text.js";
import * as Files from "./files.js";

export class Instance extends Async.Instance
{
    private files: Files.Instance;
    private name: Name;
    private path: Path;
    private title: Name;
    private extension: Name;
    private text_dictionary: Text.Dictionary.Instance | null;

    constructor(
        {
            files,
        }: {
            files: Files.Instance,
        },
    )
    {
        super();

        this.files = files;
        this.name = `Dictionary.json`;
        this.path = `${files.Path()}/${this.name}`;
        this.title = this.name.replace(/\.[^.]*$/, ``);
        this.extension = this.name.replace(/^[^.]*\./, ``);
        this.text_dictionary = null;
    }

    Files():
        Files.Instance
    {
        return this.files;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }

    Title():
        Name
    {
        return this.title;
    }

    Extension():
        Name
    {
        return this.extension;
    }

    Text_Dictionary():
        Text.Dictionary.Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );
        Utils.Assert(
            this.text_dictionary != null,
            `text_dictionary should not be null when this is ready!`,
        );

        return this.text_dictionary as Text.Dictionary.Instance;
    }

    async Ready():
        Promise<void>
    {
        await super.Ready();

        let text_dictionary_json: string | null;

        const response: Response =
            await fetch(Utils.Resolve_Path(this.Path()));
        if (response.ok) {
            text_dictionary_json = await response.text();
        } else {
            text_dictionary_json = null;
        }

        this.text_dictionary = new Text.Dictionary.Instance(
            {
                json: text_dictionary_json,
            },
        );
    }
}
