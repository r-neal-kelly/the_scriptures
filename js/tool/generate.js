var __awaiter=this&&this.__awaiter||function(t,e,_,o){return new(_||(_=Promise))((function(n,a){function l(t){try{r(o.next(t))}catch(t){a(t)}}function s(t){try{r(o.throw(t))}catch(t){a(t)}}function r(t){var e;t.done?n(t.value):(e=t.value,e instanceof _?e:new _((function(t){t(e)}))).then(l,s)}r((o=o.apply(t,e||[])).next())}))};import*as process from"process";import*as Utils from"../utils.js";import*as Unicode from"../unicode.js";import*as Language from"../model/language.js";import*as Data from"../model/data.js";import*as Text from"../model/text.js";import*as File_System from"./file_system.js";const TIMESTAMP_PATH="./.timestamp",README_PATH="./README.md",DATA_PATH="./data",INFO_JSON_NAME="Info.json",ORDER_JSON_NAME="Order.json",DICTIONARY_JSON_NAME="Dictionary.json",UNIQUE_PARTS_JSON_NAME="Unique_Parts.json",DEFAULT_LAST_TIMESTAMP=0,NAME_SORTER=Data.Name_Sorter.Singleton(),LINE_PATH_TYPE=Text.Line.Path_Type.DEFAULT;class Unique_Names{constructor(){this.books=new Set,this.languages=new Set,this.versions=new Set}Add_Book(t){this.books.add(t)}Add_Language(t){this.languages.add(t)}Add_Version(t){this.versions.add(t)}Books(){return NAME_SORTER.With_Set(Data.Name_Sorter.Type.BOOKS,this.books)}Languages(){return NAME_SORTER.With_Set(Data.Name_Sorter.Type.LANGUAGES,this.languages)}Versions(){return NAME_SORTER.With_Set(Data.Name_Sorter.Type.VERSIONS,this.versions)}}class Unique_Parts{constructor(){this.parts={}}Add(t){this.parts.hasOwnProperty(t)?(Utils.Assert(this.parts[t]<Number.MAX_SAFE_INTEGER,"Cannot add more of this unique part!"),this.parts[t]+=1):this.parts[t]=1}Values(){return Object.keys(this.parts).sort(function(t,e){return this.parts[e]-this.parts[t]}.bind(this))}Count(t){return Utils.Assert(this.parts.hasOwnProperty(t),"Does not have part."),this.parts[t]}}function Read_And_Sort_File_Names(t){return __awaiter(this,void 0,void 0,(function*(){return File_System.Has_File(`${t}/${ORDER_JSON_NAME}`)?JSON.parse(yield File_System.Read_File(`${t}/${ORDER_JSON_NAME}`)):(yield File_System.File_Names(t)).filter((function(t){return/\.txt$/.test(t)&&!/COPY\.txt$/.test(t)})).sort()}))}function Read_File_Text(t){return __awaiter(this,void 0,void 0,(function*(){const e=yield File_System.Read_And_Write_File_With_No_Carriage_Returns(t);return Utils.Assert(Language.Greek.Normalize_With_Combined_Points(Language.Greek.Normalize_With_Baked_Points(e))===e,`\n            Failed to reproduce original file_text after Greek normalization!\n            ${t}\n        `),e}))}function Should_Version_Be_Updated(t,e,_){return __awaiter(this,void 0,void 0,(function*(){for(const _ of[`${e}/${INFO_JSON_NAME}`,`${e}/${DICTIONARY_JSON_NAME}`,`${e}/${UNIQUE_PARTS_JSON_NAME}`])if(!File_System.Has_File(_)||(yield File_System.Read_Entity_Last_Modified_Time(_))>t)return!0;if(File_System.Has_File(`${e}/${ORDER_JSON_NAME}`)&&(yield File_System.Read_Entity_Last_Modified_Time(`${e}/${ORDER_JSON_NAME}`))>t)return!0;for(const o of _){const _=`${e}/${o}`;if((yield File_System.Read_Entity_Last_Modified_Time(_))>t)return!0}return!1}))}function Decompression_Line_Mismatches(t,e){const _=t.split(/\r?\n/),o=e.split(/\r?\n/);let n="";for(let t=0,e=_.length;t<e;t+=1)t<o.length?_[t]!==o[t]&&(n+=`${t}: ${_[t]} !== ${o[t]}\n`):n+=`${t}: <missing line>\n`;return""===n?"<no mismatching lines>":n}function Generate(t){return __awaiter(this,void 0,void 0,(function*(){const e=t?0:File_System.Has_File("./.timestamp")?yield File_System.Read_Entity_Last_Modified_Time("./.timestamp"):0,_={tree:{books:[]},unique_book_names:[],unique_language_names:[],unique_version_names:[],total_unit_count:0,total_point_count:0,total_letter_count:0,total_marker_count:0,total_meta_letter_count:0,total_word_count:0,total_break_count:0,total_meta_word_count:0,total_part_count:0,total_line_count:0,total_file_count:0,total_book_count:0,language_unit_counts:{},language_point_counts:{},language_letter_counts:{},language_marker_counts:{},language_meta_letter_counts:{},language_word_counts:{},language_break_counts:{},language_meta_word_counts:{},language_part_counts:{},language_line_counts:{},language_file_counts:{},language_book_counts:{}},o=new Unique_Names;0===e?console.log("    Forcefully generating all files..."):console.log("    Only generating out-of-date files..."),yield function(){return __awaiter(this,void 0,void 0,(function*(){const t="./data/Books";for(const n of(yield File_System.Folder_Names(t)).sort()){const a=`${t}/${n}`,l={name:n,languages:[]};_.tree.books.push(l),o.Add_Book(n);for(const t of(yield File_System.Folder_Names(a)).sort()){const s=`${a}/${t}`,r={name:t,versions:[]};l.languages.push(r),o.Add_Language(t),null==_.language_unit_counts[t]&&(_.language_unit_counts[t]=0,_.language_point_counts[t]=0,_.language_letter_counts[t]=0,_.language_marker_counts[t]=0,_.language_meta_letter_counts[t]=0,_.language_word_counts[t]=0,_.language_break_counts[t]=0,_.language_meta_word_counts[t]=0,_.language_part_counts[t]=0,_.language_line_counts[t]=0,_.language_file_counts[t]=0,_.language_book_counts[t]=0);for(const a of(yield File_System.Folder_Names(s)).sort()){const l=`${s}/${a}`,u=yield Read_And_Sort_File_Names(l),i={name:a,files:u.map(Utils.Remove_File_Extension)};if(r.versions.push(i),o.Add_Version(a),yield Should_Version_Be_Updated(e,l,u)){const e={total_unit_count:0,total_point_count:0,total_letter_count:0,total_marker_count:0,total_meta_letter_count:0,total_word_count:0,total_break_count:0,total_meta_word_count:0,total_part_count:0,total_line_count:0,total_file_count:0},_=yield File_System.Read_File(`${l}/${DICTIONARY_JSON_NAME}`),o=new Text.Dictionary.Instance({json:_}),s=new Unique_Parts,r=[];Utils.Assert(e.total_file_count+u.length<=Number.MAX_SAFE_INTEGER),o.Validate(),e.total_file_count+=u.length;for(const _ of u){const u=`${l}/${_}`,i=yield Read_File_Text(u),c=new Text.Instance({dictionary:o,value:i});Utils.Assert(e.total_line_count+c.Line_Count()<=Number.MAX_SAFE_INTEGER),r.push(i),e.total_line_count+=c.Line_Count();for(let o=0,l=c.Line_Count();o<l;o+=1){const l=c.Line(o);for(let r=0,u=l.Macro_Part_Count(LINE_PATH_TYPE);r<u;r+=1){const u=l.Macro_Part(r,LINE_PATH_TYPE),i=u.Part_Type(),c=u.Value(),m=c.length,d=Unicode.Point_Count(c);if(Utils.Assert(!u.Is_Unknown(),`Unknown part! Cannot generate:\n   Book Name:          ${n}\n   Language Name:      ${t}\n   Version Name:       ${a}\n   File Name:          ${_}\n   Line Index:         ${o}\n   Macro Part Index:   ${r}\n   Macro Part Value:   ${c}\n`),u.Is_Error()&&Utils.Assert(u.Has_Error_Style(),`Error not wrapped with error command! Should not generate:\n   Book Name:          ${n}\n   Language Name:      ${t}\n   Version Name:       ${a}\n   File Name:          ${_}\n   Line Index:         ${o}\n   Macro Part Index:   ${r}\n   Macro Part Value:   ${c}\n`),Utils.Assert(e.total_unit_count+m<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_point_count+d<=Number.MAX_SAFE_INTEGER),s.Add(c),e.total_unit_count+=m,e.total_point_count+=d,i===Text.Part.Type.LETTER)Utils.Assert(e.total_letter_count+1<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_part_count+1<=Number.MAX_SAFE_INTEGER),e.total_letter_count+=1,e.total_part_count+=1;else if(i===Text.Part.Type.MARKER)Utils.Assert(e.total_marker_count+1<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_part_count+1<=Number.MAX_SAFE_INTEGER),e.total_marker_count+=1,e.total_part_count+=1;else if(i===Text.Part.Type.WORD)Utils.Assert(e.total_letter_count+d<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_word_count+1<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_part_count+1<=Number.MAX_SAFE_INTEGER),e.total_letter_count+=d,e.total_word_count+=1,e.total_part_count+=1;else if(i===Text.Part.Type.BREAK)Utils.Assert(e.total_marker_count+d<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_break_count+1<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_part_count+1<=Number.MAX_SAFE_INTEGER),e.total_marker_count+=d,e.total_break_count+=1,e.total_part_count+=1;else if(i===Text.Part.Type.COMMAND){const t=u;Utils.Assert(e.total_meta_letter_count+d<=Number.MAX_SAFE_INTEGER),e.total_meta_letter_count+=d,t.Is_Last_Of_Split()||(Utils.Assert(e.total_meta_word_count+1<=Number.MAX_SAFE_INTEGER),Utils.Assert(e.total_part_count+1<=Number.MAX_SAFE_INTEGER),e.total_meta_word_count+=1,e.total_part_count+=1)}}}}const i=[],c=r.join(Data.Version.Symbol.FILE_BREAK),m=s.Values(),d=new Data.Compressor.Instance({unique_parts:m}),A=d.Compress_Dictionary({dictionary_value:_}),g=d.Decompress_Dictionary({dictionary_value:A}),E=d.Compress_File({dictionary:o,file_value:c}),N=d.Decompress_File({dictionary:o,file_value:E});Utils.Assert(g===_,"Invalid dictionary decompression!"),Utils.Assert(N===c,`Invalid decompression!\n   Book Name: ${n}\n   Language Name: ${t}\n   Version Name: ${a}\n${Decompression_Line_Mismatches(c,N)}`),i.push(File_System.Write_File(`${l}/${INFO_JSON_NAME}`,JSON.stringify(e))),i.push(File_System.Write_File(`${l}/${UNIQUE_PARTS_JSON_NAME}`,JSON.stringify(m))),i.push(File_System.Write_File(`${l}/${Data.Version.Dictionary.Symbol.NAME}.${Data.Version.Dictionary.Symbol.EXTENSION}`,A)),i.push(File_System.Write_File(`${l}/${Data.Version.Text.Symbol.NAME}.${Data.Version.Text.Symbol.EXTENSION}`,E));for(let e=0,_=u.length;e<_;e+=1){const _=u[e],s=r[e],c=d.Compress_File({dictionary:o,file_value:s}),m=d.Decompress_File({dictionary:o,file_value:c});Utils.Assert(m===s,`Invalid decompression!\n   Book Name: ${n}\n   Language Name: ${t}\n   Version Name: ${a}\n   File Name: ${_}\n${Decompression_Line_Mismatches(s,m)}`),i.push(File_System.Write_File(`${l}/${_.replace(/\.[^.]*$/,`.${Data.Version.Dictionary.Symbol.EXTENSION}`)}`,c))}yield Promise.all(i),console.log(`        Generated ${n}/${t}/${a}...`)}const c=JSON.parse(yield File_System.Read_File(`${l}/${INFO_JSON_NAME}`));Utils.Assert(_.total_unit_count+c.total_unit_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_point_count+c.total_point_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_letter_count+c.total_letter_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_marker_count+c.total_marker_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_meta_letter_count+c.total_meta_letter_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_word_count+c.total_word_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_break_count+c.total_break_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_meta_word_count+c.total_meta_word_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_part_count+c.total_part_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_line_count+c.total_line_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_file_count+c.total_file_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.total_book_count+1<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_unit_counts[t]+c.total_unit_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_point_counts[t]+c.total_point_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_letter_counts[t]+c.total_letter_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_marker_counts[t]+c.total_marker_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_meta_letter_counts[t]+c.total_meta_letter_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_word_counts[t]+c.total_word_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_break_counts[t]+c.total_break_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_meta_word_counts[t]+c.total_meta_word_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_part_counts[t]+c.total_part_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_line_counts[t]+c.total_line_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_file_counts[t]+c.total_file_count<=Number.MAX_SAFE_INTEGER),Utils.Assert(_.language_book_counts[t]+1<=Number.MAX_SAFE_INTEGER),_.total_unit_count+=c.total_unit_count,_.total_point_count+=c.total_point_count,_.total_letter_count+=c.total_letter_count,_.total_marker_count+=c.total_marker_count,_.total_meta_letter_count+=c.total_meta_letter_count,_.total_word_count+=c.total_word_count,_.total_break_count+=c.total_break_count,_.total_meta_word_count+=c.total_meta_word_count,_.total_part_count+=c.total_part_count,_.total_line_count+=c.total_line_count,_.total_file_count+=c.total_file_count,_.total_book_count+=1,_.language_unit_counts[t]+=c.total_unit_count,_.language_point_counts[t]+=c.total_point_count,_.language_letter_counts[t]+=c.total_letter_count,_.language_marker_counts[t]+=c.total_marker_count,_.language_meta_letter_counts[t]+=c.total_meta_letter_count,_.language_word_counts[t]+=c.total_word_count,_.language_break_counts[t]+=c.total_break_count,_.language_meta_word_counts[t]+=c.total_meta_word_count,_.language_part_counts[t]+=c.total_part_count,_.language_line_counts[t]+=c.total_line_count,_.language_file_counts[t]+=c.total_file_count,_.language_book_counts[t]+=1}}}Utils.Assert(_.total_word_count+_.total_meta_word_count+_.total_break_count===_.total_part_count,"Miscount of total_part_count"),Utils.Assert(_.total_letter_count+_.total_meta_letter_count+_.total_marker_count===_.total_point_count,"Miscount of total_point_count."),_.unique_book_names=o.Books(),_.unique_language_names=o.Languages(),_.unique_version_names=o.Versions(),yield File_System.Write_File(`./data/${INFO_JSON_NAME}`,JSON.stringify(_))}))}(),yield function(){return __awaiter(this,void 0,void 0,(function*(){let t=yield File_System.Read_File(README_PATH);const e="## Stats";let o=null,n=null;for(let s=0,r=t.length;s<r;s+=1){const u=t.slice(s);null===o?u.slice(0,e.length)===e&&(o=s):null===n&&"##"===u.slice(0,"##".length)&&(n=s)}if(null!==o){null===n&&(n=t.length);const i=Math.round(100*_.total_word_count/_.total_part_count),c=Math.round(100*_.total_meta_word_count/_.total_part_count),m=Math.round(100*_.total_break_count/_.total_part_count),d=Math.round(100*_.total_letter_count/_.total_point_count),A=Math.round(100*_.total_meta_letter_count/_.total_point_count),g=Math.round(100*_.total_marker_count/_.total_point_count);function a(t,e){let _="";for(const o of e)_+=`${t}    - ${o}\n`;return _}function l(t,e,o){let n="";for(const a of _.unique_language_names)if(null!=o[a]){const _=o[a],l=Math.round(100*_/e);n+=`${t}    - ${a}: ${Utils.Add_Commas_To_Number(_)} (~${l}%)\n`}return n}t=t.slice(0,o)+"## Stats\n\n"+`- Unique Languages: ${Utils.Add_Commas_To_Number(_.unique_language_names.length)}\n`+a("",_.unique_language_names)+`- Unique Versions: ${Utils.Add_Commas_To_Number(_.unique_version_names.length)}\n`+a("",_.unique_version_names)+`- Unique Books: ${Utils.Add_Commas_To_Number(_.unique_book_names.length)}\n`+a("",_.unique_book_names)+"\n<br>\n\n"+`- Total Books: ${Utils.Add_Commas_To_Number(_.total_book_count)}\n`+l("",_.total_book_count,_.language_book_counts)+`- Total Files: ${Utils.Add_Commas_To_Number(_.total_file_count)}\n`+l("",_.total_file_count,_.language_file_counts)+`- Total Lines: ${Utils.Add_Commas_To_Number(_.total_line_count)}\n`+l("",_.total_line_count,_.language_line_counts)+`- Total Parts: ${Utils.Add_Commas_To_Number(_.total_part_count)}\n    - <i>By Language</i>\n`+l("    ",_.total_part_count,_.language_part_counts)+"    - <i>By Components</i>\n"+`        - Words: ${Utils.Add_Commas_To_Number(_.total_word_count)} (~${i}%)\n`+l("        ",_.total_word_count,_.language_word_counts)+`        - Meta-Words: ${Utils.Add_Commas_To_Number(_.total_meta_word_count)} (~${c}%)\n`+l("        ",_.total_meta_word_count,_.language_meta_word_counts)+`        - Non-Words: ${Utils.Add_Commas_To_Number(_.total_break_count)} (~${m}%)\n`+l("        ",_.total_break_count,_.language_break_counts)+`- Total Unicode Points: ${Utils.Add_Commas_To_Number(_.total_point_count)}\n    - <i>By Language</i>\n`+l("    ",_.total_point_count,_.language_point_counts)+"    - <i>By Components</i>\n"+`        - Letters: ${Utils.Add_Commas_To_Number(_.total_letter_count)} (~${d}%)\n`+l("        ",_.total_letter_count,_.language_letter_counts)+`        - Meta-Letters: ${Utils.Add_Commas_To_Number(_.total_meta_letter_count)} (~${A}%)\n`+l("        ",_.total_meta_letter_count,_.language_meta_letter_counts)+`        - Non-Letters: ${Utils.Add_Commas_To_Number(_.total_marker_count)} (~${g}%)\n`+l("        ",_.total_marker_count,_.language_marker_counts)+t.slice(n,t.length)}yield File_System.Write_File(README_PATH,t)}))}(),yield File_System.Write_File("./.timestamp","")}))}!function(){__awaiter(this,void 0,void 0,(function*(){const t=process.argv.slice(2);yield Generate(t.includes("-f")||t.includes("--force"))}))}();