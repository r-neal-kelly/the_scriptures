var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(s,o){function r(e){try{a(i.next(e))}catch(e){o(e)}}function _(e){try{a(i.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,_)}a((i=i.apply(e,t||[])).next())}))};import*as Utils from"../../../utils.js";import*as Event from"../../../event.js";import*as Model from"../../../model/layout/window.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";import*as Banner from"./banner.js";export class Instance extends Entity.Instance{constructor({model:e,wall:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),this.Refresh_After_Has_Model(),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.WINDOW_ACTIVATE,this.ID()),event_handler:this.On_Window_Activate,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.WINDOW_ACTIVATE,this.ID()),event_handler:this.After_Window_Activate,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.WINDOW_DEACTIVATE,this.ID()),event_handler:this.On_Window_Deactivate,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.WINDOW_TOGGLE_MAXIMIZATION,this.ID()),event_handler:this.On_Window_Toggle_Maximization,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.WINDOW_TOGGLE_MAXIMIZATION,this.ID()),event_handler:this.After_Window_Toggle_Maximization,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.WINDOW_TOGGLE_MINIMIZATION,this.ID()),event_handler:this.On_Window_Toggle_Minimization,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.WINDOW_TOGGLE_MINIMIZATION,this.ID()),event_handler:this.After_Window_Toggle_Minimization,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.WINDOW_CLOSE,this.ID()),event_handler:this.On_Window_Close,event_priority:0})]}On_Refresh(){const e=this.Model();e.Is_Ready()&&(e.Is_Visible()?this.Has_Banner()&&this.Has_View()||(this.Abort_All_Children(),this.Element().textContent="",new Banner.Instance({model:()=>this.Model().Banner(),window:this}),new(this.Model().Program().View_Class())({parent:this,model:()=>this.Model().Program().Model_Instance(),event_grid_hook:()=>this.ID()})):this.Skip_Children())}On_Reclass(){const e=this.Model(),t=[];return t.push("Window"),e.Is_Minimized()?t.push("Minimized_Window"):e.Is_Maximized()&&t.push("Maximized_Window"),t}On_Restyle(){const e=this.Model();if(e.Is_Visible()){if(e.Is_Maximized()){const t=e.Render_Type(),n=e.Render_Limit(),i="grid-column",s="grid-row";return`\n                    ${t===Model.Render_Type.LANDSCAPE?i:s}: span ${n};\n                `}return""}return""}On_Click(){return __awaiter(this,void 0,void 0,(function*(){this.Is_Alive()&&(yield this.Send(new Event.Info({affix:Events.WINDOW_ACTIVATE,suffixes:[this.ID(),this.Wall().ID(),this.Wall().Layout().ID()],type:Event.Type.EXCLUSIVE,data:{}})))}))}On_Window_Activate(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Activate()}))}After_Window_Activate(){return __awaiter(this,void 0,void 0,(function*(){this.Move_Into_View()}))}On_Window_Deactivate(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Deactivate()}))}On_Window_Toggle_Maximization(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Toggle_Maximization()}))}After_Window_Toggle_Maximization(){return __awaiter(this,void 0,void 0,(function*(){this.Reclass()}))}On_Window_Toggle_Minimization(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Toggle_Minimization()}))}After_Window_Toggle_Minimization(){return __awaiter(this,void 0,void 0,(function*(){this.Reclass()}))}On_Window_Close(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Kill()}))}Refresh_After_Has_Model(){return __awaiter(this,void 0,void 0,(function*(){for(yield Utils.Wait_Milliseconds(1);this.Is_Alive()&&!this.Model().Is_Ready();){const e=this.Element();"Loading..."===e.textContent?e.textContent="Loading.":"Loading."===e.textContent?e.textContent="Loading..":e.textContent="Loading...",yield Utils.Wait_Milliseconds(200)}this.Wall().Layout().Refresh()}))}Model(){return this.model()}__Set_Model__(e){this.model=e}Wall(){return this.Parent()}Has_Banner(){return this.Has_Child(0)&&this.Child(0)instanceof Banner.Instance}Banner(){return 0,this.Child(0)}Has_View(){return this.Has_Child(1)&&this.Child(1)instanceof this.Model().Program().View_Class()}View(){return 0,this.Child(1)}Move_Into_View(){0,0;const e=this.Model().Render_Type(),t=this.Parent().Element(),n=this.Element(),i=t.getBoundingClientRect(),s=n.getBoundingClientRect();e===Model.Render_Type.LANDSCAPE?t.scrollTop+=s.y-i.y:t.scrollLeft+=s.x-i.x}}