var __awaiter=this&&this.__awaiter||function(t,n,i,o){return new(i||(i=Promise))((function(a,e){function r(t){try{c(o.next(t))}catch(t){e(t)}}function s(t){try{c(o.throw(t))}catch(t){e(t)}}function c(t){var n;t.done?a(t.value):(n=t.value,n instanceof i?n:new i((function(t){t(n)}))).then(r,s)}c((o=o.apply(t,n||[])).next())}))};import*as Button from"./button.js";export class Instance extends Button.Instance{Symbol(){return this.Commands().Bar().Window().Is_Maximized()?"v":"^"}Click(){return __awaiter(this,void 0,void 0,(function*(){this.Commands().Bar().Window().Toggle_Maximization()}))}}