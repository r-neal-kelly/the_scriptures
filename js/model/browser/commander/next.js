var __awaiter=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))((function(s,o){function r(t){try{c(i.next(t))}catch(t){o(t)}}function a(t){try{c(i.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,a)}c((i=i.apply(t,e||[])).next())}))};import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({commander:t}){super(),this.commander=t,this.Add_Dependencies([])}Commander(){return this.commander}Symbol(){return">>"}Can_Activate(){const t=this.Commander().Browser().Body().Selector().Slots();return t.Has_Files()&&t.Files().Items().Count()>0}Activate(){return __awaiter(this,void 0,void 0,(function*(){Utils.Assert(this.Can_Activate(),"Cannot be activated right now.");const t=this.Commander().Browser().Body().Selector().Slots().Files().Items(),e=t.Count();if(t.Has_Selected()){const n=t.Selected();n.Index()<e-1?yield t.At(n.Index()+1).Select():yield t.At(0).Select()}else yield t.At(0).Select()}))}}