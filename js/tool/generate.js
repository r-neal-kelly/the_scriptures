var __awaiter=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{u(n.next(e))}catch(e){s(e)}}function a(e){try{u(n.throw(e))}catch(e){s(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}u((n=n.apply(e,t||[])).next())}))};import*as fs from"fs";import*as Utils from"../utils.js";import*as Language from"../model/language.js";import*as Data from"../model/data.js";import*as Text from"../model/text.js";const LINE_PATH_TYPE=Text.Line.Path_Type.DEFAULT;function Read_Directory(e){return __awaiter(this,void 0,void 0,(function*(){return new Promise((function(t,i){fs.readdir(e,{withFileTypes:!0},(function(e,n){null!=e?i(e):t(n)}))}))}))}function Has_File(e){return fs.existsSync(e)}function Read_File(e){return __awaiter(this,void 0,void 0,(function*(){return new Promise((function(t,i){fs.readFile(e,"utf8",(function(e,n){null!=e?i(e):t(n)}))}))}))}function Write_File(e,t){return __awaiter(this,void 0,void 0,(function*(){return new Promise((function(i,n){fs.writeFile(e,t,"utf8",(function(e){null!=e?n(e):i()}))}))}))}function Folder_Names(e){return __awaiter(this,void 0,void 0,(function*(){const t=[],i=yield Read_Directory(e);for(let e of i)e.isDirectory()&&t.push(e.name);return t}))}function File_Names(e){return __awaiter(this,void 0,void 0,(function*(){const t=[],i=yield Read_Directory(e);for(let e of i)e.isFile()&&t.push(e.name);return t}))}class Unique_Names{constructor(){this.books=new Set,this.languages=new Set,this.versions=new Set}Add_Book(e){this.books.add(e)}Add_Language(e){this.languages.add(e)}Add_Version(e){this.versions.add(e)}Books(){return Array.from(this.books).sort()}Languages(){return Array.from(this.languages).sort()}Versions(){return Array.from(this.versions).sort()}}class Unique_Parts{constructor(){this.parts={}}Add(e){this.parts.hasOwnProperty(e)?(Utils.Assert(this.parts[e]<Number.MAX_SAFE_INTEGER,"Cannot add more of this unique part!"),this.parts[e]+=1):this.parts[e]=1}Values(){return Object.keys(this.parts).sort(function(e,t){return this.parts[t]-this.parts[e]}.bind(this))}Count(e){return Utils.Assert(this.parts.hasOwnProperty(e),"Does not have part."),this.parts[e]}}function Filter_File_Names(e){return/\.txt$/.test(e)&&!/COPY\.txt$/.test(e)}function Sorted_File_Names(e){return __awaiter(this,void 0,void 0,(function*(){return Has_File(`${e}/Order.json`)?JSON.parse(yield Read_File(`${e}/Order.json`)):(yield File_Names(e)).filter(Filter_File_Names).sort()}))}function Assert_Greek_Normalization(e,t){Utils.Assert(Language.Greek.Normalize_With_Combined_Points(Language.Greek.Normalize_With_Baked_Points(t))===t,`\n            failed to reproduce original file_text after Greek normalization\n            ${e}\n        `)}function Generate(){return __awaiter(this,void 0,void 0,(function*(){const e={tree:{books:[]},unique_book_names:[],unique_language_names:[],unique_version_names:[],unique_part_values:{}},t=new Unique_Names,i={},n="./data",o=`${n}/Books`;for(const n of(yield Folder_Names(o)).sort()){const s=`${o}/${n}`,r={name:n,languages:[]};e.tree.books.push(r),t.Add_Book(n);for(const e of(yield Folder_Names(s)).sort()){const n=`${s}/${e}`,o={name:e,versions:[]};r.languages.push(o),t.Add_Language(e),null==i[e]&&(i[e]=new Unique_Parts);for(const s of(yield Folder_Names(n)).sort()){const r=`${n}/${s}`,a={name:s,files:[]},u=new Text.Dictionary.Instance({json:yield Read_File(`${r}/Dictionary.json`)}),l=yield Sorted_File_Names(r);o.versions.push(a),t.Add_Version(s);for(const[t,n]of l.entries()){const o=`${r}/${n}`,s={name:n.replace(/\.[^.]*$/,".comp"),index:t},l=new Text.Instance({dictionary:u,value:yield Read_File(o)});a.files.push(s);for(let t=0,n=l.Line_Count();t<n;t+=1){const n=l.Line(t);for(let t=0,o=n.Macro_Part_Count(LINE_PATH_TYPE);t<o;t+=1){const o=n.Macro_Part(t,LINE_PATH_TYPE);i[e].Add(o.Value())}}}}}}e.unique_book_names=t.Books(),e.unique_language_names=t.Languages(),e.unique_version_names=t.Versions();for(const t of Object.keys(i))e.unique_part_values[t]=i[t].Values();yield Write_File(`${n}/Info.json`,JSON.stringify(e));for(const t of(yield Folder_Names(o)).sort()){const i=`${o}/${t}`;for(const t of(yield Folder_Names(i)).sort()){const n=`${i}/${t}`,o=new Data.Compressor.Instance({unique_parts:e.unique_part_values[t]});for(const e of(yield Folder_Names(n)).sort()){const t=`${n}/${e}`,i=yield Sorted_File_Names(t),s=[],r=yield Read_File(`${t}/Dictionary.json`),a=new Text.Dictionary.Instance({json:r}),u=o.Compress_Dictionary(r),l=o.Decompress_Dictionary(u);Utils.Assert(l===r,"Invalid dictionary decompression!"),yield Write_File(`${t}/${Data.Version.Dictionary.Symbol.NAME}.${Data.Version.Dictionary.Symbol.EXTENSION}`,u);for(const e of i){const i=`${t}/${e}`,n=yield Read_File(i);s.push(n),Assert_Greek_Normalization(i,n);const r=o.Compress({value:n,dictionary:a}),u=o.Decompress({value:r,dictionary:a});Utils.Assert(u===n,"Invalid decompression!"),yield Write_File(`${t}/${e.replace(/\.[^.]*$/,".comp")}`,r)}const _=s.join(Data.Version.Symbol.FILE_BREAK),d=o.Compress({value:_,dictionary:a}),c=o.Decompress({value:d,dictionary:a});Utils.Assert(c===_,"Invalid decompression!"),yield Write_File(`${t}/${Data.Version.Text.Symbol.NAME}.${Data.Version.Text.Symbol.EXTENSION}`,d)}}}}))}!function(){__awaiter(this,void 0,void 0,(function*(){yield Generate()}))}();