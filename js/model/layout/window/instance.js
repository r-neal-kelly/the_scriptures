var __awaiter=this&&this.__awaiter||function(t,i,s,e){return new(s||(s=Promise))((function(a,l){function n(t){try{o(e.next(t))}catch(t){l(t)}}function _(t){try{o(e.throw(t))}catch(t){l(t)}}function o(t){var i;t.done?a(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(n,_)}o((e=e.apply(t,i||[])).next())}))};import*as Utils from"../../../utils.js";import*as Async from"../../../async.js";import*as Unique_ID from"../../../unique_id.js";import{State}from"./state.js";import*as Banner from"./banner.js";export{Render_Type}from"../wall/render_type.js";export class Instance extends Async.Instance{constructor({wall:t,program:i}){super(),this.id=Unique_ID.New(),this.wall=t,this.state=State._NONE_,this.program=i,this.banner=new Banner.Instance({window:this}),this.Add_Dependencies([this.program])}ID(){return this.id}Is_In_Wall(){return 0,null!=this.wall}Maybe_Wall(){return 0,this.wall}Some_Wall(){return 0,0,this.wall}Move_To_Wall(t){0,this.Is_In_Wall()&&this.Remove_From_Wall(),null!=t&&this.Add_To_Wall(t)}Add_To_Wall(t){0,0,t.__Add_Window__(this),this.wall=t}Remove_From_Wall(){0,0,this.Some_Wall().__Remove_Window__(this),this.wall=null}Index(){return 0,0,this.Some_Wall().Window_Index(this)}Program(){return 0,0,this.program}Banner(){return this.banner}Is_Alive(){return!!(this.state&State.IS_ALIVE)}Live(){if(0,this.state|=State.IS_ALIVE,null!=this.wall){const t=this.wall;this.wall=null,this.Add_To_Wall(t),!this.program.Is_Window_Active()&&t.Has_Active_Window()||this.Activate(),this.program.Is_Window_Maximized()?this.Maximize():this.program.Is_Window_Minimized()&&this.Minimize()}}Kill(){0,this.Move_To_Wall(null),this.state&=~State.IS_ALIVE}Is_Active(){return this.Is_In_Wall()&&this.Some_Wall().Maybe_Active_Window()===this}Activate(){0,this.Some_Wall().__Set_Active_Window__(this)}Deactivate(){0,this.Some_Wall().__Set_Active_Window__(null)}Is_Minimized(){return 0,!!(this.state&State.IS_MINIMIZED)}Minimize(){0,this.state|=State.IS_MINIMIZED}Unminimize(){0,this.state&=~State.IS_MINIMIZED}Toggle_Minimization(){0,this.state^=State.IS_MINIMIZED}Is_Maximized(){return 0,!!(this.state&State.IS_MAXIMIZED)}Maximize(){0,this.state|=State.IS_MAXIMIZED}Unmaximize(){0,this.state&=~State.IS_MAXIMIZED}Toggle_Maximization(){0,this.state^=State.IS_MAXIMIZED}Is_Visible(){return this.Is_In_Wall()&&!this.Is_Minimized()}Render_Type(){return 0,this.Some_Wall().Render_Type()}Render_Limit(){return 0,this.Some_Wall().Render_Limit()}Before_Dependencies_Are_Ready(){return __awaiter(this,void 0,void 0,(function*(){this.Live()}))}}