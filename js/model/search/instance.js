var __awaiter=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(i,a){function o(t){try{c(r.next(t))}catch(t){a(t)}}function s(t){try{c(r.throw(t))}catch(t){a(t)}}function c(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,s)}c((r=r.apply(t,e||[])).next())}))};import*as Entity from"../entity.js";import*as Data from"../data.js";import*as Text from"../text.js";import*as Executor from"./executor.js";export class Instance extends Entity.Instance{constructor(){super(),this.executor=new Executor.Instance,this.Add_Dependencies([Data.Singleton()])}Value(t,e,n){return this.Text(new Text.Instance({dictionary:e,value:t}),n)}Text(t,e){return this.executor.Execute(e,t)}Data_File(t,e){return __awaiter(this,void 0,void 0,(function*(){return this.Text(yield t.Text(),e)}))}}