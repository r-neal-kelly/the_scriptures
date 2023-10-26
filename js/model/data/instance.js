var __awaiter=this&&this.__awaiter||function(e,a,s,o){return new(s||(s=Promise))((function(t,n){function r(e){try{y(o.next(e))}catch(e){n(e)}}function i(e){try{y(o.throw(e))}catch(e){n(e)}}function y(e){var a;e.done?t(e.value):(a=e.value,a instanceof s?a:new s((function(e){e(a)}))).then(r,i)}y((o=o.apply(e,a||[])).next())}))};import*as Utils from"../../utils.js";import*as Async from"../../async.js";import{Type}from"./type.js";import*as Book from"./book.js";import*as Name_Sorter from"./name_sorter.js";export class Instance extends Async.Instance{constructor(){super(),this.name="data",this.path=this.name,this.books_path=`${this.path}/Books`,this.info=null,this.books=[],this.name_sorter=new Name_Sorter.Instance,this.Add_Dependencies([])}Name(){return this.name}Path(){return this.path}Books_Path(){return this.books_path}Info(){return Utils.Assert(this.Is_Ready(),"Not ready."),Utils.Assert(null!=this.info,"info is null!"),this.info}Book(e){Utils.Assert(this.Is_Ready(),"Not ready.");for(const a of this.books)if(a.Name()===e)return a;return Utils.Assert(!1,"Invalid book_name."),this.books[0]}Book_Count(){return Utils.Assert(this.Is_Ready(),"Not ready."),this.books.length}Book_At(e){return Utils.Assert(this.Is_Ready(),"Not ready."),Utils.Assert(e>-1,"book_index must be greater than -1."),Utils.Assert(e<this.Book_Count(),"book_index must be less than book_count."),this.books[e]}Books(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.books)}Name_Sorter(){return this.name_sorter}Names(e){return Utils.Assert(this.Is_Ready(),"Not ready."),1===e.length?(Utils.Assert(null==e[0].Name(),"Unusable name.\n                A query length of 1 only requires a type."),e[0].Type()===Type.BOOKS||e[0].Type()===Type.BOOK?this.Book_Names():e[0].Type()===Type.LANGUAGES||e[0].Type()===Type.LANGUAGE?this.Language_Names():e[0].Type()===Type.VERSIONS||e[0].Type()===Type.VERSION?this.Version_Names():(Utils.Assert(!1,"Invalid type.\n                    A query length of 1 can only gather Books, Languages, or Versions."),[])):2===e.length?(Utils.Assert(null!=e[0].Name(),"Missing name.\n                A query length of 2 requires a name at index 0."),Utils.Assert(null==e[1].Name(),"Unusable name.\n                A query length of 2 only requires a type at index 1."),e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE?e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE?(Utils.Assert(!1,"Invalid type.\n                    A query length of 2 can only gather a combination of Books, Languages, or Versions.\n                    Each index in the query must have a unique type, and cannot contain repeats."),[]):this.Version_Language_Names({version_name:e[0].Name()}):this.Version_Book_Names({version_name:e[0].Name()}):this.Language_Version_Names({language_name:e[0].Name()}):this.Language_Book_Names({language_name:e[0].Name()}):this.Book_Version_Names({book_name:e[0].Name()}):this.Book_Language_Names({book_name:e[0].Name()})):3===e.length?(Utils.Assert(null!=e[0].Name()&&null!=e[1].Name(),"Missing name.\n                A query length of 3 requires a name for indices 0 and 1."),Utils.Assert(null==e[2].Name(),"Unusable name.\n                A query length of 3 only requires a type at index 2."),e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?(Utils.Assert(!1,"Invalid type.\n                    A query length of 3 can only gather a combination of Books, Languages, or Versions.\n                    Each index in the query must have a unique type, and cannot contain repeats."),[]):this.Version_Language_Book_Names({version_name:e[0].Name(),language_name:e[1].Name()}):this.Version_Book_Language_Names({version_name:e[0].Name(),book_name:e[1].Name()}):this.Language_Version_Book_Names({language_name:e[0].Name(),version_name:e[1].Name()}):this.Language_Book_Version_Names({language_name:e[0].Name(),book_name:e[1].Name()}):this.Book_Version_Language_Names({book_name:e[0].Name(),version_name:e[1].Name()}):this.Book_Language_Version_Names({book_name:e[0].Name(),language_name:e[1].Name()})):4===e.length?(Utils.Assert(null!=e[0].Name()&&null!=e[1].Name()&&null!=e[2].Name(),"Missing name.\n                A query length of 4 must have a name for indices 0, 1, and 2."),Utils.Assert(null==e[3].Name(),"Unusable name.\n                A query length of 4 only requires a type at index 3."),Utils.Assert(e[3].Type()===Type.FILES||e[3].Type()===Type.FILE,"Invalid type.\n                A query length of 4 requires index 3 to have a type indicated Files."),e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.BOOKS&&e[0].Type()!==Type.BOOK||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.VERSIONS&&e[2].Type()!==Type.VERSION?e[0].Type()!==Type.LANGUAGES&&e[0].Type()!==Type.LANGUAGE||e[1].Type()!==Type.VERSIONS&&e[1].Type()!==Type.VERSION||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.BOOKS&&e[1].Type()!==Type.BOOK||e[2].Type()!==Type.LANGUAGES&&e[2].Type()!==Type.LANGUAGE?e[0].Type()!==Type.VERSIONS&&e[0].Type()!==Type.VERSION||e[1].Type()!==Type.LANGUAGES&&e[1].Type()!==Type.LANGUAGE||e[2].Type()!==Type.BOOKS&&e[2].Type()!==Type.BOOK?(Utils.Assert(!1,"Invalid type.\n                    A query length of 4 must have a combination of Books, Languages, Versions, and Files.\n                    Each index in the query must have a unique type, and cannot contain repeats.\n                    The last index must indicate Files."),[]):this.File_Names({book_name:e[2].Name(),language_name:e[1].Name(),version_name:e[0].Name()}):this.File_Names({book_name:e[1].Name(),language_name:e[2].Name(),version_name:e[0].Name()}):this.File_Names({book_name:e[2].Name(),language_name:e[0].Name(),version_name:e[1].Name()}):this.File_Names({book_name:e[1].Name(),language_name:e[0].Name(),version_name:e[2].Name()}):this.File_Names({book_name:e[0].Name(),language_name:e[2].Name(),version_name:e[1].Name()}):this.File_Names({book_name:e[0].Name(),language_name:e[1].Name(),version_name:e[2].Name()})):(Utils.Assert(!1,"Invalid query length.\n                A query must have a length from 1 to 4."),[])}Book_Names(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.Info().unique_book_names)}Book_Language_Names({book_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const s of this.Books())if(s.Name()===e){for(const e of s.Languages())a.add(e.Name());break}return this.Name_Sorter().With_Set(Name_Sorter.Type.LANGUAGES,a)}Book_Version_Names({book_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const s of this.Books())if(s.Name()===e){for(const e of s.Languages())for(const s of e.Versions())a.add(s.Name());break}return this.Name_Sorter().With_Set(Name_Sorter.Type.VERSIONS,a)}Book_Language_Version_Names({book_name:e,language_name:a}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const o of this.Books())if(o.Name()===e){for(const e of o.Languages())if(e.Name()===a){for(const a of e.Versions())s.add(a.Name());break}break}return this.Name_Sorter().With_Set(Name_Sorter.Type.VERSIONS,s)}Book_Version_Language_Names({book_name:e,version_name:a}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const o of this.Books())if(o.Name()===e){for(const e of o.Languages())for(const o of e.Versions())if(o.Name()===a){s.add(e.Name());break}break}return this.Name_Sorter().With_Set(Name_Sorter.Type.LANGUAGES,s)}Language_Names(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.Info().unique_language_names)}Language_Book_Names({language_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const s of this.Books())for(const o of s.Languages())if(o.Name()===e){a.add(s.Name());break}return this.Name_Sorter().With_Set(Name_Sorter.Type.BOOKS,a)}Language_Version_Names({language_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const s of this.Books())for(const o of s.Languages())if(o.Name()===e){for(const e of o.Versions())a.add(e.Name());break}return this.Name_Sorter().With_Set(Name_Sorter.Type.VERSIONS,a)}Language_Book_Version_Names({language_name:e,book_name:a}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const o of this.Books())if(o.Name()===a){for(const a of o.Languages())if(a.Name()===e){for(const e of a.Versions())s.add(e.Name());break}break}return this.Name_Sorter().With_Set(Name_Sorter.Type.VERSIONS,s)}Language_Version_Book_Names({language_name:e,version_name:a}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const o of this.Books())for(const t of o.Languages())if(t.Name()===e){for(const e of t.Versions())if(e.Name()===a){s.add(o.Name());break}break}return this.Name_Sorter().With_Set(Name_Sorter.Type.BOOKS,s)}Version_Names(){return Utils.Assert(this.Is_Ready(),"Not ready."),Array.from(this.Info().unique_version_names)}Version_Book_Names({version_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const s of this.Books())for(const o of s.Languages())for(const t of o.Versions())if(t.Name()===e){a.add(s.Name());break}return this.Name_Sorter().With_Set(Name_Sorter.Type.BOOKS,a)}Version_Language_Names({version_name:e}){Utils.Assert(this.Is_Ready(),"Not ready.");const a=new Set;for(const s of this.Books())for(const o of s.Languages())for(const s of o.Versions())if(s.Name()===e){a.add(o.Name());break}return this.Name_Sorter().With_Set(Name_Sorter.Type.LANGUAGES,a)}Version_Book_Language_Names({version_name:e,book_name:a}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const o of this.Books())if(o.Name()===a){for(const a of o.Languages())for(const o of a.Versions())if(o.Name()===e){s.add(a.Name());break}break}return this.Name_Sorter().With_Set(Name_Sorter.Type.LANGUAGES,s)}Version_Language_Book_Names({version_name:e,language_name:a}){Utils.Assert(this.Is_Ready(),"Not ready.");const s=new Set;for(const o of this.Books())for(const t of o.Languages())if(t.Name()===a){for(const a of t.Versions())if(a.Name()===e){s.add(o.Name());break}break}return this.Name_Sorter().With_Set(Name_Sorter.Type.BOOKS,s)}Versions({book_names:e=null,language_names:a=null,version_names:s=null}){Utils.Assert(this.Is_Ready(),"Not ready.");const o=[];null==e&&(e=this.Book_Names()),null==a&&(a=this.Language_Names()),null==s&&(s=this.Version_Names());for(const t of this.Books())if(e.includes(t.Name()))for(const e of t.Languages())if(a.includes(e.Name()))for(const a of e.Versions())s.includes(a.Name())&&o.push(a);return o}Files({book_name:e,language_name:a,version_name:s}){return Utils.Assert(this.Is_Ready(),"Not ready."),this.Book(e).Language(a).Version(s).Files()}File({book_name:e,language_name:a,version_name:s,file_name:o}){return Utils.Assert(this.Is_Ready(),"Not ready."),this.Book(e).Language(a).Version(s).File(o)}File_Names({book_name:e,language_name:a,version_name:s}){return Utils.Assert(this.Is_Ready(),"Not ready."),this.Files({book_name:e,language_name:a,version_name:s}).map((function(e){return e.Name()}))}After_Dependencies_Are_Ready(){return __awaiter(this,void 0,void 0,(function*(){const e=yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));if(e.ok){this.info=JSON.parse(yield e.text());for(const e of this.info.tree.books)this.books.push(new Book.Instance({data:this,branch:e}))}else this.info={tree:{books:[]},unique_book_names:[],unique_language_names:[],unique_version_names:[],total_unit_count:0,total_point_count:0,total_letter_count:0,total_marker_count:0,total_meta_letter_count:0,total_word_count:0,total_break_count:0,total_meta_word_count:0,total_part_count:0,total_line_count:0,total_file_count:0,total_book_count:0}}))}}const SINGLETON=new Instance;export function Singleton(){return SINGLETON}