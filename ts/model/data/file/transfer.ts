import * as Text from "../../text.js";

import * as Version from "../version.js";

export class Instance
{
    private decompressor: Version.Decompressor.Instance;
    private dictionary: Text.Dictionary.Instance;
    private value: string;

    constructor(
        {
            decompressor = new Version.Decompressor.Instance(),
            dictionary = new Text.Dictionary.Instance(),
            value = ``,
        }: {
            decompressor?: Version.Decompressor.Instance,
            dictionary?: Text.Dictionary.Instance,
            value?: string,
        } = {},
    )
    {
        this.decompressor = decompressor;
        this.dictionary = dictionary;
        this.value = value;
    }

    private Enforce_Prototypes():
        void
    {
        Object.setPrototypeOf(this.decompressor, Version.Decompressor.Instance.prototype);
        Object.setPrototypeOf(this.dictionary, Text.Dictionary.Instance.prototype);
    }

    Dictionary():
        Text.Dictionary.Instance
    {
        this.Enforce_Prototypes();

        return this.dictionary;
    }

    Text(
        path_type?: Text.Path.Type,
    ):
        Text.Instance
    {
        this.Enforce_Prototypes();

        return new Text.Instance(
            {
                dictionary: this.dictionary,
                value: this.decompressor.Decompress_File(
                    {
                        dictionary: this.dictionary,
                        file_value: this.value,
                    },
                ),
                path_type: path_type,
            },
        );
    }
}
