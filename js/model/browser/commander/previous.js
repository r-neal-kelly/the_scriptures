var __awaiter=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))((function(r,i){function a(t){try{s(o.next(t))}catch(t){i(t)}}function c(t){try{s(o.throw(t))}catch(t){i(t)}}function s(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((o=o.apply(t,e||[])).next())}))};import*as Utils from"../../../utils.js";export class Instance{constructor({commander:t}){this.commander=t}Commander(){return this.commander}Symbol(){return"<<"}Can_Activate(){const t=this.Commander().Browser().Body().Selector();return t.Has_Files()&&t.Files().Item_Count()>0}Activate(){return __awaiter(this,void 0,void 0,(function*(){0;const t=this.Commander().Browser().Body().Selector().Files(),e=t.Item_Count();if(t.Has_Selected_Item()){const n=t.Selected_Item();n.Index()>0?t.Item_At_Index(n.Index()-1).Select():t.Item_At_Index(e-1).Select()}else t.Item_At_Index(e-1).Select()}))}}