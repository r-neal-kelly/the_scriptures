import { Path } from "../types.js";

import * as Compressor from "../compressor.js";

import * as Data from "../model/data.js";

import * as File_System from "./file_system.js";

const INFO_PATH: Path = Data.Consts.INFO_PATH;
const DATA_CONSTS_PATH: Path = `./js/model/data/consts.js`;

async function Update_Data_Consts():
    Promise<void>
{
    const info: Data.Info.Instance = new Data.Info.Instance(
        {
            json: Compressor.LZSS_Decompress(
                await File_System.Read_File(INFO_PATH),
            ),
        },
    );

    let info_consts_source: string =
        await File_System.Read_File(DATA_CONSTS_PATH);

    info_consts_source = info_consts_source.replace(
        /DEFAULT_FILE_CACHE_LIMIT(\s*)=(\s*)[^;]+/,
        `DEFAULT_FILE_CACHE_LIMIT$1=$2${info.Max_File_Count()}`,
    );

    await File_System.Write_File(
        DATA_CONSTS_PATH,
        info_consts_source,
    );
}

(
    async function Main():
        Promise<void>
    {
        await Update_Data_Consts();
    }
)();
