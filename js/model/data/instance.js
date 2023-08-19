var __awaiter=this&&this.__awaiter||function(e,s,a,o){return new(a||(a=Promise))((function(n,t){function r(e){try{y(o.next(e))}catch(e){t(e)}}function i(e){try{y(o.throw(e))}catch(e){t(e)}}function y(e){var s;e.done?n(e.value):(s=e.value,s instanceof a?s:new a((function(e){e(s)}))).then(r,i)}y((o=o.apply(e,s||[])).next())}))};import*as Utils from"../../utils.js";import*as Async from"../../async.js";import{Type}from"./type.js";import*as Compressor from"./compressor.js";import*as Book from"./book.js";export class Instance extends Async.Instance{constructor(){super(),this.name="data",this.path=this.name,this.books_path=`${this.path}/Books`,this.info=null,this.books=[],this.compressors={},this.Add_Dependencies([])}Name(){return this.name}Path(){return this.path}Books_Path(){return this.books_path}Info(){return Utils.Assert(this.Is_Ready(),"Not ready."),Utils.Assert(null!=this.info,"info is null!"),this.info}Book(e){Utils.Assert(this.Is_Ready(),"Not ready.");for(const s of this.books)if(s.Name()===e)return s;return Utils.Assert(!1,"Invalid book_name."),this.books[0]}Book_Count(){return Utils.Assert(this.Is_Ready(),"Not ready."),this.books.length}Book_At(e){return Utils.Assert(this.Is_Ready(),"Not ready."),Utils.Assert(e>-1,"book_index must be greater than -1."),Utils.Assert(e<this.Book_Count(),"book_index must be less than book_count."),this.books[e]}Books(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.books)}Compressor(e){return Utils.Assert(this.Is_Ready(),"Not ready."),Utils.Assert(null!=this.compressors[e],`Doesn't have compressor for language ${e}`),this.compressors[e]}Names(e){return Utils.Assert(this.Is_Ready(),"Not ready."),1===e.length?(Utils.Assert(null==e[0].Name(),"Unusable name.\n                A query length of 1 only requires a type."),e[0].Type()===Type.BOOKS||e[0].Type()===Type.BOOK?this.Book_Names():e[0].Type()===Type.LANGUAGES||e[0].Type()===Type.LANGUAGE?this.Language_Names():e[0].Type()===Type.VERSIONS||e[0].Type()===Type.VERSION?this.Version_Names():(Utils.Assert(!1,"Invalid type.\n                    A query length of 1 can only gather Books, Languages, or Versions."),[])):2===e.length?(Utils.Assert(null!=e[0].Name(),"Missing name.\n                A query length of 2 requires a name at index 0."),Utils.Assert(null==e[1].Name(),"Unusable name.\n                A query length of 2 only requires a type at index 1."),e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE?e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE?(Utils.Assert(!1,"Invalid type.\n                    A query length of 2 can only gather a combination of Books, Languages, or Versions.\n                    Each index in the query must have a unique type, and cannot contain repeats."),[]):this.Version_Language_Names({version_name:e[0].Name()}):this.Version_Book_Names({version_name:e[0].Name()}):this.Language_Version_Names({language_name:e[0].Name()}):this.Language_Book_Names({language_name:e[0].Name()}):this.Book_Version_Names({book_name:e[0].Name()}):this.Book_Language_Names({book_name:e[0].Name()})):3===e.length?(Utils.Assert(null!=e[0].Name()&&null!=e[1].Name(),"Missing name.\n                A query length of 3 requires a name for indices 0 and 1."),Utils.Assert(null==e[2].Name(),"Unusable name.\n                A query length of 3 only requires a type at index 2."),e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?(Utils.Assert(!1,"Invalid type.\n                    A query length of 3 can only gather a combination of Books, Languages, or Versions.\n                    Each index in the query must have a unique type, and cannot contain repeats."),[]):this.Version_Language_Book_Names({version_name:e[0].Name(),language_name:e[1].Name()}):this.Version_Book_Language_Names({version_name:e[0].Name(),book_name:e[1].Name()}):this.Language_Version_Book_Names({language_name:e[0].Name(),version_name:e[1].Name()}):this.Language_Book_Version_Names({language_name:e[0].Name(),book_name:e[1].Name()}):this.Book_Version_Language_Names({book_name:e[0].Name(),version_name:e[1].Name()}):this.Book_Language_Version_Names({book_name:e[0].Name(),language_name:e[1].Name()})):4===e.length?(Utils.Assert(null!=e[0].Name()&&null!=e[1].Name()&&null!=e[2].Name(),"Missing name.\n                A query length of 4 must have a name for indices 0, 1, and 2."),Utils.Assert(null==e[3].Name(),"Unusable name.\n                A query length of 4 only requires a type at index 3."),Utils.Assert(e[3].Type()===Type.FILES||e[3].Type()===Type.FILE,"Invalid type.\n                A query length of 4 requires index 3 to have a type indicated Files."),e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?(Utils.Assert(!1,"Invalid type.\n                    A query length of 4 must have a combination of Books, Languages, Versions, and Files.\n                    Each index in the query must have a unique type, and cannot contain repeats.\n                    The last index must indicate Files."),[]):this.File_Names({book_name:e[2].Name(),language_name:e[1].Name(),version_name:e[0].Name()}):this.File_Names({book_name:e[1].Name(),language_name:e[2].Name(),version_name:e[0].Name()}):this.File_Names({book_name:e[2].Name(),language_name:e[0].Name(),version_name:e[1].Name()}):this.File_Names({book_name:e[1].Name(),language_name:e[0].Name(),version_name:e[2].Name()}):this.File_Names({book_name:e[0].Name(),language_name:e[2].Name(),version_name:e[1].Name()}):this.File_Names({book_name:e[0].Name(),language_name:e[1].Name(),version_name:e[2].Name()})):(Utils.Assert(!1,"Invalid query length.\n                A query must have a length from 1 to 4."),[])}Book_Names(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.Info().unique_book_names)}Book_Language_Names({book_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const a of this.Books())if(a.Name()===e){for(const e of a.Languages())s.add(e.Name());break}return Array.from(s).sort()}Book_Version_Names({book_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const a of this.Books())if(a.Name()===e){for(const e of a.Languages())for(const a of e.Versions())s.add(a.Name());break}return Array.from(s).sort()}Book_Language_Version_Names({book_name:e,language_name:s}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const o of this.Books())if(o.Name()===e){for(const e of o.Languages())if(e.Name()===s){for(const s of e.Versions())a.add(s.Name());break}break}return Array.from(a).sort()}Book_Version_Language_Names({book_name:e,version_name:s}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const o of this.Books())if(o.Name()===e){for(const e of o.Languages())for(const o of e.Versions())if(o.Name()===s){a.add(e.Name());break}break}return Array.from(a).sort()}Language_Names(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.Info().unique_language_names)}Language_Book_Names({language_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const a of this.Books())for(const o of a.Languages())if(o.Name()===e){s.add(a.Name());break}return Array.from(s).sort()}Language_Version_Names({language_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const a of this.Books())for(const o of a.Languages())if(o.Name()===e){for(const e of o.Versions())s.add(e.Name());break}return Array.from(s).sort()}Language_Book_Version_Names({language_name:e,book_name:s}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const o of this.Books())if(o.Name()===s){for(const s of o.Languages())if(s.Name()===e){for(const e of s.Versions())a.add(e.Name());break}break}return Array.from(a).sort()}Language_Version_Book_Names({language_name:e,version_name:s}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const o of this.Books())for(const n of o.Languages())if(n.Name()===e){for(const e of n.Versions())if(e.Name()===s){a.add(o.Name());break}break}return Array.from(a).sort()}Version_Names(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.Info().unique_version_names)}Version_Book_Names({version_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const a of this.Books())for(const o of a.Languages())for(const n of o.Versions())if(n.Name()===e){s.add(a.Name());break}return Array.from(s).sort()}Version_Language_Names({version_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const a of this.Books())for(const o of a.Languages())for(const a of o.Versions())if(a.Name()===e){s.add(o.Name());break}return Array.from(s).sort()}Version_Book_Language_Names({version_name:e,book_name:s}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const o of this.Books())if(o.Name()===s){for(const s of o.Languages())for(const o of s.Versions())if(o.Name()===e){a.add(s.Name());break}break}return Array.from(a).sort()}Version_Language_Book_Names({version_name:e,language_name:s}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const o of this.Books())for(const n of o.Languages())if(n.Name()===s){for(const s of n.Versions())if(s.Name()===e){a.add(o.Name());break}break}return Array.from(a).sort()}Versions({book_names:e=null,language_names:s=null,version_names:a=null}){Utils.Assert(this.Is_Ready(),"Not ready.");const o=[];null==e&&(e=this.Book_Names()),null==s&&(s=this.Language_Names()),null==a&&(a=this.Version_Names());for(const n of this.Books())if(e.includes(n.Name()))for(const e of n.Languages())if(s.includes(e.Name()))for(const s of e.Versions())a.includes(s.Name())&&o.push(s);return o}Files({book_name:e,language_name:s,version_name:a}){return Utils.Assert(this.Is_Ready(),"Not ready."),this.Book(e).Language(s).Version(a).Files()}File({book_name:e,language_name:s,version_name:a,file_name:o}){return Utils.Assert(this.Is_Ready(),"Not ready."),this.Book(e).Language(s).Version(a).File(o)}File_Names({book_name:e,language_name:s,version_name:a}){return Utils.Assert(this.Is_Ready(),"Not ready."),this.Files({book_name:e,language_name:s,version_name:a}).map((function(e){return e.Name()}))}After_Dependencies_Are_Ready(){return __awaiter(this,void 0,void 0,(function*(){const e=yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));if(e.ok){this.info=JSON.parse(yield e.text());for(const e of this.info.tree.books)this.books.push(new Book.Instance({data:this,branch:e}));for(const e of Object.keys(this.info.unique_part_values))this.compressors[e]=new Compressor.Instance({unique_parts:this.info.unique_part_values[e]})}else this.info={tree:{books:[]},unique_book_names:[],unique_language_names:[],unique_version_names:[],unique_part_values:{},total_unit_count:0,total_point_count:0,total_letter_count:0,total_marker_count:0,total_meta_letter_count:0,total_word_count:0,total_break_count:0,total_meta_word_count:0,total_part_count:0,total_line_count:0,total_file_count:0,total_book_count:0}}))}}const SINGLETON=new Instance;export function Singleton(){return SINGLETON}