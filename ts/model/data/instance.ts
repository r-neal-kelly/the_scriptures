import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Name_Sorter from "../name_sorter.js";

import { Type } from "./type.js";
import * as Consts from "./consts.js";
import * as Info from "./info.js";
import * as Cache from "./cache.js";
import * as Query from "./query.js";
import * as Book from "./book.js";
import * as Version from "./version.js";
import * as File from "./file.js";

export class Instance extends Entity.Instance
{
    private cache: Cache.Instance;
    private info: Info.Instance | null;
    private default_info: Info.Instance;
    private books: Array<Book.Instance>;

    constructor()
    {
        super();

        this.cache = new Cache.Instance();
        this.info = null;
        this.default_info = new Info.Instance({});
        this.books = [];

        this.default_info.Finalize();

        this.Add_Dependencies(
            [
                this.cache,
            ],
        );
    }

    Cache():
        Cache.Instance
    {
        return this.cache;
    }

    Info():
        Info.Instance
    {
        if (this.info != null) {
            return this.info;
        } else {
            this.Update_Info();

            return this.default_info;
        }
    }

    private async Update_Info():
        Promise<void>
    {
        this.info = (await this.Cache().Info(true)) || this.info;
        this.books = [];

        if (this.info != null) {
            for (const book_branch of this.info.Tree().books) {
                this.books.push(
                    new Book.Instance(
                        {
                            data: this,
                            branch: book_branch,
                        },
                    ),
                );
            }
        }
    }

    Name():
        Name
    {
        return this.Path();
    }

    Path():
        Path
    {
        return Consts.PATH;
    }

    Books_Path():
        Path
    {
        return Consts.BOOKS_PATH;
    }

    Book(
        book_name: Name,
    ):
        Book.Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        for (const book of this.books) {
            if (book.Name() === book_name) {
                return book;
            }
        }

        Utils.Assert(
            false,
            `Invalid book_name.`,
        );

        return this.books[0];
    }

    Book_Count():
        Count
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.books.length;
    }

    Book_At(
        book_index: Index,
    ):
        Book.Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );
        Utils.Assert(
            book_index > -1,
            `book_index must be greater than -1.`,
        );
        Utils.Assert(
            book_index < this.Book_Count(),
            `book_index must be less than book_count.`,
        );

        return this.books[book_index];
    }

    Books():
        Array<Book.Instance>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return Array.from(this.books);
    }

    Names(
        {
            of,
            language_names_must_have_files,
        }: {
            of: Array<Query.Type_And_Name>,
            language_names_must_have_files: boolean,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        if (of.length === 1) {
            Utils.Assert(
                of[0].Name() == null,
                `Unusable name.
                A query length of 1 only requires a type.`,
            );

            if (
                of[0].Type() === Type.BOOKS ||
                of[0].Type() === Type.BOOK
            ) {
                return this.Book_Names();
            } else if (
                of[0].Type() === Type.LANGUAGES ||
                of[0].Type() === Type.LANGUAGE
            ) {
                if (language_names_must_have_files) {
                    return this.Language_Names_Having_Files();
                } else {
                    return this.Language_Names();
                }
            } else if (
                of[0].Type() === Type.VERSIONS ||
                of[0].Type() === Type.VERSION
            ) {
                return this.Version_Names();
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.
                    A query length of 1 can only gather Books, Languages, or Versions.`,
                );

                return [];
            }
        } else if (of.length === 2) {
            Utils.Assert(
                of[0].Name() != null,
                `Missing name.
                A query length of 2 requires a name at index 0.`,
            );
            Utils.Assert(
                of[1].Name() == null,
                `Unusable name.
                A query length of 2 only requires a type at index 1.`,
            );

            if (
                (
                    of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK
                ) &&
                (
                    of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE
                )
            ) {
                return this.Book_Language_Names(
                    {
                        book_name: of[0].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK
                ) &&
                (
                    of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION
                )
            ) {
                return this.Book_Version_Names(
                    {
                        book_name: of[0].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE
                ) &&
                (
                    of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK
                )
            ) {
                return this.Language_Book_Names(
                    {
                        language_name: of[0].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE
                ) &&
                (
                    of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION
                )
            ) {
                return this.Language_Version_Names(
                    {
                        language_name: of[0].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION
                ) &&
                (
                    of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK
                )
            ) {
                return this.Version_Book_Names(
                    {
                        version_name: of[0].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION
                ) &&
                (
                    of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE
                )
            ) {
                return this.Version_Language_Names(
                    {
                        version_name: of[0].Name() as Name,
                    },
                );
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.
                    A query length of 2 can only gather a combination of Books, Languages, or Versions.
                    Each index in the query must have a unique type, and cannot contain repeats.`,
                );

                return [];
            }
        } else if (of.length === 3) {
            Utils.Assert(
                of[0].Name() != null &&
                of[1].Name() != null,
                `Missing name.
                A query length of 3 requires a name for indices 0 and 1.`,
            );
            Utils.Assert(
                of[2].Name() == null,
                `Unusable name.
                A query length of 3 only requires a type at index 2.`,
            );

            if (
                (
                    of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK
                ) &&
                (
                    of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE
                ) &&
                (
                    of[2].Type() === Type.VERSIONS ||
                    of[2].Type() === Type.VERSION
                )
            ) {
                return this.Book_Language_Version_Names(
                    {
                        book_name: of[0].Name() as Name,
                        language_name: of[1].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK
                ) &&
                (
                    of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION
                ) &&
                (
                    of[2].Type() === Type.LANGUAGES ||
                    of[2].Type() === Type.LANGUAGE
                )
            ) {
                return this.Book_Version_Language_Names(
                    {
                        book_name: of[0].Name() as Name,
                        version_name: of[1].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE
                ) &&
                (
                    of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK
                ) &&
                (
                    of[2].Type() === Type.VERSIONS ||
                    of[2].Type() === Type.VERSION
                )
            ) {
                return this.Language_Book_Version_Names(
                    {
                        language_name: of[0].Name() as Name,
                        book_name: of[1].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE
                ) &&
                (
                    of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION
                ) &&
                (
                    of[2].Type() === Type.BOOKS ||
                    of[2].Type() === Type.BOOK
                )
            ) {
                return this.Language_Version_Book_Names(
                    {
                        language_name: of[0].Name() as Name,
                        version_name: of[1].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION
                ) &&
                (
                    of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK
                ) &&
                (
                    of[2].Type() === Type.LANGUAGES ||
                    of[2].Type() === Type.LANGUAGE
                )
            ) {
                return this.Version_Book_Language_Names(
                    {
                        version_name: of[0].Name() as Name,
                        book_name: of[1].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION
                ) &&
                (
                    of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE
                ) &&
                (
                    of[2].Type() === Type.BOOKS ||
                    of[2].Type() === Type.BOOK
                )
            ) {
                return this.Version_Language_Book_Names(
                    {
                        version_name: of[0].Name() as Name,
                        language_name: of[1].Name() as Name,
                    },
                );
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.
                    A query length of 3 can only gather a combination of Books, Languages, or Versions.
                    Each index in the query must have a unique type, and cannot contain repeats.`,
                );

                return [];
            }
        } else if (of.length === 4) {
            Utils.Assert(
                of[0].Name() != null &&
                of[1].Name() != null &&
                of[2].Name() != null,
                `Missing name.
                A query length of 4 must have a name for indices 0, 1, and 2.`,
            );
            Utils.Assert(
                of[3].Name() == null,
                `Unusable name.
                A query length of 4 only requires a type at index 3.`,
            );
            Utils.Assert(
                of[3].Type() === Type.FILES ||
                of[3].Type() === Type.FILE,
                `Invalid type.
                A query length of 4 requires index 3 to have a type indicated Files.`,
            );

            if (
                (
                    of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK
                ) &&
                (
                    of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE
                ) &&
                (
                    of[2].Type() === Type.VERSIONS ||
                    of[2].Type() === Type.VERSION
                )
            ) {
                return this.File_Names(
                    {
                        book_name: of[0].Name() as Name,
                        language_name: of[1].Name() as Name,
                        version_name: of[2].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK
                ) &&
                (
                    of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION
                ) &&
                (
                    of[2].Type() === Type.LANGUAGES ||
                    of[2].Type() === Type.LANGUAGE
                )
            ) {
                return this.File_Names(
                    {
                        book_name: of[0].Name() as Name,
                        language_name: of[2].Name() as Name,
                        version_name: of[1].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE
                ) &&
                (
                    of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK
                ) &&
                (
                    of[2].Type() === Type.VERSIONS ||
                    of[2].Type() === Type.VERSION
                )
            ) {
                return this.File_Names(
                    {
                        book_name: of[1].Name() as Name,
                        language_name: of[0].Name() as Name,
                        version_name: of[2].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE
                ) &&
                (
                    of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION
                ) &&
                (
                    of[2].Type() === Type.BOOKS ||
                    of[2].Type() === Type.BOOK
                )
            ) {
                return this.File_Names(
                    {
                        book_name: of[2].Name() as Name,
                        language_name: of[0].Name() as Name,
                        version_name: of[1].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION
                ) &&
                (
                    of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK
                ) &&
                (
                    of[2].Type() === Type.LANGUAGES ||
                    of[2].Type() === Type.LANGUAGE
                )
            ) {
                return this.File_Names(
                    {
                        book_name: of[1].Name() as Name,
                        language_name: of[2].Name() as Name,
                        version_name: of[0].Name() as Name,
                    },
                );
            } else if (
                (
                    of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION
                ) &&
                (
                    of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE
                ) &&
                (
                    of[2].Type() === Type.BOOKS ||
                    of[2].Type() === Type.BOOK
                )
            ) {
                return this.File_Names(
                    {
                        book_name: of[2].Name() as Name,
                        language_name: of[1].Name() as Name,
                        version_name: of[0].Name() as Name,
                    },
                );
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.
                    A query length of 4 must have a combination of Books, Languages, Versions, and Files.
                    Each index in the query must have a unique type, and cannot contain repeats.
                    The last index must indicate Files.`,
                );

                return [];
            }
        } else {
            Utils.Assert(
                false,
                `Invalid query length.
                A query must have a length from 1 to 4.`,
            );

            return [];
        }
    }

    Book_Names():
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.Info().Unique_Book_Names();
    }

    Book_Language_Names(
        {
            book_name,
        }: {
            book_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const language_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    language_names.add(language.Name());
                }
                break;
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.LANGUAGES,
            language_names,
        );
    }

    Book_Version_Names(
        {
            book_name,
        }: {
            book_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const version_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    for (const version of language.Versions()) {
                        version_names.add(version.Name());
                    }
                }
                break;
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.VERSIONS,
            version_names,
        );
    }

    Book_Language_Version_Names(
        {
            book_name,
            language_name,
        }: {
            book_name: Name,
            language_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const version_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    if (language.Name() === language_name) {
                        for (const version of language.Versions()) {
                            version_names.add(version.Name());
                        }
                        break;
                    }
                }
                break;
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.VERSIONS,
            version_names,
        );
    }

    Book_Version_Language_Names(
        {
            book_name,
            version_name,
        }: {
            book_name: Name,
            version_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const language_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    for (const version of language.Versions()) {
                        if (version.Name() === version_name) {
                            language_names.add(language.Name());
                            break;
                        }
                    }
                }
                break;
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.LANGUAGES,
            language_names,
        );
    }

    Language_Names():
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.Info().Unique_Language_Names();
    }

    Language_Names_Having_Files():
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.Info().Unique_Language_Names_Having_Files();
    }

    Language_Book_Names(
        {
            language_name,
        }: {
            language_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const book_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    book_names.add(book.Name());
                    break;
                }
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.BOOKS,
            book_names,
        );
    }

    Language_Version_Names(
        {
            language_name,
        }: {
            language_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const version_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    for (const version of language.Versions()) {
                        version_names.add(version.Name());
                    }
                    break;
                }
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.VERSIONS,
            version_names,
        );
    }

    Language_Book_Version_Names(
        {
            language_name,
            book_name,
        }: {
            language_name: Name,
            book_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const version_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    if (language.Name() === language_name) {
                        for (const version of language.Versions()) {
                            version_names.add(version.Name());
                        }
                        break;
                    }
                }
                break;
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.VERSIONS,
            version_names,
        );
    }

    Language_Version_Book_Names(
        {
            language_name,
            version_name,
        }: {
            language_name: Name,
            version_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const book_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    for (const version of language.Versions()) {
                        if (version.Name() === version_name) {
                            book_names.add(book.Name());
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.BOOKS,
            book_names,
        );
    }

    Version_Names():
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.Info().Unique_Version_Names();
    }

    Version_Book_Names(
        {
            version_name,
        }: {
            version_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const book_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                for (const version of language.Versions()) {
                    if (version.Name() === version_name) {
                        book_names.add(book.Name());
                        break;
                    }
                }
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.BOOKS,
            book_names,
        );
    }

    Version_Language_Names(
        {
            version_name,
        }: {
            version_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const language_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                for (const version of language.Versions()) {
                    if (version.Name() === version_name) {
                        language_names.add(language.Name());
                        break;
                    }
                }
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.LANGUAGES,
            language_names,
        );
    }

    Version_Book_Language_Names(
        {
            version_name,
            book_name,
        }: {
            version_name: Name,
            book_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const language_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    for (const version of language.Versions()) {
                        if (version.Name() === version_name) {
                            language_names.add(language.Name());
                            break;
                        }
                    }
                }
                break;
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.LANGUAGES,
            language_names,
        );
    }

    Version_Language_Book_Names(
        {
            version_name,
            language_name,
        }: {
            version_name: Name,
            language_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const book_names: Set<Name> = new Set();

        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    for (const version of language.Versions()) {
                        if (version.Name() === version_name) {
                            book_names.add(book.Name());
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return Name_Sorter.Singleton().With_Set(
            Name_Sorter.Type.BOOKS,
            book_names,
        );
    }

    Versions(
        {
            book_names = null,
            language_names = null,
            version_names = null,
        }: {
            book_names: Array<Name> | null,
            language_names: Array<Name> | null,
            version_names: Array<Name> | null,
        },
    ):
        Array<Version.Instance>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        const versions: Array<Version.Instance> = [];

        if (book_names == null) {
            book_names = this.Book_Names();
        }
        if (language_names == null) {
            language_names = this.Language_Names();
        }
        if (version_names == null) {
            version_names = this.Version_Names();
        }

        for (const book of this.Books()) {
            if (book_names.includes(book.Name())) {
                for (const language of book.Languages()) {
                    if (language_names.includes(language.Name())) {
                        for (const version of language.Versions()) {
                            if (version_names.includes(version.Name())) {
                                versions.push(version);
                            }
                        }
                    }
                }
            }
        }

        return versions;
    }

    Files(
        {
            book_name,
            language_name,
            version_name,
        }: {
            book_name: Name,
            language_name: Name,
            version_name: Name,
        },
    ):
        Array<File.Instance>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.Book(book_name)
            .Language(language_name)
            .Version(version_name)
            .Files();
    }

    File(
        {
            book_name,
            language_name,
            version_name,
            file_name,
        }: {
            book_name: Name,
            language_name: Name,
            version_name: Name,
            file_name: Name,
        },
    ):
        File.Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.Book(book_name)
            .Language(language_name)
            .Version(version_name)
            .File(file_name);
    }

    File_Names(
        {
            book_name,
            language_name,
            version_name,
        }: {
            book_name: Name,
            language_name: Name,
            version_name: Name,
        },
    ):
        Array<Name>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );

        return this.Files(
            {
                book_name,
                language_name,
                version_name,
            },
        ).map(
            function (
                file: File.Instance,
            ):
                Name
            {
                return file.Title();
            },
        );
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        await this.Update_Info();
    }
}

const SINGLETON = new Instance();
export function Singleton():
    Instance
{
    return SINGLETON;
}
