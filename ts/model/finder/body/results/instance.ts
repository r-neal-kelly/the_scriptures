import { Name } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Entity from "../../../entity.js";
import * as Search from "../../../search.js";
import * as Filter from "../../../selector.js";
import * as Body from "../instance.js";
import * as Tree from "./tree.js";
import * as Buffer from "../../../buffer/search.js";

export class Instance extends Entity.Instance
{
    private body: Body.Instance;
    private tree: Tree.Instance;
    private is_showing_commands: boolean;
    private buffer: Buffer.Instance;

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

        type Tree_Root = {
            [name: Name]: {
                [name: Name]: {
                    [name: Name]: Array<Tree.Leaf.Data>,
                },
            },
        };

        const tree_root: Tree_Root = {};

        function Add(
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
                tree_root[name_a][name_b][name_c].push(
                    {
                        name: file_results[0].Name(),
                        results: file_results[1],
                    },
                );
            }
        }

        if (filter_slot_order === Filter.Slot.Order.BOOKS_LANGUAGES_VERSIONS) {
            for (const version_results of versions_results) {
                Add(
                    version_results[0].Language().Book().Name(),
                    version_results[0].Language().Name(),
                    version_results[0].Name(),
                    version_results[1],
                );
            }
        } else if (filter_slot_order === Filter.Slot.Order.BOOKS_VERSIONS_LANGUAGES) {
            for (const version_results of versions_results) {
                Add(
                    version_results[0].Language().Book().Name(),
                    version_results[0].Name(),
                    version_results[0].Language().Name(),
                    version_results[1],
                );
            }
        } else if (filter_slot_order === Filter.Slot.Order.LANGUAGES_BOOKS_VERSIONS) {
            for (const version_results of versions_results) {
                Add(
                    version_results[0].Language().Name(),
                    version_results[0].Language().Book().Name(),
                    version_results[0].Name(),
                    version_results[1],
                );
            }
        } else if (filter_slot_order === Filter.Slot.Order.LANGUAGES_VERSIONS_BOOKS) {
            for (const version_results of versions_results) {
                Add(
                    version_results[0].Language().Name(),
                    version_results[0].Name(),
                    version_results[0].Language().Book().Name(),
                    version_results[1],
                );
            }
        } else if (filter_slot_order === Filter.Slot.Order.VERSIONS_BOOKS_LANGUAGES) {
            for (const version_results of versions_results) {
                Add(
                    version_results[0].Name(),
                    version_results[0].Language().Book().Name(),
                    version_results[0].Language().Name(),
                    version_results[1],
                );
            }
        } else if (filter_slot_order === Filter.Slot.Order.VERSIONS_LANGUAGES_BOOKS) {
            for (const version_results of versions_results) {
                Add(
                    version_results[0].Name(),
                    version_results[0].Language().Name(),
                    version_results[0].Language().Book().Name(),
                    version_results[1],
                );
            }
        } else {
            Utils.Assert(
                false,
                `Unknown filter_slot_order.`,
            );
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
                results: [],
                is_showing_commands: this.is_showing_commands,
            },
        );

        this.Add_Dependencies(
            [
                this.tree,
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

    Set_Buffer(
        results: Array<Search.Result.Instance>,
    ):
        void
    {
        this.buffer = new Buffer.Instance(
            {
                results: results,
                is_showing_commands: this.is_showing_commands,
            },
        );
    }
}
