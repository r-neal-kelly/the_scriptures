import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Circle_Buffer from "../../circle_buffer.js";
import * as Compressor from "../../compressor.js";

import * as Entity from "../entity.js";
import * as Text from "../text.js";

import * as Consts from "./consts.js";
import * as Info from "./info.js";
import * as Version from "./version.js";

export interface Public_i
{
    Info(
        force_download: boolean,
    ): Promise<Info.Instance | null>;

    /*
        This is intended to be called before requesting
        File_Text()s themselves. It's useful if the
        caller knows they are going to want to use all
        of a version's files in short order. It doesn't
        guarantee that they will be there if there are
        a lot of other contexts calling the cache at
        the same time, but in most cases it will load
        up an entire version so it can be used quicker.
    */
    Cache_Version_And_Files(
        version_path: Path,
        file_names: Array<Name>,
        {
            attempt_count,
            attempt_limit,
        }?: {
            attempt_count?: Count,
            attempt_limit?: Count,
        },
    ): Promise<void>;

    File_Text(
        version_path: Path,
        file_name: Name,
        path_type?: Text.Path.Type,
    ): Promise<Text.Instance | null>;
}

type Version_ID =
    Path;

class Version_Cache
{
    private id: Version_ID;
    private compressor: Version.Compressor.Instance;
    private dictionary: Text.Dictionary.Instance;
    private reference_count: Count;

    constructor(
        {
            id,
            compressed_unique_parts_json,
            compressed_dictionary_json,
        }: {
            id: Version_ID,
            compressed_unique_parts_json: string,
            compressed_dictionary_json: string,
        },
    )
    {
        this.id = id;
        this.compressor = new Version.Compressor.Instance(
            {
                unique_parts: JSON.parse(
                    Compressor.LZSS_Decompress(compressed_unique_parts_json),
                ),
            },
        );
        this.dictionary = new Text.Dictionary.Instance(
            {
                json: this.compressor.Decompress_Dictionary(
                    {
                        dictionary_value: compressed_dictionary_json,
                    },
                ),
            },
        );
        this.reference_count = 0;
    }

    ID():
        Version_ID
    {
        return this.id;
    }

    Compressor():
        Version.Compressor.Instance
    {
        return this.compressor;
    }

    Dictionary():
        Text.Dictionary.Instance
    {
        return this.dictionary;
    }

    Reference_Count():
        Count
    {
        return this.reference_count;
    }

    Increment_Reference_Count():
        void
    {
        Utils.Assert(
            this.reference_count < Number.MAX_SAFE_INTEGER,
            `cannot increment reference_count`,
        );

        this.reference_count += 1;
    }

    Decrement_Reference_Count():
        void
    {
        Utils.Assert(
            this.reference_count > 0,
            `cannot decrement reference_count`,
        );

        this.reference_count -= 1;
    }
}

type File_ID =
    Path;

class File_Cache
{
    private id: File_ID;
    private version_id: Version_ID;
    private compressed_file_text: string;

    constructor(
        {
            id,
            version_id,
            compressed_file_text,
        }: {
            id: File_ID,
            version_id: Version_ID,
            compressed_file_text: string,
        },
    )
    {
        this.id = id;
        this.version_id = version_id;
        this.compressed_file_text = compressed_file_text;
    }

    ID():
        File_ID
    {
        return this.id;
    }

    Version_ID():
        Version_ID
    {
        return this.version_id;
    }

    Compressed_File_Text():
        string
    {
        return this.compressed_file_text;
    }
}

export class Instance extends Entity.Instance implements Public_i
{
    private info: Info.Instance | null;

    private version_buffer: Circle_Buffer.Instance<Version_ID>;
    private version_caches: { [index: Version_ID]: Version_Cache };

    private file_buffer: Circle_Buffer.Instance<File_ID>;
    private file_caches: { [index: File_ID]: File_Cache };

    constructor(
        {
            version_cache_limit = Consts.DEFAULT_VERSION_CACHE_LIMIT,
            file_cache_limit = Consts.DEFAULT_FILE_CACHE_LIMIT,
        }: {
            version_cache_limit?: Count,
            file_cache_limit?: Count,
        } = {},
    )
    {
        super();

        this.info = null;

        this.version_buffer = new Circle_Buffer.Instance(
            {
                capacity: version_cache_limit,
                initial_unit: ``,
            },
        );
        this.version_caches = {};

        this.file_buffer = new Circle_Buffer.Instance(
            {
                capacity: file_cache_limit,
                initial_unit: ``,
            },
        );
        this.file_caches = {};

        this.Add_Dependencies(
            [
            ],
        );
    }

    private async String(
        path: Path,
        {
            fetch_attempt_count = 0,
            fetch_attempt_limit = Consts.DEFAULT_FETCH_ATTEMPT_LIMIT,
        }: {
            fetch_attempt_count?: Count,
            fetch_attempt_limit?: Count,
        } = {},
    ):
        Promise<string | null>
    {
        if (fetch_attempt_count < fetch_attempt_limit) {
            const response: Response =
                await fetch(Utils.Resolve_Path(path));
            if (response.ok) {
                return await response.text();
            } else {
                return this.String(
                    path,
                    {
                        fetch_attempt_count: fetch_attempt_count + 1,
                        fetch_attempt_limit: fetch_attempt_limit,
                    },
                );
            }
        } else {
            return null;
        }
    }

    async Info(
        force_download: boolean = false,
    ):
        Promise<Info.Instance | null>
    {
        if (force_download) {
            this.info = null;
        }

        if (this.info != null) {
            return this.info;
        } else {
            const text: string | null =
                await this.String(Consts.INFO_PATH);

            if (text != null) {
                this.info = new Info.Instance(
                    {
                        json: Compressor.LZSS_Decompress(text),
                    },
                );
            }

            return this.info;
        }
    }

    private Has_Version_Cache(
        version_id: Version_ID,
    ):
        boolean
    {
        return this.version_caches[version_id] != null;
    }

    private Version_Cache(
        version_id: Version_ID,
    ):
        Version_Cache
    {
        Utils.Assert(
            this.Has_Version_Cache(version_id),
            `does not have version cache`,
        );

        return this.version_caches[version_id] as Version_Cache;
    }

    private Add_Version_Cache(
        version_cache: Version_Cache,
    ):
        void
    {
        Utils.Assert(
            !this.Has_Version_Cache(version_cache.ID()),
            `already has version cache`,
        );

        if (this.version_buffer.Is_Full()) {
            this.Remove_Version_Cache_By_Index(0);
        }

        const version_id: Version_ID = version_cache.ID();

        this.version_buffer.Add_Back(version_id);
        this.version_caches[version_id] = version_cache;
    }

    private Remove_Version_Cache_By_Index(
        version_index: Index,
    ):
        void
    {
        Utils.Assert(
            version_index >= 0 &&
            version_index < this.version_buffer.Count(),
            `does not have version cache at version index`,
        );

        const version_id: Version_ID =
            this.version_buffer.At(version_index);
        const version_cache: Version_Cache =
            this.Version_Cache(version_id);

        if (version_cache.Reference_Count() > 0) {
            for (
                let file_index = this.file_buffer.Count(), file_end = 0;
                file_index > file_end;
            ) {
                file_index -= 1;

                const file_id: File_ID =
                    this.file_buffer.At(file_index);
                const file_cache: File_Cache =
                    this.File_Cache(file_id);

                if (file_cache.Version_ID() === version_id) {
                    this.Remove_File_Cache_By_Index(file_index);
                }
            }

            Utils.Assert(
                version_cache.Reference_Count() === 0,
                `version cache reference count does not equal 0 but ${version_cache.Reference_Count()}\n` +
                JSON.stringify(this.file_buffer, null, 4),
            );
            Utils.Assert(
                !this.Has_Version_Cache(version_id),
                `version cache was not deleted by Remove_File_Cache`,
            );
        } else {
            delete this.version_caches[version_id];
            this.version_buffer.Remove_At(version_index);
        }
    }

    private Remove_Version_Cache_By_ID(
        version_id: Version_ID,
    ):
        void
    {
        Utils.Assert(
            this.Has_Version_Cache(version_id),
            `does not have version cache`,
        );

        const version_index: Index | null =
            this.version_buffer.Index_Of(version_id);

        Utils.Assert(
            version_index != null,
            `version_index is null`,
        );

        this.Remove_Version_Cache_By_Index(version_index as Index);
    }

    private Remove_Version_Cache(
        version_cache: Version_Cache,
    ):
        void
    {
        this.Remove_Version_Cache_By_ID(version_cache.ID());
    }

    private Has_File_Cache(
        file_id: File_ID,
    ):
        boolean
    {
        return this.file_caches[file_id] != null;
    }

    private File_Cache(
        file_id: File_ID,
    ):
        File_Cache
    {
        Utils.Assert(
            this.Has_File_Cache(file_id),
            `does not have file cache`,
        );

        return this.file_caches[file_id] as File_Cache;
    }

    private Add_File_Cache(
        file_cache: File_Cache,
    ):
        void
    {
        Utils.Assert(
            !this.Has_File_Cache(file_cache.ID()),
            `already has file cache`,
        );
        Utils.Assert(
            this.Has_Version_Cache(file_cache.Version_ID()),
            `doesn't have version cache for file cache`,
        );

        if (this.file_buffer.Is_Full()) {
            this.Remove_File_Cache_By_Index(0);
        }

        const file_id: File_ID = file_cache.ID();

        this.file_buffer.Add_Back(file_id);
        this.file_caches[file_id] = file_cache;

        this.Version_Cache(file_cache.Version_ID()).Increment_Reference_Count();
    }

    private Remove_File_Cache_By_Index(
        file_index: Index,
    ):
        void
    {
        Utils.Assert(
            file_index >= 0 &&
            file_index < this.file_buffer.Count(),
            `does not have file cache at file index`,
        );

        const file_id: File_ID =
            this.file_buffer.At(file_index);
        const file_cache: File_Cache =
            this.File_Cache(file_id);
        const version_cache: Version_Cache =
            this.Version_Cache(file_cache.Version_ID());

        delete this.file_caches[file_id];
        this.file_buffer.Remove_At(file_index);

        version_cache.Decrement_Reference_Count();
        if (version_cache.Reference_Count() < 1) {
            this.Remove_Version_Cache(version_cache);
        }
    }

    private Remove_File_Cache_By_ID(
        file_id: File_ID,
    ):
        void
    {
        Utils.Assert(
            this.Has_File_Cache(file_id),
            `does not have file cache`,
        );

        const file_index: Index | null =
            this.file_buffer.Index_Of(file_id);

        Utils.Assert(
            file_index != null,
            `file_index is null`,
        );

        this.Remove_File_Cache_By_Index(file_index as Index);
    }

    private Remove_File_Cache(
        file_cache: File_Cache,
    ):
        void
    {
        this.Remove_File_Cache_By_ID(file_cache.ID());
    }

    /*
        It's important to keep in mind that other async
        contexts can actually alter the underlying buffers
        and caches. So we have to do a lot of extra checking
        after each fetch request to make sure that we don't
        destroy our model and therefore keep its integrity.
    */
    private async Version_And_File_Cache(
        version_path: Path,
        file_path: Path,
    ):
        Promise<[Version_Cache, File_Cache] | null>
    {
        // the version cache is guaranteed to be there if
        // any of its file caches are present.
        if (!this.Has_File_Cache(file_path)) {
            if (this.Has_Version_Cache(version_path)) {
                const compressed_file_text: string | null =
                    await this.String(file_path);

                if (this.Has_Version_Cache(version_path)) {
                    if (!this.Has_File_Cache(file_path)) {
                        if (compressed_file_text != null) {
                            this.Add_File_Cache(
                                new File_Cache(
                                    {
                                        id: file_path,
                                        version_id: version_path,
                                        compressed_file_text: compressed_file_text,
                                    },
                                ),
                            );
                        } else {
                            return null;
                        }
                    }
                } else if (compressed_file_text != null) {
                    const [
                        compressed_unique_parts_json,
                        compressed_dictionary_json,
                    ]: Array<string | null> = await Promise.all(
                        [
                            this.String(`${version_path}/${Consts.UNIQUE_PARTS_NAME}`),
                            this.String(`${version_path}/${Consts.DICTIONARY_NAME}`),
                        ],
                    );

                    if (this.Has_Version_Cache(version_path)) {
                        if (!this.Has_File_Cache(file_path)) {
                            this.Add_File_Cache(
                                new File_Cache(
                                    {
                                        id: file_path,
                                        version_id: version_path,
                                        compressed_file_text: compressed_file_text,
                                    },
                                ),
                            );
                        }
                    } else {
                        if (
                            compressed_unique_parts_json != null &&
                            compressed_dictionary_json != null
                        ) {
                            this.Add_Version_Cache(
                                new Version_Cache(
                                    {
                                        id: version_path,
                                        compressed_unique_parts_json: compressed_unique_parts_json,
                                        compressed_dictionary_json: compressed_dictionary_json,
                                    },
                                ),
                            );
                            Utils.Assert(
                                !this.Has_File_Cache(file_path),
                                `should not have file cache at this point!`,
                            );
                            this.Add_File_Cache(
                                new File_Cache(
                                    {
                                        id: file_path,
                                        version_id: version_path,
                                        compressed_file_text: compressed_file_text,
                                    },
                                ),
                            );
                        } else {
                            return null;
                        }
                    }
                } else {
                    return null;
                }
            } else {
                const [
                    compressed_unique_parts_json,
                    compressed_dictionary_json,
                    compressed_file_text,
                ]: Array<string | null> = await Promise.all(
                    [
                        this.String(`${version_path}/${Consts.UNIQUE_PARTS_NAME}`),
                        this.String(`${version_path}/${Consts.DICTIONARY_NAME}`),
                        this.String(file_path),
                    ],
                );

                if (this.Has_Version_Cache(version_path)) {
                    if (!this.Has_File_Cache(file_path)) {
                        if (compressed_file_text != null) {
                            this.Add_File_Cache(
                                new File_Cache(
                                    {
                                        id: file_path,
                                        version_id: version_path,
                                        compressed_file_text: compressed_file_text,
                                    },
                                ),
                            );
                        } else {
                            return null;
                        }
                    }
                } else {
                    if (
                        compressed_unique_parts_json != null &&
                        compressed_dictionary_json != null &&
                        compressed_file_text != null
                    ) {
                        this.Add_Version_Cache(
                            new Version_Cache(
                                {
                                    id: version_path,
                                    compressed_unique_parts_json: compressed_unique_parts_json,
                                    compressed_dictionary_json: compressed_dictionary_json,
                                },
                            ),
                        );
                        Utils.Assert(
                            !this.Has_File_Cache(file_path),
                            `should not have file cache at this point!`,
                        );
                        this.Add_File_Cache(
                            new File_Cache(
                                {
                                    id: file_path,
                                    version_id: version_path,
                                    compressed_file_text: compressed_file_text,
                                },
                            ),
                        );
                    } else {
                        return null;
                    }
                }
            }
        }

        return [
            this.Version_Cache(version_path),
            this.File_Cache(file_path),
        ];
    }

    private Add_Missing_File_Caches(
        version_id: Version_ID,
        file_ids_and_compressed_texts: Array<[File_ID, string | null]>,
    ):
        void
    {
        Utils.Assert(
            this.Has_Version_Cache(version_id),
            `does not have version cache`,
        );

        for (
            let file_index = 0, file_end = file_ids_and_compressed_texts.length;
            file_index < file_end;
            file_index += 1
        ) {
            const [
                file_id,
                compressed_file_text,
            ]: [File_ID, string | null] =
                file_ids_and_compressed_texts[file_index];

            if (
                !this.Has_File_Cache(file_id) &&
                compressed_file_text != null
            ) {
                this.Add_File_Cache(
                    new File_Cache(
                        {
                            id: file_id,
                            version_id: version_id,
                            compressed_file_text: compressed_file_text,
                        },
                    ),
                );
            }
        }
    }

    private Add_Missing_File_Caches_With_Version_Text(
        version_path: Path,
        file_names: Array<Name>,
        compressed_version_text: string,
    ):
        void
    {
        const compressed_file_texts: Array<string> =
            compressed_version_text.split(Consts.VERSION_TEXT_FILE_BREAK);

        Utils.Assert(
            file_names.length === compressed_file_texts.length,
            `there should be the same number of file names as file texts\n` +
            `file_names.length: ${file_names.length}\n` +
            `compressed_file_texts.length: ${compressed_file_texts.length}\n`,
        );

        this.Add_Missing_File_Caches(
            version_path,
            compressed_file_texts.map(
                function (
                    compressed_file_text: string,
                    file_index: Index,
                ):
                    [File_ID, string]
                {
                    return [
                        `${version_path}/${file_names[file_index]}`,
                        compressed_file_text,
                    ];
                },
            ),
        );
    }

    private async Add_Full_Version_Cache_With_Version_Test(
        version_path: Path,
        file_names: Array<Name>,
    ):
        Promise<void>
    {
        const [
            compressed_unique_parts_json,
            compressed_dictionary_json,
            compressed_version_text,
        ]: Array<string | null> = await Promise.all(
            [
                this.String(`${version_path}/${Consts.UNIQUE_PARTS_NAME}`),
                this.String(`${version_path}/${Consts.DICTIONARY_NAME}`),
                this.String(`${version_path}/${Consts.VERSION_TEXT_NAME}`),
            ],
        );

        if (this.Has_Version_Cache(version_path)) {
            if (compressed_version_text != null) {
                this.Add_Missing_File_Caches_With_Version_Text(
                    version_path,
                    file_names,
                    compressed_version_text,
                );
            }
        } else {
            if (
                compressed_unique_parts_json != null &&
                compressed_dictionary_json != null &&
                compressed_version_text != null
            ) {
                this.Add_Version_Cache(
                    new Version_Cache(
                        {
                            id: version_path,
                            compressed_unique_parts_json: compressed_unique_parts_json,
                            compressed_dictionary_json: compressed_dictionary_json,
                        },
                    ),
                );
                this.Add_Missing_File_Caches_With_Version_Text(
                    version_path,
                    file_names,
                    compressed_version_text,
                );
            }
        }
    }

    async Cache_Version_And_Files(
        version_path: Path,
        file_names: Array<Name>,
        {
            attempt_count = 0,
            attempt_limit = Consts.DEFAULT_VERSION_CACHE_ATTEMPT_LIMIT,
        }: {
            attempt_count?: Count,
            attempt_limit?: Count,
        } = {},
    ):
        Promise<void>
    {
        const version_id: Version_ID =
            version_path;

        if (this.Has_Version_Cache(version_id)) {
            const version_cache: Version_Cache =
                this.Version_Cache(version_id);
            const version_reference_count: Count =
                version_cache.Reference_Count();

            Utils.Assert(
                file_names.length >= version_reference_count,
                `file names should have every possible file name in version`,
            );

            const missing_file_cache_count: Count =
                file_names.length - version_reference_count;

            if (missing_file_cache_count > 0) {
                if (missing_file_cache_count <= Consts.VERSION_FILE_FETCH_LIMIT) {
                    const file_ids_and_compressed_texts: Array<[File_ID, string | null]> =
                        await Promise.all(
                            file_names.filter(
                                function (
                                    this: Instance,
                                    file_name: Name,
                                ):
                                    boolean
                                {
                                    const file_id: File_ID =
                                        `${version_path}/${file_name}`;

                                    return !this.Has_File_Cache(file_id);
                                }.bind(this),
                            ).map(
                                async function (
                                    this: Instance,
                                    file_name: Name,
                                ):
                                    Promise<[File_ID, string | null]>
                                {
                                    const file_path: Path =
                                        `${version_path}/${file_name}`;

                                    return [
                                        file_path,
                                        await this.String(file_path),
                                    ];
                                }.bind(this),
                            ),
                        );

                    if (this.Has_Version_Cache(version_id)) {
                        this.Add_Missing_File_Caches(
                            version_id,
                            file_ids_and_compressed_texts,
                        );
                    } else {
                        await this.Add_Full_Version_Cache_With_Version_Test(
                            version_path,
                            file_names,
                        );
                    }
                } else {
                    const compressed_version_text: string | null =
                        await this.String(`${version_path}/${Consts.VERSION_TEXT_NAME}`);

                    if (compressed_version_text != null) {
                        if (this.Has_Version_Cache(version_id)) {
                            this.Add_Missing_File_Caches_With_Version_Text(
                                version_path,
                                file_names,
                                compressed_version_text,
                            );
                        } else {
                            const [
                                compressed_unique_parts_json,
                                compressed_dictionary_json,
                            ]: Array<string | null> = await Promise.all(
                                [
                                    this.String(`${version_path}/${Consts.UNIQUE_PARTS_NAME}`),
                                    this.String(`${version_path}/${Consts.DICTIONARY_NAME}`),
                                ],
                            );

                            if (this.Has_Version_Cache(version_id)) {
                                this.Add_Missing_File_Caches_With_Version_Text(
                                    version_path,
                                    file_names,
                                    compressed_version_text,
                                );
                            } else {
                                if (
                                    compressed_unique_parts_json != null &&
                                    compressed_dictionary_json != null
                                ) {
                                    this.Add_Version_Cache(
                                        new Version_Cache(
                                            {
                                                id: version_path,
                                                compressed_unique_parts_json: compressed_unique_parts_json,
                                                compressed_dictionary_json: compressed_dictionary_json,
                                            },
                                        ),
                                    );
                                    this.Add_Missing_File_Caches_With_Version_Text(
                                        version_path,
                                        file_names,
                                        compressed_version_text,
                                    );
                                }
                            }
                        }
                    }
                }
            }
        } else {
            await this.Add_Full_Version_Cache_With_Version_Test(
                version_path,
                file_names,
            );
        }

        if (
            !this.Has_Version_Cache(version_id) ||
            this.Version_Cache(version_id).Reference_Count() < file_names.length
        ) {
            if (attempt_count < attempt_limit) {
                return this.Cache_Version_And_Files(
                    version_path,
                    file_names,
                    {
                        attempt_count: attempt_count + 1,
                        attempt_limit: attempt_limit,
                    },
                );
            }
        }
    }

    async File_Text(
        version_path: Path,
        file_name: Name,
        path_type?: Text.Path.Type,
    ):
        Promise<Text.Instance | null>
    {
        const version_and_file_cache = await this.Version_And_File_Cache(
            version_path,
            `${version_path}/${file_name}`,
        );

        if (version_and_file_cache != null) {
            const [
                version_cache,
                file_cache,
            ]: [Version_Cache, File_Cache] =
                version_and_file_cache;

            return new Text.Instance(
                {
                    dictionary: version_cache.Dictionary(),
                    value: version_cache.Compressor().Decompress_File(
                        {
                            dictionary: version_cache.Dictionary(),
                            file_value: file_cache.Compressed_File_Text(),
                        },
                    ),
                    path_type: path_type,
                },
            );
        } else {
            return null;
        }
    }
}
