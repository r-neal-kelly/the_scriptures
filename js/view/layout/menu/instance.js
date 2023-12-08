var __awaiter=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(s,i){function o(e){try{a(r.next(e))}catch(e){i(e)}}function _(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var n;e.done?s(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(o,_)}a((r=r.apply(e,n||[])).next())}))};import*as Utils from"../../../utils.js";import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";import*as Open_Browser from"./open_browser.js";import*as Open_Finder from"./open_finder.js";export class Instance extends Entity.Instance{constructor({model:e,desktop:n}){super({element:"div",parent:n,event_grid:n.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.MENU_OPEN,this.Desktop().Layout().ID()),event_handler:this.On_Taskbar_Menu_Open,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.MENU_OPEN,this.Desktop().Layout().ID()),event_handler:this.After_Taskbar_Menu_Open,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.MENU_CLOSE,this.Desktop().Layout().ID()),event_handler:this.On_Taskbar_Menu_Close,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.MENU_CLOSE,this.Desktop().Layout().ID()),event_handler:this.After_Taskbar_Menu_Close,event_priority:0})]}On_Refresh(){this.Has_Open_Browser()&&this.Has_Open_Finder()||(this.Abort_All_Children(),new Open_Browser.Instance({model:()=>this.Model().Open_Browser(),menu:this}),new Open_Finder.Instance({model:()=>this.Model().Open_Finder(),menu:this}))}On_Reclass(){const e=this.Model(),n=[];return n.push("Menu"),e.Is_Open()?n.push("Open_Menu"):n.push("Closed_Menu"),n}On_Click(e){return __awaiter(this,void 0,void 0,(function*(){e.stopPropagation()}))}On_Taskbar_Menu_Open(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Open()}))}After_Taskbar_Menu_Open(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}On_Taskbar_Menu_Close(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Close()}))}After_Taskbar_Menu_Close(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}Model(){return this.model()}Desktop(){return this.Parent()}Has_Open_Browser(){return this.Has_Child(0)&&this.Child(0)instanceof Open_Browser.Instance}Open_Browser(){return 0,this.Child(0)}Has_Open_Finder(){return this.Has_Child(1)&&this.Child(1)instanceof Open_Finder.Instance}Open_Finder(){return 0,this.Child(1)}Animate_Button(e){return __awaiter(this,void 0,void 0,(function*(){yield e.Animate([{offset:0,backgroundColor:"black",color:"white"},{offset:.5,backgroundColor:"white",color:"black"},{offset:1,backgroundColor:"black",color:"white"}],{duration:200,easing:"ease"})}))}}