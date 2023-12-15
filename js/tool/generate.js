var __awaiter=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(_,i){function s(e){try{a(o.next(e))}catch(e){i(e)}}function r(e){try{a(o.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?_(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,r)}a((o=o.apply(e,t||[])).next())}))};import*as process from"process";import*as Utils from"../utils.js";import*as Unicode from"../unicode.js";import*as Compressor from"../compressor.js";import*as Language from"../model/language.js";import*as Data from"../model/data.js";import*as Text from"../model/text.js";import*as File_System from"./file_system.js";const TIMESTAMP_PATH="./.timestamp",README_PATH="./README.md",DATA_PATH="./data",INFO_JSON_NAME="Info.json",ORDER_JSON_NAME="Order.json",DICTIONARY_JSON_NAME="Dictionary.json",UNIQUE_PARTS_FILE_NAME=Data.Version.Consts.UNIQUE_PARTS_FILE_NAME,DEFAULT_LAST_TIMESTAMP=0,IS_COMPRESSED_FILE_REGEX=new RegExp(`\\.${Data.File.Symbol.EXTENSION}$`);class Unique_Parts{constructor(){this.parts={}}Add(e){this.parts.hasOwnProperty(e)?(0,this.parts[e]+=1):this.parts[e]=1}Values(){return Object.keys(this.parts).sort(function(e,t){return this.parts[t]-this.parts[e]}.bind(this))}Count(e){return 0,this.parts[e]}}function Read_And_Sort_File_Names(e){return __awaiter(this,void 0,void 0,(function*(){const t=(yield File_System.File_Names(e)).filter((function(e){return/\.txt$/.test(e)&&!/COPY\.txt$/.test(e)}));if(File_System.Has_File(`${e}/${ORDER_JSON_NAME}`)){const n=JSON.parse(yield File_System.Read_File(`${e}/${ORDER_JSON_NAME}`)),o=[];for(const e of t)n.includes(e)||o.push(e);return 0,n}return t.sort()}))}function Read_File_Text(e){return __awaiter(this,void 0,void 0,(function*(){const t=yield File_System.Read_And_Write_File_With_No_Carriage_Returns(e);return 0,t}))}function Should_Version_Be_Updated(e,t,n){return __awaiter(this,void 0,void 0,(function*(){for(const n of[`${t}/${INFO_JSON_NAME}`,`${t}/${DICTIONARY_JSON_NAME}`,`${t}/${UNIQUE_PARTS_FILE_NAME}`])if(!File_System.Has_File(n)||(yield File_System.Read_Entity_Last_Modified_Time(n))>e)return!0;if(File_System.Has_File(`${t}/${ORDER_JSON_NAME}`)&&(yield File_System.Read_Entity_Last_Modified_Time(`${t}/${ORDER_JSON_NAME}`))>e)return!0;for(const o of n){const n=`${t}/${o.replace(/\.[^.]*$/,`.${Data.File.Symbol.EXTENSION}`)}`;if(!File_System.Has_File(n)||(yield File_System.Read_Entity_Last_Modified_Time(`${t}/${o}`))>e||(yield File_System.Read_Entity_Last_Modified_Time(n))>e)return!0}return!1}))}function Delete_Compiled_Files(e){return __awaiter(this,void 0,void 0,(function*(){const t=(yield File_System.File_Names(e)).filter((function(e){return IS_COMPRESSED_FILE_REGEX.test(e)}));yield Promise.all(t.map((t=>File_System.Delete_File(`${e}/${t}`))))}))}function Decompression_Line_Mismatches(e,t){const n=e.split(/\r?\n/),o=t.split(/\r?\n/);let _="";for(let e=0,t=n.length;e<t;e+=1)e<o.length?n[e]!==o[e]&&(_+=`${e}: ${n[e]} !== ${o[e]}\n`):_+=`${e}: <missing line>\n`;return""===_?"<no mismatching lines>":_}function Generate(e){return __awaiter(this,void 0,void 0,(function*(){const t=e?0:File_System.Has_File("./.timestamp")?yield File_System.Read_Entity_Last_Modified_Time("./.timestamp"):0,n=new Data.Info({});0===t?console.log("    Forcefully generating all files..."):console.log("    Only generating out-of-date files..."),yield function(){return __awaiter(this,void 0,void 0,(function*(){const e="./data/Books";for(const o of(yield File_System.Folder_Names(e)).sort()){const _=`${e}/${o}`,i={name:o,languages:[]};n.Tree().books.push(i),n.Add_Unique_Book_Name(o);for(const e of(yield File_System.Folder_Names(_)).sort()){const s=`${_}/${e}`,r={name:e,versions:[]};i.languages.push(r),n.Add_Unique_Language_Name(e);for(const _ of(yield File_System.Folder_Names(s)).sort()){const i=`${s}/${_}`,a=yield Read_And_Sort_File_Names(i),l={name:_,files:a.map(Utils.Remove_File_Extension)};if(r.versions.push(l),n.Add_Unique_Version_Name(_),yield Should_Version_Be_Updated(t,i,a)){const t=new Data.Version.Info({}),n=yield File_System.Read_File(`${i}/${DICTIONARY_JSON_NAME}`),s=new Text.Dictionary.Instance({json:n}),r=new Unique_Parts,l=[];t.Increment_File_Count(e,a.length),s.Validate(),yield Delete_Compiled_Files(i);for(const n of a){const a=`${i}/${n}`,u=yield Read_File_Text(a),m=new Text.Instance({dictionary:s,value:u});t.Increment_Line_Count(e,m.Line_Count()),t.Update_Buffer_Counts(m),l.push(u);for(let i=0,s=m.Line_Count();i<s;i+=1){const s=m.Line(i);for(let a=0,l=s.Column_Count();a<l;a+=1){const l=s.Column(a);for(let s=0,u=l.Row_Count();s<u;s+=1){const u=l.Row(s);for(let l=0,m=u.Macro_Part_Count();l<m;l+=1){const m=u.Macro_Part(l),c=m.Part_Type(),d=m.Value(),g=d.length,$=Unicode.Point_Count(d),S=m.Language()?m.Language():e;if(0,m.Is_Error()&&0,r.Add(d),t.Increment_Unit_Count(S,g),t.Increment_Point_Count(S,$),c===Text.Part.Type.LETTER)t.Increment_Letter_Count(S,1),t.Increment_Part_Count(S,1);else if(c===Text.Part.Type.MARKER)t.Increment_Marker_Count(S,1),t.Increment_Part_Count(S,1);else if(c===Text.Part.Type.WORD)t.Increment_Letter_Count(S,$),t.Increment_Word_Count(S,1),t.Increment_Part_Count(S,1);else if(c===Text.Part.Type.BREAK)t.Increment_Marker_Count(S,$),t.Increment_Break_Count(S,1),t.Increment_Part_Count(S,1);else if(c===Text.Part.Type.COMMAND){const e=m;t.Increment_Meta_Letter_Count(S,$),e.Is_Last_Of_Split()||(t.Increment_Meta_Word_Count(S,1),t.Increment_Part_Count(S,1))}}}}}}const u=[],m=l.join(Data.Version.Symbol.FILE_BREAK),c=r.Values(),d=JSON.stringify(c),g=Compressor.JSON_String_Array_Compress(d),$=Compressor.JSON_String_Array_Decompress(g),S=new Data.Compressor.Instance({unique_parts:c}),f=S.Compress_Dictionary({dictionary_value:n}),y=S.Decompress_Dictionary({dictionary_value:f}),C=S.Compress_File({dictionary:s,file_value:m}),N=S.Decompress_File({dictionary:s,file_value:C});0,0,0,t.Finalize(),u.push(File_System.Write_File(`${i}/${INFO_JSON_NAME}`,t.JSON_String())),u.push(File_System.Write_File(`${i}/${UNIQUE_PARTS_FILE_NAME}`,g)),u.push(File_System.Write_File(`${i}/${Data.Version.Dictionary.Symbol.NAME}.${Data.Version.Dictionary.Symbol.EXTENSION}`,f)),u.push(File_System.Write_File(`${i}/${Data.Version.Text.Symbol.NAME}.${Data.Version.Text.Symbol.EXTENSION}`,C));for(let t=0,n=a.length;t<n;t+=1){const n=a[t],r=l[t],m=S.Compress_File({dictionary:s,file_value:r}),c=S.Decompress_File({dictionary:s,file_value:m});0,u.push(File_System.Write_File(`${i}/${n.replace(/\.[^.]*$/,`.${Data.File.Symbol.EXTENSION}`)}`,m))}yield Promise.all(u),console.log(`        Generated ${o}/${e}/${_}...`)}const u=new Data.Version.Info({json:yield File_System.Read_File(`${i}/${INFO_JSON_NAME}`)});n.Increment_Unit_Counts(u.Language_Unit_Counts()),n.Increment_Point_Counts(u.Language_Point_Counts()),n.Increment_Letter_Counts(u.Language_Letter_Counts()),n.Increment_Marker_Counts(u.Language_Marker_Counts()),n.Increment_Meta_Letter_Counts(u.Language_Meta_Letter_Counts()),n.Increment_Word_Counts(u.Language_Word_Counts()),n.Increment_Break_Counts(u.Language_Break_Counts()),n.Increment_Meta_Word_Counts(u.Language_Meta_Word_Counts()),n.Increment_Part_Counts(u.Language_Part_Counts()),n.Increment_Line_Counts(u.Language_Line_Counts()),n.Increment_File_Counts(u.Language_File_Counts()),n.Increment_Book_Count(e,1),n.Update_Buffer_Counts(u)}}}n.Finalize();const o=n.JSON_String(),_=Compressor.LZSS_Compress(o),i=Compressor.LZSS_Decompress(_);0,yield File_System.Write_File(`./data/${Data.Consts.INFO_FILE_NAME}`,_)}))}(),yield function(){return __awaiter(this,void 0,void 0,(function*(){let e=yield File_System.Read_File(README_PATH);const t="## Stats";let o=null,_=null;for(let r=0,a=e.length;r<a;r+=1){const l=e.slice(r);null===o?l.slice(0,t.length)===t&&(o=r):null===_&&"##"===l.slice(0,"##".length)&&(_=r)}if(null!==o){function i(e,t){let n="";for(const o of t)n+=`${e}    - ${o}\n`;return n}function s(e,t){let n="";for(const[o,_,i]of t)n+=`${e}    - ${o}: ${Utils.Add_Commas_To_Number(_)} (~${i}%)\n`;return n}null===_&&(_=e.length),e=e.slice(0,o)+"## Stats\n\n"+`- Unique Languages: ${n.Unique_Language_Name_Count_String()}\n`+i("",n.Unique_Language_Names())+`- Unique Versions: ${n.Unique_Version_Name_Count_String()}\n`+i("",n.Unique_Version_Names())+`- Unique Books: ${n.Unique_Book_Name_Count_String()}\n`+i("",n.Unique_Book_Names())+"\n<br>\n\n"+`- Total Books: ${n.Total_Book_Count_String()}\n`+s("",n.Language_Book_Counts_And_Percents())+`- Total Files: ${n.Total_File_Count_String()}\n`+s("",n.Language_File_Counts_And_Percents())+`- Total Lines: ${n.Total_Line_Count_String()}\n`+s("",n.Language_Line_Counts_And_Percents())+`- Total Parts: ${n.Total_Part_Count_String()}\n    - <i>By Language</i>\n`+s("    ",n.Language_Part_Counts_And_Percents())+"    - <i>By Components</i>\n"+`        - Words: ${n.Total_Word_Count_String()} (~${n.Total_Word_Percent()}%)\n`+s("        ",n.Language_Word_Counts_And_Percents())+`        - Meta-Words: ${n.Total_Meta_Word_Count_String()} (~${n.Total_Meta_Word_Percent()}%)\n`+s("        ",n.Language_Meta_Word_Counts_And_Percents())+`        - Non-Words: ${n.Total_Break_Count_String()} (~${n.Total_Break_Percent()}%)\n`+s("        ",n.Language_Break_Counts_And_Percents())+`- Total Unicode Points: ${n.Total_Point_Count_String()}\n    - <i>By Language</i>\n`+s("    ",n.Language_Point_Counts_And_Percents())+"    - <i>By Components</i>\n"+`        - Letters: ${n.Total_Letter_Count_String()} (~${n.Total_Letter_Percent()}%)\n`+s("        ",n.Language_Letter_Counts_And_Percents())+`        - Meta-Letters: ${n.Total_Meta_Letter_Count_String()} (~${n.Total_Meta_Letter_Percent()}%)\n`+s("        ",n.Language_Meta_Letter_Counts_And_Percents())+`        - Non-Letters: ${n.Total_Marker_Count_String()} (~${n.Total_Marker_Percent()}%)\n`+s("        ",n.Language_Marker_Counts_And_Percents())+e.slice(_,e.length)}yield File_System.Write_File(README_PATH,e)}))}(),yield File_System.Write_File("./.timestamp","")}))}!function(){__awaiter(this,void 0,void 0,(function*(){const e=process.argv.slice(2);yield Generate(e.includes("-f")||e.includes("--force"))}))}();