var __awaiter=this&&this.__awaiter||function(e,t,n,a){return new(n||(n=Promise))((function(i,o){function r(e){try{_(a.next(e))}catch(e){o(e)}}function s(e){try{_(a.throw(e))}catch(e){o(e)}}function _(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,s)}_((a=a.apply(e,t||[])).next())}))};import*as Language from"../model/language.js";import*as Languages from"../model/languages.js";export class Instance{On_Change_Layout(e,t){return __awaiter(this,void 0,void 0,(function*(){const n=null!=t?Languages.Singleton().Default_Global_Font_Styles(t.Language_Name()):Languages.Singleton().Default_Global_Font_Styles(Language.Name.ENGLISH);for(const t of Object.entries(n))e.style[t[0]]=t[1]}))}On_Key_Down(e){return __awaiter(this,void 0,void 0,(function*(){}))}On_Key_Up(e){return __awaiter(this,void 0,void 0,(function*(){}))}On_Insert({div:e,data:t,range:n}){return __awaiter(this,void 0,void 0,(function*(){const e=document.createTextNode(t);n.deleteContents(),n.insertNode(e);const a=document.getSelection();a&&a.collapse(e,e.nodeValue.length),null!=e.parentElement&&e.parentElement.scrollIntoView({behavior:"instant",block:"nearest",inline:"nearest"})}))}On_Paste({div:e,data:t,range:n}){return __awaiter(this,void 0,void 0,(function*(){yield this.On_Insert({div:e,data:t,range:n})}))}On_Delete({div:e,range:t}){return __awaiter(this,void 0,void 0,(function*(){t.deleteContents()}))}After_Insert_Or_Paste_Or_Delete(){return __awaiter(this,void 0,void 0,(function*(){}))}}