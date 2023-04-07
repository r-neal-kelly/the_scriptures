import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Async from "../../async.js";

import { Type } from "./type.js";
import * as Query from "./query.js";
import * as Books from "./books.js";
import * as Book from "./book.js";
import * as Language from "./language.js";
import * as Version from "./version.js";
import * as Files from "./files.js";
import * as File from "./file.js";
import * as Search from "./search.js";
import * as Selection from "./selection.js"

export type Info = {
}

export class Instance extends Async.Instance
{
    private name: Name;
    private path: Path;
    private books: Books.Instance;

    private book_names: Array<Name> | null;
    private language_names: Array<Name> | null;
    private version_names: Array<Name> | null;

    constructor()
    {
        super();

        this.name = `Data`;
        this.path = this.name;
        this.books = new Books.Instance(
            {
                data: this,
            },
        );

        this.book_names = null;
        this.language_names = null;
        this.version_names = null;
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

    Books():
        Books.Instance
    {
        return this.books;
    }

    // we should probably have this info cached in a downloaded info file
    // and for the more specific ones, in each of their directories.
    // for right now we're doing it here till we get it working.
    private async Cache_Names():
        Promise<void>
    {
        if (
            this.book_names == null ||
            this.language_names == null ||
            this.version_names == null
        ) {
            const book_names: Set<Name> = new Set();
            const language_names: Set<Name> = new Set();
            const version_names: Set<Name> = new Set();

            for (const book of await this.Books().Array()) {
                book_names.add(book.Name());
                for (const language of await book.Languages().Array()) {
                    language_names.add(language.Name());
                    for (const version of await language.Versions().Array()) {
                        version_names.add(version.Name());
                    }
                }
            }

            this.book_names = Array.from(book_names).sort();
            this.language_names = Array.from(language_names).sort();
            this.version_names = Array.from(version_names).sort();
        }
    }

    async Names(
        of: Array<Query.Type_And_Name>,
    ):
        Promise<Array<Name>>
    {
        if (of.length === 1) {
            Utils.Assert(
                of[0].Name() == null,
                `Unusable name.`,
            );

            if (
                of[0].Type() === Type.BOOKS ||
                of[0].Type() === Type.BOOK
            ) {
                return await this.Book_Names();
            } else if (
                of[0].Type() === Type.LANGUAGES ||
                of[0].Type() === Type.LANGUAGE
            ) {
                return await this.Language_Names();
            } else if (
                of[0].Type() === Type.VERSIONS ||
                of[0].Type() === Type.VERSION
            ) {
                return await this.Version_Names();
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.`,
                );

                return [];
            }
        } else if (of.length === 2) {
            Utils.Assert(
                of[0].Name() != null,
                `Missing name.`,
            );
            Utils.Assert(
                of[1].Name() == null,
                `Unusable name.`,
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
                return await this.Book_Language_Names(
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
                return await this.Book_Version_Names(
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
                return await this.Language_Book_Names(
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
                return await this.Language_Version_Names(
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
                return await this.Version_Book_Names(
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
                return await this.Version_Language_Names(
                    {
                        version_name: of[0].Name() as Name,
                    },
                );
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.`,
                );

                return [];
            }
        } else if (of.length === 3) {
            Utils.Assert(
                of[0].Name() != null &&
                of[1].Name() != null,
                `Missing name.`,
            );
            Utils.Assert(
                of[2].Name() == null,
                `Unusable name.`,
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
                return await this.Book_Language_Version_Names(
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
                return await this.Book_Version_Language_Names(
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
                return await this.Language_Book_Version_Names(
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
                return await this.Language_Version_Book_Names(
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
                return await this.Version_Book_Language_Names(
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
                return await this.Version_Language_Book_Names(
                    {
                        version_name: of[0].Name() as Name,
                        language_name: of[1].Name() as Name,
                    },
                );
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.`,
                );

                return [];
            }
        } else if (of.length === 4) {
            Utils.Assert(
                of[0].Name() != null &&
                of[1].Name() != null &&
                of[2].Name() != null,
                `Missing name.`,
            );
            Utils.Assert(
                of[3].Name() == null,
                `Unusable name.`,
            );
            Utils.Assert(
                of[3].Type() === Type.FILES ||
                of[3].Type() === Type.FILE,
                `Invalid type.`,
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
                return await this.File_Names(
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
                return await this.File_Names(
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
                return await this.File_Names(
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
                return await this.File_Names(
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
                return await this.File_Names(
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
                return await this.File_Names(
                    {
                        book_name: of[2].Name() as Name,
                        language_name: of[1].Name() as Name,
                        version_name: of[0].Name() as Name,
                    },
                );
            } else {
                Utils.Assert(
                    false,
                    `Invalid type.`,
                );

                return [];
            }
        } else {
            Utils.Assert(
                false,
                `Invalid query length.`,
            );

            return [];
        }
    }

    // we should have an option on how the names are sorted
    async Book_Names():
        Promise<Array<Name>>
    {
        if (this.book_names == null) {
            await this.Cache_Names();
        }

        return Array.from(this.book_names as Array<Name>);
    }

    async Book_Language_Names(
        {
            book_name,
        }: {
            book_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const language_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            if (book.Name() === book_name) {
                for (const language of await book.Languages().Array()) {
                    language_names.add(language.Name());
                }
                break;
            }
        }

        return Array.from(language_names).sort();
    }

    async Book_Version_Names(
        {
            book_name,
        }: {
            book_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const version_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            if (book.Name() === book_name) {
                for (const language of await book.Languages().Array()) {
                    for (const version of await language.Versions().Array()) {
                        version_names.add(version.Name());
                    }
                }
                break;
            }
        }

        return Array.from(version_names).sort();
    }

    async Book_Language_Version_Names(
        {
            book_name,
            language_name,
        }: {
            book_name: Name,
            language_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const version_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            if (book.Name() === book_name) {
                for (const language of await book.Languages().Array()) {
                    if (language.Name() === language_name) {
                        for (const version of await language.Versions().Array()) {
                            version_names.add(version.Name());
                        }
                        break;
                    }
                }
                break;
            }
        }

        return Array.from(version_names).sort();
    }

    async Book_Version_Language_Names(
        {
            book_name,
            version_name,
        }: {
            book_name: Name,
            version_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const language_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            if (book.Name() === book_name) {
                for (const language of await book.Languages().Array()) {
                    for (const version of await language.Versions().Array()) {
                        if (version.Name() === version_name) {
                            language_names.add(language.Name());
                            break;
                        }
                    }
                }
                break;
            }
        }

        return Array.from(language_names).sort();
    }

    async Language_Names():
        Promise<Array<Name>>
    {
        if (this.language_names == null) {
            await this.Cache_Names();
        }

        return Array.from(this.language_names as Array<Name>);
    }

    async Language_Book_Names(
        {
            language_name,
        }: {
            language_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const book_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            for (const language of await book.Languages().Array()) {
                if (language.Name() === language_name) {
                    book_names.add(book.Name());
                    break;
                }
            }
        }

        return Array.from(book_names).sort();
    }

    async Language_Version_Names(
        {
            language_name,
        }: {
            language_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const version_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            for (const language of await book.Languages().Array()) {
                if (language.Name() === language_name) {
                    for (const version of await language.Versions().Array()) {
                        version_names.add(version.Name());
                    }
                    break;
                }
            }
        }

        return Array.from(version_names).sort();
    }

    async Language_Book_Version_Names(
        {
            language_name,
            book_name,
        }: {
            language_name: Name,
            book_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const version_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            if (book.Name() === book_name) {
                for (const language of await book.Languages().Array()) {
                    if (language.Name() === language_name) {
                        for (const version of await language.Versions().Array()) {
                            version_names.add(version.Name());
                        }
                        break;
                    }
                }
                break;
            }
        }

        return Array.from(version_names).sort();
    }

    async Language_Version_Book_Names(
        {
            language_name,
            version_name,
        }: {
            language_name: Name,
            version_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const book_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            for (const language of await book.Languages().Array()) {
                if (language.Name() === language_name) {
                    for (const version of await language.Versions().Array()) {
                        if (version.Name() === version_name) {
                            book_names.add(book.Name());
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return Array.from(book_names).sort();
    }

    async Version_Names():
        Promise<Array<Name>>
    {
        if (this.version_names == null) {
            await this.Cache_Names();
        }

        return Array.from(this.version_names as Array<Name>);
    }

    async Version_Book_Names(
        {
            version_name,
        }: {
            version_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const book_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            for (const language of await book.Languages().Array()) {
                for (const version of await language.Versions().Array()) {
                    if (version.Name() === version_name) {
                        book_names.add(book.Name());
                        break;
                    }
                }
            }
        }

        return Array.from(book_names).sort();
    }

    async Version_Language_Names(
        {
            version_name,
        }: {
            version_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const language_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            for (const language of await book.Languages().Array()) {
                for (const version of await language.Versions().Array()) {
                    if (version.Name() === version_name) {
                        language_names.add(language.Name());
                        break;
                    }
                }
            }
        }

        return Array.from(language_names).sort();
    }

    async Version_Book_Language_Names(
        {
            version_name,
            book_name,
        }: {
            version_name: Name,
            book_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const language_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            if (book.Name() === book_name) {
                for (const language of await book.Languages().Array()) {
                    for (const version of await language.Versions().Array()) {
                        if (version.Name() === version_name) {
                            language_names.add(language.Name());
                            break;
                        }
                    }
                }
                break;
            }
        }

        return Array.from(language_names).sort();
    }

    async Version_Language_Book_Names(
        {
            version_name,
            language_name,
        }: {
            version_name: Name,
            language_name: Name,
        },
    ):
        Promise<Array<Name>>
    {
        const book_names: Set<Name> = new Set();

        for (const book of await this.Books().Array()) {
            for (const language of await book.Languages().Array()) {
                if (language.Name() === language_name) {
                    for (const version of await language.Versions().Array()) {
                        if (version.Name() === version_name) {
                            book_names.add(book.Name());
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return Array.from(book_names).sort();
    }

    async Version(
        selection: Selection.Version.Name,
    ):
        Promise<Version.Instance>
    {
        const book: Book.Instance = await this.Books().Get(selection.Book());
        const language: Language.Instance = await book.Languages().Get(selection.Language());

        return await language.Versions().Get(selection.Version());
    }

    async Search(
        selection: Selection.Version.Name,
    ):
        Promise<Search.Instance>
    {
        return (await this.Version(selection)).Search();
    }

    async Files(
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
        Promise<Files.Instance>
    {
        const book: Book.Instance = await this.Books().Get(book_name);
        const language: Language.Instance = await book.Languages().Get(language_name);
        const version: Version.Instance = await language.Versions().Get(version_name);

        return version.Files();
    }

    async File(
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
        Promise<File.Instance>
    {
        const book: Book.Instance = await this.Books().Get(book_name);
        const language: Language.Instance = await book.Languages().Get(language_name);
        const version: Version.Instance = await language.Versions().Get(version_name);
        const file: File.Instance = await version.Files().Get(file_name);

        return file;
    }

    async File_Names(
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
        Promise<Array<Name>>
    {
        const files: Files.Instance = await this.Files(
            {
                book_name,
                language_name,
                version_name,
            },
        );

        return (await files.Array()).map(
            function (
                file: File.Instance,
            ):
                Name
            {
                return file.Name();
            },
        );
    }
}

const singleton = new Instance();

export function Singleton():
    Instance
{
    return singleton;
}
