import { Count } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Utils from "../../../../utils.js";
import * as Async from "../../../../async.js";

import * as Language from "../../../language.js";
import * as Text from "../../../text.js";
import * as Search from "../../../search.js";
import * as Filter from "../../../selector.js";
import * as Body from "../instance.js";
import * as Tree from "./tree.js";
import * as Buffer from "../../../buffer/search.js";

export class Instance extends Async.Instance
{
    private body: Body.Instance;
    private tree: Tree.Instance;
    private is_showing_commands: boolean;
    private buffer: Buffer.Instance;

    private book_count: Count;
    private language_count: Count;
    private version_count: Count;
    private file_count: Count;
    private line_count: Count;
    private match_count: Count;
    private counts_as_string: string;

    constructor(
        {
            body,
            filter_slot_order,
            versions_results,
            is_showing_commands,
        }: {
            body: Body.Instance,
            filter_slot_order: Filter.Slot.Order,
            versions_results: Search.Result.Versions,
            is_showing_commands: boolean,
        },
    )
    {
        super();

        const unique_book_names = new Set();
        const unique_language_names = new Set();
        const unique_version_names = new Set();

        this.file_count = 0;
        this.line_count = 0;
        this.match_count = 0;

        type Tree_Root = {
            [name: Name]: {
                [name: Name]: {
                    [name: Name]: Array<Tree.Leaf.Data>,
                },
            },
        };

        const tree_root: Tree_Root = {};

        const add = function (
            this: Instance,
            name_a: Name,
            name_b: Name,
            name_c: Name,
            version_results: Search.Result.Version,
        ):
            void
        {
            if (tree_root[name_a] == null) {
                tree_root[name_a] = {};
            }
            if (tree_root[name_a][name_b] == null) {
                tree_root[name_a][name_b] = {};
            }
            Utils.Assert(
                tree_root[name_a][name_b][name_c] == null,
                `Can't clobber files!`,
            );
            tree_root[name_a][name_b][name_c] = [];
            for (const file_results of version_results) {
                this.file_count += 1;
                this.line_count += file_results[1].length;
                for (const result of file_results[1]) {
                    this.match_count += result.Total_Match_Count();
                }

                tree_root[name_a][name_b][name_c].push(
                    {
                        file: file_results[0],
                        results: file_results[1],
                    },
                );
            }
        }.bind(this);

        if (filter_slot_order === Filter.Slot.Order.BOOKS_LANGUAGES_VERSIONS) {
            for (const version_results of versions_results) {
                const book_name: Name = version_results[0].Language().Book().Name();
                const language_name: Name = version_results[0].Language().Name();
                const version_name: Name = version_results[0].Name();

                unique_book_names.add(book_name);
                unique_language_names.add(language_name);
                unique_version_names.add(version_name);

                add(book_name, language_name, version_name, version_results[1]);
            }
        } else if (filter_slot_order === Filter.Slot.Order.BOOKS_VERSIONS_LANGUAGES) {
            for (const version_results of versions_results) {
                const book_name: Name = version_results[0].Language().Book().Name();
                const language_name: Name = version_results[0].Language().Name();
                const version_name: Name = version_results[0].Name();

                unique_book_names.add(book_name);
                unique_language_names.add(language_name);
                unique_version_names.add(version_name);

                add(book_name, version_name, language_name, version_results[1]);
            }
        } else if (filter_slot_order === Filter.Slot.Order.LANGUAGES_BOOKS_VERSIONS) {
            for (const version_results of versions_results) {
                const book_name: Name = version_results[0].Language().Book().Name();
                const language_name: Name = version_results[0].Language().Name();
                const version_name: Name = version_results[0].Name();

                unique_book_names.add(book_name);
                unique_language_names.add(language_name);
                unique_version_names.add(version_name);

                add(language_name, book_name, version_name, version_results[1]);
            }
        } else if (filter_slot_order === Filter.Slot.Order.LANGUAGES_VERSIONS_BOOKS) {
            for (const version_results of versions_results) {
                const book_name: Name = version_results[0].Language().Book().Name();
                const language_name: Name = version_results[0].Language().Name();
                const version_name: Name = version_results[0].Name();

                unique_book_names.add(book_name);
                unique_language_names.add(language_name);
                unique_version_names.add(version_name);

                add(language_name, version_name, book_name, version_results[1]);
            }
        } else if (filter_slot_order === Filter.Slot.Order.VERSIONS_BOOKS_LANGUAGES) {
            for (const version_results of versions_results) {
                const book_name: Name = version_results[0].Language().Book().Name();
                const language_name: Name = version_results[0].Language().Name();
                const version_name: Name = version_results[0].Name();

                unique_book_names.add(book_name);
                unique_language_names.add(language_name);
                unique_version_names.add(version_name);

                add(version_name, book_name, language_name, version_results[1]);
            }
        } else if (filter_slot_order === Filter.Slot.Order.VERSIONS_LANGUAGES_BOOKS) {
            for (const version_results of versions_results) {
                const book_name: Name = version_results[0].Language().Book().Name();
                const language_name: Name = version_results[0].Language().Name();
                const version_name: Name = version_results[0].Name();

                unique_book_names.add(book_name);
                unique_language_names.add(language_name);
                unique_version_names.add(version_name);

                add(version_name, language_name, book_name, version_results[1]);
            }
        } else {
            Utils.Assert(
                false,
                `Unknown filter_slot_order.`,
            );
        }
        this.book_count = unique_book_names.size;
        this.language_count = unique_language_names.size;
        this.version_count = unique_version_names.size;

        {
            const matches: string = this.match_count === 1 ?
                `1 match` :
                `${this.match_count} matches`;
            const lines: string = this.line_count === 1 ?
                `1 line` :
                `${this.line_count} lines`;
            const files: string = this.file_count === 1 ?
                `1 file` :
                `${this.file_count} files`;
            const versions: string = this.version_count === 1 ?
                `1 version` :
                `${this.version_count} versions`;
            const languages: string = this.language_count === 1 ?
                `1 language` :
                `${this.language_count} languages`;
            const books: string = this.book_count === 1 ?
                `1 book` :
                `${this.book_count} books`;

            if (filter_slot_order === Filter.Slot.Order.BOOKS_LANGUAGES_VERSIONS) {
                this.counts_as_string = `${matches} in ${lines}, ${files}, ${versions}, ${languages}, and ${books}`;
            } else if (filter_slot_order === Filter.Slot.Order.BOOKS_VERSIONS_LANGUAGES) {
                this.counts_as_string = `${matches} in ${lines}, ${files}, ${languages}, ${versions}, and ${books}`;
            } else if (filter_slot_order === Filter.Slot.Order.LANGUAGES_BOOKS_VERSIONS) {
                this.counts_as_string = `${matches} in ${lines}, ${files}, ${versions}, ${books}, and ${languages}`;
            } else if (filter_slot_order === Filter.Slot.Order.LANGUAGES_VERSIONS_BOOKS) {
                this.counts_as_string = `${matches} in ${lines}, ${files}, ${books}, ${versions}, and ${languages}`;
            } else if (filter_slot_order === Filter.Slot.Order.VERSIONS_BOOKS_LANGUAGES) {
                this.counts_as_string = `${matches} in ${lines}, ${files}, ${languages}, ${books}, and ${versions}`;
            } else if (filter_slot_order === Filter.Slot.Order.VERSIONS_LANGUAGES_BOOKS) {
                this.counts_as_string = `${matches} in ${lines}, ${files}, ${books}, ${languages}, and ${versions}`;
            } else {
                Utils.Assert(
                    false,
                    `Unknown filter_slot_order.`,
                );

                this.counts_as_string = ``;
            }
        }

        this.body = body;
        this.tree = new Tree.Instance(
            {
                results: this,
                data: tree_root,
            },
        );
        this.is_showing_commands = is_showing_commands;
        this.buffer = new Buffer.Instance(
            {
                default_language_name: Language.Name.ENGLISH,
                underlying_font_size_px: 16,

                text: new Text.Instance(),
                results: [],
                is_showing_commands: is_showing_commands,
            },
        );

        this.Add_Dependencies(
            [
                this.buffer,
            ],
        );
    }

    Body():
        Body.Instance
    {
        return this.body;
    }

    Tree():
        Tree.Instance
    {
        return this.tree;
    }

    Buffer():
        Buffer.Instance
    {
        return this.buffer;
    }

    async Set_Buffer(
        default_language_name: Language.Name,
        text: Text.Instance,
        results: Array<Search.Result.Instance>,
    ):
        Promise<void>
    {
        this.buffer = new Buffer.Instance(
            {
                default_language_name: default_language_name,
                underlying_font_size_px: 16,

                text: text,
                results: results,
                is_showing_commands: this.is_showing_commands,
            },
        );
        await this.buffer.Ready();
    }

    Book_Count():
        Count
    {
        return this.book_count;
    }

    Language_Count():
        Count
    {
        return this.language_count;
    }

    Version_Count():
        Count
    {
        return this.version_count;
    }

    File_Count():
        Count
    {
        return this.file_count;
    }

    Line_Count():
        Count
    {
        return this.line_count;
    }

    Match_Count():
        Count
    {
        return this.match_count;
    }

    Counts_As_String():
        string
    {
        return this.counts_as_string;
    }
}
