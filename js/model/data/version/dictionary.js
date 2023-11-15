var __awaiter=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(s,r){function o(t){try{c(n.next(t))}catch(t){r(t)}}function a(t){try{c(n.throw(t))}catch(t){r(t)}}function c(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,a)}c((n=n.apply(t,e||[])).next())}))};import*as Utils from"../../../utils.js";import*as Async from"../../../async.js";import*as Text from"../../text.js";export var Symbol;!function(t){t.NAME="Dictionary",t.EXTENSION="comp"}(Symbol||(Symbol={}));export class Instance extends Async.Instance{constructor({version:t}){super(),this.version=t,this.path=`${t.Path()}/${Symbol.NAME}.${Symbol.EXTENSION}`,this.text_dictionary=null,this.Add_Dependencies([this.Version()])}Version(){return this.version}Name(){return Symbol.NAME}Path(){return this.path}Extension(){return Symbol.EXTENSION}Text_Dictionary(){return   this.text_dictionary}After_Dependencies_Are_Ready(){return __awaiter(this,void 0,void 0,(function*(){let t;const e=yield fetch(Utils.Resolve_Path(this.Path()));if(e.ok){t=(yield this.Version().Compressor()).Decompress_Dictionary({dictionary_value:yield e.text()})}else t=null;this.text_dictionary=new Text.Dictionary.Instance({json:t})}))}}