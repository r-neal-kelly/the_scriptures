var __awaiter=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))((function(r,o){function s(t){try{c(i.next(t))}catch(t){o(t)}}function a(t){try{c(i.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,a)}c((i=i.apply(t,e||[])).next())}))};import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({commander:t}){super(),this.commander=t,this.Add_Dependencies([])}Commander(){return this.commander}Symbol(){return"<<"}Can_Activate(){const t=this.Commander().Browser().Body().Selector();return t.Has_Files()&&t.Files().Item_Count()>0}Activate(){return __awaiter(this,void 0,void 0,(function*(){0;const t=this.Commander().Browser().Body().Selector().Files(),e=t.Item_Count();if(t.Has_Selected_Item()){const n=t.Selected_Item();n.Index()>0?yield t.Item_At_Index(n.Index()-1).Select():yield t.Item_At_Index(e-1).Select()}else yield t.Item_At_Index(e-1).Select()}))}}