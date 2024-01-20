var __awaiter=this&&this.__awaiter||function(e,t,n,_){return new(n||(n=Promise))((function(s,o){function a(e){try{r(_.next(e))}catch(e){o(e)}}function i(e){try{r(_.throw(e))}catch(e){o(e)}}function r(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,i)}r((_=_.apply(e,t||[])).next())}))};import*as process from"process";import*as Utils from"../utils.js";import*as Unicode from"../unicode.js";import*as Compressor from"../compressor.js";import*as Language from"../model/language.js";import*as Data from"../model/data.js";import*as Text from"../model/text.js";import*as File_System from"./file_system.js";const TIMESTAMP_PATH="./.timestamp",README_PATH="./README.md",DEFAULT_LAST_TIMESTAMP=0,IS_COMPRESSED_FILE_REGEX=new RegExp(`\\.${Data.Consts.FILE_EXTENSION}$`);class Unique_Parts{constructor(){this.parts={}}Add(e){this.parts.hasOwnProperty(e)?(0,this.parts[e]+=1):this.parts[e]=1}Values(){return Object.keys(this.parts).sort(function(e,t){return this.parts[t]-this.parts[e]}.bind(this))}Count(e){return 0,this.parts[e]}}class Line_Language{constructor(e){this.default_language_name=e,this.part_counts=Object.create(null),this.total_part_count=0}Add_Part(e){if(!e.Is_Command()){const t=e.Language()||this.default_language_name;null==this.part_counts[t]&&(this.part_counts[t]=0),this.part_counts[t]+=1,this.total_part_count+=1}}Result(){const e=Object.entries(this.part_counts).map(function(e){return[e[0],100*e[1]/this.total_part_count]}.bind(this));return e.sort((function(e,t){return t[1]-e[1]})),e.length>0?e[0][0]:this.default_language_name}}function Read_And_Sort_File_Names(e){return __awaiter(this,void 0,void 0,(function*(){const t=(yield File_System.File_Names(e)).filter((function(e){return/\.txt$/.test(e)&&!/COPY\.txt$/.test(e)}));if(File_System.Has_File(`${e}/${Data.Consts.ORDER_JSON_NAME}`)){const n=JSON.parse(yield File_System.Read_File(`${e}/${Data.Consts.ORDER_JSON_NAME}`)),_=[];for(const e of t)n.includes(e)||_.push(e);return Utils.Assert_In_Release(0===_.length,`${e}/${Data.Consts.ORDER_JSON_NAME} is missing various files:\n${JSON.stringify(_)}`),n}return t.sort()}))}function Read_File_Text(e){return __awaiter(this,void 0,void 0,(function*(){const t=yield File_System.Read_And_Write_File_With_No_Carriage_Returns(e);return Utils.Assert_In_Release(Language.Greek.Normalize_With_Combined_Points(Language.Greek.Normalize_With_Baked_Points(t))===t,`\n            Failed to reproduce original file_text after Greek normalization!\n            ${e}\n        `),t}))}function Should_Version_Be_Updated(e,t,n){return __awaiter(this,void 0,void 0,(function*(){for(const n of[`${t}/${Data.Consts.INFO_JSON_NAME}`,`${t}/${Data.Consts.DICTIONARY_JSON_NAME}`,`${t}/${Data.Consts.UNIQUE_PARTS_NAME}`])if(!File_System.Has_File(n)||(yield File_System.Read_Entity_Last_Modified_Time(n))>e)return!0;if(File_System.Has_File(`${t}/${Data.Consts.ORDER_JSON_NAME}`)&&(yield File_System.Read_Entity_Last_Modified_Time(`${t}/${Data.Consts.ORDER_JSON_NAME}`))>e)return!0;for(const _ of n){const n=`${t}/${_.replace(/\.[^.]*$/,`.${Data.Consts.FILE_EXTENSION}`)}`;if(!File_System.Has_File(n)||(yield File_System.Read_Entity_Last_Modified_Time(`${t}/${_}`))>e||(yield File_System.Read_Entity_Last_Modified_Time(n))>e)return!0}return!1}))}function Delete_Compiled_Files(e){return __awaiter(this,void 0,void 0,(function*(){const t=(yield File_System.File_Names(e)).filter((function(e){return IS_COMPRESSED_FILE_REGEX.test(e)}));yield Promise.all(t.map((t=>File_System.Delete_File(`${e}/${t}`))))}))}function Decompression_Line_Mismatches(e,t){const n=e.split(/\r?\n/),_=t.split(/\r?\n/);let s="";for(let e=0,t=n.length;e<t;e+=1)e<_.length?n[e]!==_[e]&&(s+=`${e}: ${n[e]} !== ${_[e]}\n`):s+=`${e}: <missing line>\n`;return""===s?"<no mismatching lines>":s}function Generate(e){return __awaiter(this,void 0,void 0,(function*(){const t=e?0:File_System.Has_File("./.timestamp")?yield File_System.Read_Entity_Last_Modified_Time("./.timestamp"):0,n=new Data.Info.Instance({});0===t?console.log("    Forcefully generating all files..."):console.log("    Only generating out-of-date files..."),yield function(){return __awaiter(this,void 0,void 0,(function*(){const e=Data.Consts.BOOKS_PATH;for(const _ of(yield File_System.Folder_Names(e)).sort()){const s=`${e}/${_}`,o={name:_,languages:[]};n.Tree().books.push(o),n.Add_Unique_Book_Name(_);for(const e of(yield File_System.Folder_Names(s)).sort()){const a=`${s}/${e}`,i={name:e,versions:[]};o.languages.push(i),n.Add_Unique_Language_Name(e);for(const s of(yield File_System.Folder_Names(a)).sort()){const o=`${a}/${s}`,r=yield Read_And_Sort_File_Names(o),l={name:s,files:r.map(Utils.Remove_File_Extension)};if(i.versions.push(l),n.Add_Unique_Version_Name(s),yield Should_Version_Be_Updated(t,o,r)){const t=new Data.Version.Info.Instance({}),n=yield File_System.Read_File(`${o}/${Data.Consts.DICTIONARY_JSON_NAME}`),a=new Text.Dictionary.Instance({json:n}),i=a.Maybe_Validation_Error(),l=new Unique_Parts,u=[];Utils.Assert_In_Release(null==i,`Dictionary failed to validate: ${i}`),t.Increment_File_Count(e,r.length),yield Delete_Compiled_Files(o);for(const n of r){const i=`${o}/${n}`,r=yield Read_File_Text(i),c=new Text.Instance({dictionary:a,value:r});t.Update_Buffer_Counts(c),u.push(r);for(let o=0,a=c.Line_Count();o<a;o+=1){const a=c.Line(o),i=new Line_Language(e);for(let r=0,u=a.Column_Count();r<u;r+=1){const u=a.Column(r);for(let a=0,c=u.Row_Count();a<c;a+=1){const c=u.Row(a);for(let u=0,m=c.Macro_Part_Count();u<m;u+=1){const m=c.Macro_Part(u),d=m.Part_Type(),g=m.Value(),C=g.length,f=Unicode.Point_Count(g),$=m.Language()?m.Language():e;if(Utils.Assert_In_Release(!m.Is_Unknown(),`Unknown part! Cannot generate:\n   Book Name:          ${_}\n   Language Name:      ${e}\n   Version Name:       ${s}\n   File Name:          ${n}\n   Line Index:         ${o}\n   Column Index:       ${r}\n   Row Index:          ${a}\n   Macro Part Index:   ${u}\n   Macro Part Value:   ${g}\n`),m.Is_Error()&&Utils.Assert_In_Release(m.Has_Error_Style(),`Error not wrapped with fix command! Should not generate:\n   Book Name:          ${_}\n   Language Name:      ${e}\n   Version Name:       ${s}\n   File Name:          ${n}\n   Line Index:         ${o}\n   Column Index:       ${r}\n   Row Index:          ${a}\n   Macro Part Index:   ${u}\n   Macro Part Value:   ${g}\n`),l.Add(g),i.Add_Part(m),t.Increment_Unit_Count($,C),t.Increment_Point_Count($,f),d===Text.Part.Type.LETTER)t.Increment_Letter_Count($,1),t.Increment_Part_Count($,1);else if(d===Text.Part.Type.MARKER)t.Increment_Marker_Count($,1),t.Increment_Part_Count($,1);else if(d===Text.Part.Type.WORD)t.Increment_Letter_Count($,f),t.Increment_Word_Count($,1),t.Increment_Part_Count($,1);else if(d===Text.Part.Type.BREAK)t.Increment_Marker_Count($,f),t.Increment_Break_Count($,1),t.Increment_Part_Count($,1);else if(d===Text.Part.Type.COMMAND){const e=m;t.Increment_Meta_Letter_Count($,f),e.Is_Last_Of_Split()||(t.Increment_Meta_Word_Count($,1),t.Increment_Part_Count($,1))}}}}t.Increment_Line_Count(i.Result(),1)}}const c=[],m=l.Values(),d=JSON.stringify(m),g=Compressor.LZSS_Compress(d),C=Compressor.LZSS_Decompress(g),f=new Data.Version.Compressor.Instance({unique_parts:m}),$=new Data.Version.Decompressor.Instance({unique_parts:m}),p=f.Compress_Dictionary({dictionary_value:n}),S=$.Decompress_Dictionary({dictionary_value:p}),y=[];Utils.Assert_In_Release(C===d,"Invalid unique_part_values_json decompression!"),Utils.Assert_In_Release(S===n,"Invalid dictionary decompression!"),t.Finalize(),c.push(File_System.Write_File(`${o}/${Data.Consts.INFO_JSON_NAME}`,t.JSON_String())),c.push(File_System.Write_File(`${o}/${Data.Consts.UNIQUE_PARTS_NAME}`,g)),c.push(File_System.Write_File(`${o}/${Data.Consts.DICTIONARY_NAME}`,p));for(let t=0,n=r.length;t<n;t+=1){const n=r[t],i=u[t],l=f.Compress_File({dictionary:a,file_value:i}),m=$.Decompress_File({dictionary:a,file_value:l});Utils.Assert_In_Release(m===i,`Invalid decompression!\n   Book Name: ${_}\n   Language Name: ${e}\n   Version Name: ${s}\n   File Name: ${n}\n${Decompression_Line_Mismatches(i,m)}`),y.push(l),c.push(File_System.Write_File(`${o}/${n.replace(/\.[^.]*$/,`.${Data.Consts.FILE_EXTENSION}`)}`,l))}const I=y.join(Data.Consts.VERSION_TEXT_FILE_BREAK);c.push(File_System.Write_File(`${o}/${Data.Consts.VERSION_TEXT_NAME}`,I)),yield Promise.all(c),console.log(`        Generated ${_}/${e}/${s}...`)}const u=new Data.Version.Info.Instance({json:yield File_System.Read_File(`${o}/${Data.Consts.INFO_JSON_NAME}`)});n.Increment_Unit_Counts(u.Language_Unit_Counts()),n.Increment_Point_Counts(u.Language_Point_Counts()),n.Increment_Letter_Counts(u.Language_Letter_Counts()),n.Increment_Marker_Counts(u.Language_Marker_Counts()),n.Increment_Meta_Letter_Counts(u.Language_Meta_Letter_Counts()),n.Increment_Word_Counts(u.Language_Word_Counts()),n.Increment_Break_Counts(u.Language_Break_Counts()),n.Increment_Meta_Word_Counts(u.Language_Meta_Word_Counts()),n.Increment_Part_Counts(u.Language_Part_Counts()),n.Increment_Line_Counts(u.Language_Line_Counts()),n.Increment_File_Counts(u.Language_File_Counts()),n.Increment_Book_Count(e,1),n.Update_Max_File_Count(u.Total_File_Count()),n.Update_Buffer_Counts(u)}}}n.Finalize();const _=n.JSON_String(),s=Compressor.LZSS_Compress(_),o=Compressor.LZSS_Decompress(s);Utils.Assert_In_Release(o===_,"LZSS failed to decompress data_info_json"),yield File_System.Write_File(Data.Consts.INFO_PATH,s)}))}(),yield function(){return __awaiter(this,void 0,void 0,(function*(){let e=yield File_System.Read_File(README_PATH);const t="## Stats";let _=null,s=null;for(let i=0,r=e.length;i<r;i+=1){const l=e.slice(i);null===_?l.slice(0,t.length)===t&&(_=i):null===s&&"##"===l.slice(0,"##".length)&&(s=i)}if(null!==_){function o(e,t){let n="";for(const _ of t)n+=`${e}    - ${_}\n`;return n}function a(e,t){let n="";for(const[_,s,o]of t)n+=`${e}    - ${_}: ${Utils.Add_Commas_To_Number(s)} (~${o}%)\n`;return n}null===s&&(s=e.length),e=e.slice(0,_)+"## Stats\n\n"+`- Unique Languages: ${n.Unique_Language_Name_Count_String()}\n`+o("",n.Unique_Language_Names())+`- Unique Versions: ${n.Unique_Version_Name_Count_String()}\n`+o("",n.Unique_Version_Names())+`- Unique Books: ${n.Unique_Book_Name_Count_String()}\n`+o("",n.Unique_Book_Names())+"\n<br>\n\n"+`- Total Books: ${n.Total_Book_Count_String()}\n`+a("",n.Language_Book_Counts_And_Percents())+`- Total Files: ${n.Total_File_Count_String()}\n`+a("",n.Language_File_Counts_And_Percents())+`- Total Lines: ${n.Total_Line_Count_String()}\n`+a("",n.Language_Line_Counts_And_Percents())+`- Total Parts: ${n.Total_Part_Count_String()}\n    - <i>By Language</i>\n`+a("    ",n.Language_Part_Counts_And_Percents())+"    - <i>By Components</i>\n"+`        - Words: ${n.Total_Word_Count_String()} (~${n.Total_Word_Percent()}%)\n`+a("        ",n.Language_Word_Counts_And_Percents())+`        - Meta-Words: ${n.Total_Meta_Word_Count_String()} (~${n.Total_Meta_Word_Percent()}%)\n`+a("        ",n.Language_Meta_Word_Counts_And_Percents())+`        - Non-Words: ${n.Total_Break_Count_String()} (~${n.Total_Break_Percent()}%)\n`+a("        ",n.Language_Break_Counts_And_Percents())+`- Total Unicode Points: ${n.Total_Point_Count_String()}\n    - <i>By Language</i>\n`+a("    ",n.Language_Point_Counts_And_Percents())+"    - <i>By Components</i>\n"+`        - Letters: ${n.Total_Letter_Count_String()} (~${n.Total_Letter_Percent()}%)\n`+a("        ",n.Language_Letter_Counts_And_Percents())+`        - Meta-Letters: ${n.Total_Meta_Letter_Count_String()} (~${n.Total_Meta_Letter_Percent()}%)\n`+a("        ",n.Language_Meta_Letter_Counts_And_Percents())+`        - Non-Letters: ${n.Total_Marker_Count_String()} (~${n.Total_Marker_Percent()}%)\n`+a("        ",n.Language_Marker_Counts_And_Percents())+e.slice(s,e.length)}yield File_System.Write_File(README_PATH,e)}))}(),yield File_System.Write_File("./.timestamp","")}))}!function(){__awaiter(this,void 0,void 0,(function*(){const e=process.argv.slice(2);yield Generate(e.includes("-f")||e.includes("--force"))}))}();