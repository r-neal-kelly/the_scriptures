import * as Text from "../../text.js";

import * as Version from "../version.js";

export class Instance
{
    private compressor: Version.Compressor.Instance;
    private dictionary: Text.Dictionary.Instance;
    private value: string;

    constructor(
        {
            compressor = new Version.Compressor.Instance(),
            dictionary = new Text.Dictionary.Instance(),
            value = ``,
        }: {
            compressor?: Version.Compressor.Instance,
            dictionary?: Text.Dictionary.Instance,
            value?: string,
        } = {},
    )
    {
        this.compressor = compressor;
        this.dictionary = dictionary;
        this.value = value;
    }

    Text(
        path_type?: Text.Path.Type,
    ):
        Text.Instance
    {
        Object.setPrototypeOf(this.compressor, Version.Compressor.Instance.prototype);
        Object.setPrototypeOf(this.dictionary, Text.Dictionary.Instance.prototype);

        return new Text.Instance(
            {
                dictionary: this.dictionary,
                value: this.compressor.Decompress_File(
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
