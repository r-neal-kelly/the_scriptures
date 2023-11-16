var __awaiter=this&&this.__awaiter||function(e,n,t,i){return new(t||(t=Promise))((function(r,s){function o(e){try{a(i.next(e))}catch(e){s(e)}}function d(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(o,d)}a((i=i.apply(e,n||[])).next())}))};import*as Utils from"../../utils.js";import*as Event from"../../event.js";import*as Events from"../events.js";import*as Entity from"../entity.js";import*as Commander from"./commander.js";import*as Body from"./body.js";export class Instance extends Entity.Instance{constructor({root:e,model:n}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=n,this.Live()}On_Life(){return this.Add_This_CSS("\n                .Finder {\n                    display: grid;\n                    grid-template-rows: auto 1fr;\n                    grid-template-columns: 1fr;\n                    justify-content: start;\n\n                    width: 100%;\n                    height: 100%;\n\n                    overflow-x: hidden;\n                    overflow-y: hidden;\n\n                    color: white;\n                }\n            "),this.Add_Children_CSS("\n                .Invisible {\n                    display: none;\n                }\n            "),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.FINDER_BODY_EXPRESSION_ENTER,this.ID()),event_handler:this.On_Finder_Body_Expression_Enter,event_priority:10}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_TOGGLE,this.ID()),event_handler:this.After_Selector_Toggle,event_priority:0})]}On_Refresh(){this.Has_Commander()&&this.Has_Body()||(this.Abort_All_Children(),new Commander.Instance({finder:this,model:()=>this.Model().Commander()}),new Body.Instance({finder:this,model:()=>this.Model().Body()}))}On_Reclass(){return["Finder"]}On_Finder_Body_Expression_Enter(){return __awaiter(this,void 0,void 0,(function*(){yield this.Send(new Event.Info({affix:Events.WINDOW_REFRESH_TITLE,suffixes:[this.ID()],type:Event.Type.EXCLUSIVE,data:{}}))}))}After_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}Model(){return this.model()}Root(){return this.Parent()}Has_Commander(){return this.Has_Child(0)&&this.Child(0)instanceof Commander.Instance}Commander(){return 0,this.Child(0)}Has_Body(){return this.Has_Child(1)&&this.Child(1)instanceof Body.Instance}Body(){return 0,this.Child(1)}}