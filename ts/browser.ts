import * as Utils from "./utils.js"
import * as Entity from "./entity.js"

type File_Name = string;

type Book_Info = {
    file_names: Array<File_Name>,
}

class Browser extends Entity.Instance
{
    private book_info: Book_Info | null;

    constructor()
    {
        super(`div`);

        this.book_info = null;
    }

    override async On_Life():
        Promise<void>
    {
        const info_response: Response =
            await fetch(Utils.Resolve_Path(`txt/Jubilees/English/R. H. Charles/Info.json`));
        if (info_response.ok) {
            this.book_info = JSON.parse(await info_response.text());
        }
    }

    override async On_Refresh():
        Promise<void>
    {
        if (this.book_info) {
            await this.Kill_All_Children();

            for (const file_name of this.book_info.file_names) {
                const file_response: Response =
                    await fetch(Utils.Resolve_Path(`txt/Jubilees/English/R. H. Charles/${file_name}`));
                if (file_response.ok) {
                    const file_text: string = await file_response.text();
                    for (const file_line of file_text.split(/\r?\n/g)) {
                        this.Add_Child(new Line(file_line));
                    }
                    this.Add_Child(new Line(``));
                }
            }
        }
    }

    override async On_Restyle():
        Promise<Entity.Styles>
    {
        return ({
            "display": `grid`,

            "width": `100%`,
            "height": `100%`,

            "overflow-x": `hidden`,
            "overflow-y": `auto`, // temp

            "color": `white`,
        });
    }
}

// temp
class Line extends Entity.Instance
{
    private text: string;

    constructor(
        text: string,
    )
    {
        super(`div`);

        this.text = text;
    }

    override async On_Refresh():
        Promise<void>
    {
        if (this.text === ``) {
            this.Element().textContent = `_`;
        } else {
            this.Element().textContent = this.text;
        }
    }

    override async On_Restyle():
        Promise<Entity.Styles>
    {
        return ({
            "color": this.text === `` ?
                `transparent` :
                `inherit`,
        });
    }
}

class Body extends Entity.Instance
{
    constructor()
    {
        super(document.body as HTMLBodyElement);
    }

    override async On_Life():
        Promise<void>
    {
        Utils.Create_Style_Element(`
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            *:focus {
                outline: 0;
            }
            
            html, body {
                width: 100%;
                height: 100%;

                background-color: black;

                font-family: sans-serif;
            }

            span {
                display: inline-block;
            }

            .ITALIC {
                font-style: italic;
            }

            .BOLD {
                font-weight: bold;
            }

            .UNDERLINE {
                text-decoration: underline;
            }
            
            .SMALL_CAPS {
                font-variant: small-caps;
            }
        `);

        this.Add_Child(new Browser());
    }
}

const body: Body = new Body();
