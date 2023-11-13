var __awaiter=this&&this.__awaiter||function(e,t,n,_){return new(n||(n=Promise))((function(i,o){function r(e){try{s(_.next(e))}catch(e){o(e)}}function a(e){try{s(_.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,a)}s((_=_.apply(e,t||[])).next())}))};import*as process from"process";import*as Utils from"../utils.js";import*as Unicode from"../unicode.js";import*as Language from"../model/language.js";import*as Data from"../model/data.js";import*as Text from"../model/text.js";import*as File_System from"./file_system.js";const TIMESTAMP_PATH="./.timestamp",README_PATH="./README.md",DATA_PATH="./data",INFO_JSON_NAME="Info.json",ORDER_JSON_NAME="Order.json",DICTIONARY_JSON_NAME="Dictionary.json",UNIQUE_PARTS_JSON_NAME="Unique_Parts.json",DEFAULT_LAST_TIMESTAMP=0,IS_COMPRESSED_FILE_REGEX=new RegExp(`\\.${Data.File.Symbol.EXTENSION}$`),LINE_PATH_TYPE=Text.Line.Path_Type.DEFAULT;class Unique_Parts{constructor(){this.parts={}}Add(e){this.parts.hasOwnProperty(e)?(Utils.Assert(this.parts[e]<Number.MAX_SAFE_INTEGER,"Cannot add more of this unique part!"),this.parts[e]+=1):this.parts[e]=1}Values(){return Object.keys(this.parts).sort(function(e,t){return this.parts[t]-this.parts[e]}.bind(this))}Count(e){return Utils.Assert(this.parts.hasOwnProperty(e),"Does not have part."),this.parts[e]}}function Read_And_Sort_File_Names(e){return __awaiter(this,void 0,void 0,(function*(){const t=(yield File_System.File_Names(e)).filter((function(e){return/\.txt$/.test(e)&&!/COPY\.txt$/.test(e)}));if(File_System.Has_File(`${e}/${ORDER_JSON_NAME}`)){const n=JSON.parse(yield File_System.Read_File(`${e}/${ORDER_JSON_NAME}`)),_=[];for(const e of t)n.includes(e)||_.push(e);return Utils.Assert(0===_.length,`${e}/${ORDER_JSON_NAME} is missing various files:\n${JSON.stringify(_)}`),n}return t.sort()}))}function Read_File_Text(e){return __awaiter(this,void 0,void 0,(function*(){const t=yield File_System.Read_And_Write_File_With_No_Carriage_Returns(e);return Utils.Assert(Language.Greek.Normalize_With_Combined_Points(Language.Greek.Normalize_With_Baked_Points(t))===t,`\n            Failed to reproduce original file_text after Greek normalization!\n            ${e}\n        `),t}))}function Should_Version_Be_Updated(e,t,n){return __awaiter(this,void 0,void 0,(function*(){for(const n of[`${t}/${INFO_JSON_NAME}`,`${t}/${DICTIONARY_JSON_NAME}`,`${t}/${UNIQUE_PARTS_JSON_NAME}`])if(!File_System.Has_File(n)||(yield File_System.Read_Entity_Last_Modified_Time(n))>e)return!0;if(File_System.Has_File(`${t}/${ORDER_JSON_NAME}`)&&(yield File_System.Read_Entity_Last_Modified_Time(`${t}/${ORDER_JSON_NAME}`))>e)return!0;for(const _ of n){const n=`${t}/${_}`;if((yield File_System.Read_Entity_Last_Modified_Time(n))>e)return!0}return!1}))}function Delete_Compiled_Files(e){return __awaiter(this,void 0,void 0,(function*(){const t=(yield File_System.File_Names(e)).filter((function(e){return IS_COMPRESSED_FILE_REGEX.test(e)}));yield Promise.all(t.map((t=>File_System.Delete_File(`${e}/${t}`))))}))}function Decompression_Line_Mismatches(e,t){const n=e.split(/\r?\n/),_=t.split(/\r?\n/);let i="";for(let e=0,t=n.length;e<t;e+=1)e<_.length?n[e]!==_[e]&&(i+=`${e}: ${n[e]} !== ${_[e]}\n`):i+=`${e}: <missing line>\n`;return""===i?"<no mismatching lines>":i}function Generate(e){return __awaiter(this,void 0,void 0,(function*(){const t=e?0:File_System.Has_File("./.timestamp")?yield File_System.Read_Entity_Last_Modified_Time("./.timestamp"):0,n=new Data.Info({});0===t?console.log("    Forcefully generating all files..."):console.log("    Only generating out-of-date files..."),yield function(){return __awaiter(this,void 0,void 0,(function*(){const e="./data/Books";for(const _ of(yield File_System.Folder_Names(e)).sort()){const i=`${e}/${_}`,o={name:_,languages:[]};n.Tree().books.push(o),n.Add_Unique_Book_Name(_);for(const e of(yield File_System.Folder_Names(i)).sort()){const r=`${i}/${e}`,a={name:e,versions:[]};o.languages.push(a),n.Add_Unique_Language_Name(e);for(const i of(yield File_System.Folder_Names(r)).sort()){const o=`${r}/${i}`,s=yield Read_And_Sort_File_Names(o),l={name:i,files:s.map(Utils.Remove_File_Extension)};if(a.versions.push(l),n.Add_Unique_Version_Name(i),yield Should_Version_Be_Updated(t,o,s)){const t=new Data.Version.Info({}),n=yield File_System.Read_File(`${o}/${DICTIONARY_JSON_NAME}`),r=new Text.Dictionary.Instance({json:n}),a=new Unique_Parts,l=[];t.Increment_File_Count(e,s.length),r.Validate(),yield Delete_Compiled_Files(o);for(const n of s){const s=`${o}/${n}`,u=yield Read_File_Text(s),c=new Text.Instance({dictionary:r,value:u});t.Increment_Line_Count(e,c.Line_Count()),l.push(u);for(let o=0,r=c.Line_Count();o<r;o+=1){const r=c.Line(o);for(let s=0,l=r.Macro_Part_Count(LINE_PATH_TYPE);s<l;s+=1){const l=r.Macro_Part(s,LINE_PATH_TYPE),u=l.Part_Type(),c=l.Value(),m=c.length,d=Unicode.Point_Count(c),g=l.Language()?l.Language():e;if(Utils.Assert(!l.Is_Unknown(),`Unknown part! Cannot generate:\n   Book Name:          ${_}\n   Language Name:      ${e}\n   Version Name:       ${i}\n   File Name:          ${n}\n   Line Index:         ${o}\n   Macro Part Index:   ${s}\n   Macro Part Value:   ${c}\n`),l.Is_Error()&&Utils.Assert(l.Has_Error_Style(),`Error not wrapped with error command! Should not generate:\n   Book Name:          ${_}\n   Language Name:      ${e}\n   Version Name:       ${i}\n   File Name:          ${n}\n   Line Index:         ${o}\n   Macro Part Index:   ${s}\n   Macro Part Value:   ${c}\n`),a.Add(c),t.Increment_Unit_Count(g,m),t.Increment_Point_Count(g,d),u===Text.Part.Type.LETTER)t.Increment_Letter_Count(g,1),t.Increment_Part_Count(g,1);else if(u===Text.Part.Type.MARKER)t.Increment_Marker_Count(g,1),t.Increment_Part_Count(g,1);else if(u===Text.Part.Type.WORD)t.Increment_Letter_Count(g,d),t.Increment_Word_Count(g,1),t.Increment_Part_Count(g,1);else if(u===Text.Part.Type.BREAK)t.Increment_Marker_Count(g,d),t.Increment_Break_Count(g,1),t.Increment_Part_Count(g,1);else if(u===Text.Part.Type.COMMAND){const e=l;t.Increment_Meta_Letter_Count(g,d),e.Is_Last_Of_Split()||(t.Increment_Meta_Word_Count(g,1),t.Increment_Part_Count(g,1))}}}}const u=[],c=l.join(Data.Version.Symbol.FILE_BREAK),m=a.Values(),d=new Data.Compressor.Instance({unique_parts:m}),g=d.Compress_Dictionary({dictionary_value:n}),$=d.Decompress_Dictionary({dictionary_value:g}),N=d.Compress_File({dictionary:r,file_value:c}),y=d.Decompress_File({dictionary:r,file_value:N});Utils.Assert($===n,"Invalid dictionary decompression!"),Utils.Assert(y===c,`Invalid decompression!\n   Book Name: ${_}\n   Language Name: ${e}\n   Version Name: ${i}\n${Decompression_Line_Mismatches(c,y)}`),u.push(File_System.Write_File(`${o}/${INFO_JSON_NAME}`,t.JSON_String())),u.push(File_System.Write_File(`${o}/${UNIQUE_PARTS_JSON_NAME}`,JSON.stringify(m))),u.push(File_System.Write_File(`${o}/${Data.Version.Dictionary.Symbol.NAME}.${Data.Version.Dictionary.Symbol.EXTENSION}`,g)),u.push(File_System.Write_File(`${o}/${Data.Version.Text.Symbol.NAME}.${Data.Version.Text.Symbol.EXTENSION}`,N));for(let t=0,n=s.length;t<n;t+=1){const n=s[t],a=l[t],c=d.Compress_File({dictionary:r,file_value:a}),m=d.Decompress_File({dictionary:r,file_value:c});Utils.Assert(m===a,`Invalid decompression!\n   Book Name: ${_}\n   Language Name: ${e}\n   Version Name: ${i}\n   File Name: ${n}\n${Decompression_Line_Mismatches(a,m)}`),u.push(File_System.Write_File(`${o}/${n.replace(/\.[^.]*$/,`.${Data.File.Symbol.EXTENSION}`)}`,c))}yield Promise.all(u),console.log(`        Generated ${_}/${e}/${i}...`)}const u=new Data.Version.Info({json:yield File_System.Read_File(`${o}/${INFO_JSON_NAME}`)});n.Increment_Unit_Counts(u.Language_Unit_Counts()),n.Increment_Point_Counts(u.Language_Point_Counts()),n.Increment_Letter_Counts(u.Language_Letter_Counts()),n.Increment_Marker_Counts(u.Language_Marker_Counts()),n.Increment_Meta_Letter_Counts(u.Language_Meta_Letter_Counts()),n.Increment_Word_Counts(u.Language_Word_Counts()),n.Increment_Break_Counts(u.Language_Break_Counts()),n.Increment_Meta_Word_Counts(u.Language_Meta_Word_Counts()),n.Increment_Part_Counts(u.Language_Part_Counts()),n.Increment_Line_Counts(u.Language_Line_Counts()),n.Increment_File_Counts(u.Language_File_Counts()),n.Increment_Book_Count(e,1)}}}yield File_System.Write_File(`./data/${INFO_JSON_NAME}`,n.JSON_String())}))}(),yield function(){return __awaiter(this,void 0,void 0,(function*(){let e=yield File_System.Read_File(README_PATH);const t="## Stats";let _=null,i=null;for(let a=0,s=e.length;a<s;a+=1){const l=e.slice(a);null===_?l.slice(0,t.length)===t&&(_=a):null===i&&"##"===l.slice(0,"##".length)&&(i=a)}if(null!==_){function o(e,t){let n="";for(const _ of t)n+=`${e}    - ${_}\n`;return n}function r(e,t){let n="";for(const[_,i,o]of t)n+=`${e}    - ${_}: ${Utils.Add_Commas_To_Number(i)} (~${o}%)\n`;return n}null===i&&(i=e.length),e=e.slice(0,_)+"## Stats\n\n"+`- Unique Languages: ${n.Unique_Language_Name_Count_String()}\n`+o("",n.Unique_Language_Names())+`- Unique Versions: ${n.Unique_Version_Name_Count_String()}\n`+o("",n.Unique_Version_Names())+`- Unique Books: ${n.Unique_Book_Name_Count_String()}\n`+o("",n.Unique_Book_Names())+"\n<br>\n\n"+`- Total Books: ${n.Total_Book_Count_String()}\n`+r("",n.Language_Book_Counts_And_Percents())+`- Total Files: ${n.Total_File_Count_String()}\n`+r("",n.Language_File_Counts_And_Percents())+`- Total Lines: ${n.Total_Line_Count_String()}\n`+r("",n.Language_Line_Counts_And_Percents())+`- Total Parts: ${n.Total_Part_Count_String()}\n    - <i>By Language</i>\n`+r("    ",n.Language_Part_Counts_And_Percents())+"    - <i>By Components</i>\n"+`        - Words: ${n.Total_Word_Count_String()} (~${n.Total_Word_Percent()}%)\n`+r("        ",n.Language_Word_Counts_And_Percents())+`        - Meta-Words: ${n.Total_Meta_Word_Count_String()} (~${n.Total_Meta_Word_Percent()}%)\n`+r("        ",n.Language_Meta_Word_Counts_And_Percents())+`        - Non-Words: ${n.Total_Break_Count_String()} (~${n.Total_Break_Percent()}%)\n`+r("        ",n.Language_Break_Counts_And_Percents())+`- Total Unicode Points: ${n.Total_Point_Count_String()}\n    - <i>By Language</i>\n`+r("    ",n.Language_Point_Counts_And_Percents())+"    - <i>By Components</i>\n"+`        - Letters: ${n.Total_Letter_Count_String()} (~${n.Total_Letter_Percent()}%)\n`+r("        ",n.Language_Letter_Counts_And_Percents())+`        - Meta-Letters: ${n.Total_Meta_Letter_Count_String()} (~${n.Total_Meta_Letter_Percent()}%)\n`+r("        ",n.Language_Meta_Letter_Counts_And_Percents())+`        - Non-Letters: ${n.Total_Marker_Count_String()} (~${n.Total_Marker_Percent()}%)\n`+r("        ",n.Language_Marker_Counts_And_Percents())+e.slice(i,e.length)}yield File_System.Write_File(README_PATH,e)}))}(),yield File_System.Write_File("./.timestamp","")}))}!function(){__awaiter(this,void 0,void 0,(function*(){const e=process.argv.slice(2);yield Generate(e.includes("-f")||e.includes("--force"))}))}();