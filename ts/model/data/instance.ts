import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Async from "../../async.js";

import { Type } from "./type.js";
import * as Query from "./query.js";
import * as Book from "./book.js";
import * as Version from "./version.js";
import * as File from "./file.js";
import * as Name_Sorter from "./name_sorter.js";

export type Tree = {
    books: Array<Book.Branch>,
};

export type Info = {
    tree: Tree;

    unique_book_names: Array<Name>,
    unique_language_names: Array<Name>,
    unique_version_names: Array<Name>,

    total_unit_count: Count,
    total_point_count: Count,
    total_letter_count: Count,
    total_marker_count: Count,
    total_meta_letter_count: Count,
    total_word_count: Count,
    total_break_count: Count,
    total_meta_word_count: Count,
    total_part_count: Count,
    total_line_count: Count,
    total_file_count: Count,
    total_book_count: Count,

    language_unit_counts: { [language_name: string]: Count };
    language_point_counts: { [language_name: string]: Count };
    language_letter_counts: { [language_name: string]: Count };
    language_marker_counts: { [language_name: string]: Count };
    language_meta_letter_counts: { [language_name: string]: Count };
    language_word_counts: { [language_name: string]: Count };
    language_break_counts: { [language_name: string]: Count };
    language_meta_word_counts: { [language_name: string]: Count };
    language_part_counts: { [language_name: string]: Count };
    language_line_counts: { [language_name: string]: Count };
    language_file_counts: { [language_name: string]: Count };
    language_book_counts: { [language_name: string]: Count };
};

export class Instance extends Async.Instance
{
    private name: Name;
    private path: Path;
    private books_path: Path;
    private info: Info | null;
    private books: Array<Book.Instance>;
    private name_sorter: Name_Sorter.Instance;

    constructor()
    {
        super();

        this.name = `data`;
        this.path = this.name;
        this.books_path = `${this.path}/Books`;
        this.info = null;
        this.books = [];
        this.name_sorter = new Name_Sorter.Instance();

        this.Add_Dependencies(
            [
            ],
        );
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

    Books_Path():
        Path
    {
        return this.books_path;
    }

    private Info():
        Info
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );
        Utils.Assert(
            this.info != null,
            `info is null!`,
        );

        return this.info as Info;
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

    Name_Sorter():
        Name_Sorter.Instance
    {
        return this.name_sorter;
    }

    Names(
        of: Array<Query.Type_And_Name>,
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
                return this.Language_Names();
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

        return Array.from(this.Info().unique_book_names);
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return Array.from(this.Info().unique_language_names);
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return Array.from(this.Info().unique_version_names);
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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

        return this.Name_Sorter().With_Set(
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
                return file.Name();
            },
        );
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        const response: Response =
            await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
        if (response.ok) {
            this.info = JSON.parse(await response.text()) as Info;

            for (const book_branch of this.info.tree.books) {
                this.books.push(
                    new Book.Instance(
                        {
                            data: this,
                            branch: book_branch,
                        },
                    ),
                );
            }
        } else {
            this.info = {
                tree: {
                    books: [],
                },

                unique_book_names: [],
                unique_language_names: [],
                unique_version_names: [],

                total_unit_count: 0,
                total_point_count: 0,
                total_letter_count: 0,
                total_marker_count: 0,
                total_meta_letter_count: 0,
                total_word_count: 0,
                total_break_count: 0,
                total_meta_word_count: 0,
                total_part_count: 0,
                total_line_count: 0,
                total_file_count: 0,
                total_book_count: 0,

                language_unit_counts: {},
                language_point_counts: {},
                language_letter_counts: {},
                language_marker_counts: {},
                language_meta_letter_counts: {},
                language_word_counts: {},
                language_break_counts: {},
                language_meta_word_counts: {},
                language_part_counts: {},
                language_line_counts: {},
                language_file_counts: {},
                language_book_counts: {},
            };
        }
    }
}

const SINGLETON = new Instance();
export function Singleton():
    Instance
{
    return SINGLETON;
}
