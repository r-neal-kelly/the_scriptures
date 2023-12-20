var __awaiter=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))((function(s,i){function a(t){try{r(o.next(t))}catch(t){i(t)}}function _(t){try{r(o.throw(t))}catch(t){i(t)}}function r(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,_)}r((o=o.apply(t,e||[])).next())}))};import*as Compressor from"../compressor.js";import*as Data from"../model/data.js";import*as File_System from"./file_system.js";const INFO_PATH=Data.Consts.INFO_PATH,DATA_CONSTS_PATH="./js/model/data/consts.js";function Update_Data_Consts(){return __awaiter(this,void 0,void 0,(function*(){const t=new Data.Info.Instance({json:Compressor.LZSS_Decompress(yield File_System.Read_File(INFO_PATH))});let e=yield File_System.Read_File(DATA_CONSTS_PATH);e=e.replace(/DEFAULT_FILE_CACHE_LIMIT(\s*)=(\s*)[^;]+/,"DEFAULT_FILE_CACHE_LIMIT$1=$2"+2*t.Max_File_Count()),yield File_System.Write_File(DATA_CONSTS_PATH,e)}))}!function(){__awaiter(this,void 0,void 0,(function*(){yield Update_Data_Consts()}))}();