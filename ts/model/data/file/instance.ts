import { Index } from "../../../types.js";
import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Language from "../../language.js";
import * as Text from "../../text.js";

import * as Consts from "../consts.js";
import * as Version from "../version.js";

import * as Transfer from "./transfer.js";

export type Leaf = Name;

export class Instance
{
    private version: Version.Instance;
    private title: Name;
    private name: Name;
    private index: Index;
    private path: Path;

    constructor(
        {
            version,
            title,
            index,
        }: {
            version: Version.Instance,
            title: Name,
            index: Index,
        },
    )
    {
        this.version = version;
        this.title = title;
        this.name = `${title}.${Consts.FILE_EXTENSION}`;
        this.index = index;
        this.path = `${version.Path()}/${this.name}`;
    }

    Version():
        Version.Instance
    {
        return this.version;
    }

    Title():
        Name
    {
        return this.title;
    }

    Name():
        Name
    {
        return this.name;
    }

    Index():
        Index
    {
        return this.index;
    }

    Path():
        Path
    {
        return this.path;
    }

    Default_Language_Name():
        Language.Name
    {
        return this.Version().Language().Name() as Language.Name;
    }

    async Text():
        Promise<Text.Instance>
    {
        return (
            await this.Version().Language().Book().Data().Cache().File_Text(
                this.Version().Path(),
                this.Name(),
            ) ||
            new Text.Instance()
        );
    }

    async Transfer():
        Promise<Transfer.Instance>
    {
        return (
            await this.Version().Language().Book().Data().Cache().File_Transfer(
                this.Version().Path(),
                this.Name(),
            ) ||
            new Transfer.Instance()
        );
    }
}
