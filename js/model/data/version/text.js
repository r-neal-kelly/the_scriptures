var __awaiter=this&&this.__awaiter||function(t,e,s,i){return new(s||(s=Promise))((function(n,o){function r(t){try{l(i.next(t))}catch(t){o(t)}}function a(t){try{l(i.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(r,a)}l((i=i.apply(t,e||[])).next())}))};import*as Utils from"../../../utils.js";import*as Async from"../../../async.js";import*as Text from"../../text.js";import*as Version from"./instance.js";export var Symbol;!function(t){t.NAME="Text.comp",t.TITLE="Text",t.EXTENSION="comp"}(Symbol||(Symbol={}));export class Instance extends Async.Instance{constructor({version:t}){super(),this.version=t,this.path=`${t.Path()}/${Symbol.NAME}`,this.text_files=[],this.Add_Dependencies([this.Version().Language().Book().Data()])}Version(){return this.version}Name(){return Symbol.NAME}Path(){return this.path}Title(){return Symbol.TITLE}Extension(){return Symbol.EXTENSION}Text_File_Count(){return this.text_files.length}Text_File_At(t){return Utils.Assert(this.Is_Ready(),"Not ready."),Utils.Assert(t>-1,"text_file_index must be greater than -1."),Utils.Assert(t<this.Text_File_Count(),"text_file_index must be less than text_file_count."),this.text_files[t]}After_Dependencies_Are_Ready(){return __awaiter(this,void 0,void 0,(function*(){let t;const e=yield fetch(Utils.Resolve_Path(this.Path()));if(t=e.ok?yield e.text():null,null!=t){const e=(yield this.Version().Dictionary()).Text_Dictionary(),s=this.Version().Language().Book().Data().Compressor();for(const i of s.Decompress({value:t,dictionary:e}).split(Version.Symbol.FILE_BREAK))this.text_files.push(new Text.Instance({dictionary:e,value:i}))}}))}}