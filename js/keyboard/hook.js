var __awaiter=this&&this.__awaiter||function(t,e,n,a){return new(n||(n=Promise))((function(o,i){function r(t){try{u(a.next(t))}catch(t){i(t)}}function _(t){try{u(a.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,_)}u((a=a.apply(t,e||[])).next())}))};import*as Language from"../model/language.js";import*as Languages from"../model/languages.js";export class Instance{On_Change_Layout(t,e){return __awaiter(this,void 0,void 0,(function*(){const n=null!=e?Languages.Singleton().Default_Global_Font_Styles(e.Language_Name()):Languages.Singleton().Default_Global_Font_Styles(Language.Name.ENGLISH);for(const e of Object.entries(n))t.style[e[0]]=e[1]}))}On_Key_Down(t){return __awaiter(this,void 0,void 0,(function*(){}))}On_Key_Up(t){return __awaiter(this,void 0,void 0,(function*(){}))}On_Insert({div:t,data:e,range:n}){return __awaiter(this,void 0,void 0,(function*(){const t=document.createTextNode(e);n.deleteContents(),n.insertNode(t);const a=document.getSelection();a&&a.collapse(t,t.nodeValue.length)}))}On_Paste(t){return __awaiter(this,void 0,void 0,(function*(){}))}On_Delete(t){return __awaiter(this,void 0,void 0,(function*(){}))}After_Insert_Or_Paste_Or_Delete(){return __awaiter(this,void 0,void 0,(function*(){}))}}