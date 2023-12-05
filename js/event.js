var __awaiter=this&&this.__awaiter||function(e,t,s,n){return new(s||(s=Promise))((function(i,r){function o(e){try{h(n.next(e))}catch(e){r(e)}}function a(e){try{h(n.throw(e))}catch(e){r(e)}}function h(e){var t;e.done?i(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(o,a)}h((n=n.apply(e,t||[])).next())}))};import*as Utils from"./utils.js";import*as Execution from"./execution.js";import*as Messenger from"./messenger.js";export class Grid{constructor(){this.messenger=new Messenger.Instance,this.objects=new Map,this.execution_frames={}}Has(e){return this.objects.has(e)}Add(e){this.Has(e)||this.objects.set(e,new Listeners)}Add_Many(e){for(const t of e)this.Add(t)}Remove(e){this.Has(e)&&(this.Remove_All_Listeners(e),this.objects.delete(e))}Remove_Many(e){for(const t of e)this.Remove(t)}Remove_All(){for(const e of this.objects.keys())this.Remove(e)}Some_Listeners(e){return this.Has(e)||this.Add(e),this.objects.get(e)}Has_Listener(e,t){return this.Some_Listeners(e).Has(t)}Add_Listener(e,t){return this.Some_Listeners(e).Add({messenger:this.messenger,object:e,listener_info:t})}Add_Many_Listeners(e,t){return this.Some_Listeners(e).Add_Many({messenger:this.messenger,object:e,listener_infos:t})}Remove_Listener(e,t){this.Some_Listeners(e).Remove({messenger:this.messenger,listener_handle:t})}Remove_Many_Listeners(e,t){this.Some_Listeners(e).Remove_Many({messenger:this.messenger,listener_handles:t})}Remove_All_Listeners(e){this.Some_Listeners(e).Remove_All({messenger:this.messenger})}Some_Execution_Frame(e){return null==this.execution_frames[e]&&(this.execution_frames[e]=new Execution.Frame),this.execution_frames[e]}Send(e){return __awaiter(this,void 0,void 0,(function*(){yield new Instance(this.messenger,this.Some_Execution_Frame(e.Affix()),e).Execute()}))}}export class Listener_Info{constructor({event_name:e,event_handler:t,event_priority:s}){this.event_name=e,this.event_handler=t,this.event_priority=s,Object.freeze(this)}Event_Name(){return this.event_name}Event_Handler(){return this.event_handler}Event_Priority(){return this.event_priority}}class Listeners{constructor(){this.listener_handles=new Set}Has(e){return this.listener_handles.has(e)}Add({messenger:e,object:t,listener_info:s}){const n=e.Subscribe(s.Event_Name().String(),new Messenger.Subscriber_Info({handler:s.Event_Handler().bind(t),priority:s.Event_Priority()}));return this.listener_handles.add(n),n}Add_Many({messenger:e,object:t,listener_infos:s}){const n=[];for(const i of s)n.push(this.Add({object:t,listener_info:i,messenger:e}));return n}Remove({messenger:e,listener_handle:t}){e.Unsubscribe(t),this.listener_handles.delete(t)}Remove_Many({messenger:e,listener_handles:t}){for(const s of t)this.Remove({listener_handle:s,messenger:e})}Remove_All({messenger:e}){for(const t of this.listener_handles.values())this.Remove({listener_handle:t,messenger:e})}}export var Prefix;!function(e){e.BEFORE="Before",e.ON="On",e.AFTER="After"}(Prefix||(Prefix={}));export class Name{static Has_Dangling_Underscore(e){return e.length>0&&("_"===e[0]||"_"===e[e.length-1])}constructor(e,t,s){0,0,0,0,this.text=null!=s?`${e}_${t}_${s}`:`${e}_${t}`,Object.freeze(this)}String(){return this.text}}export{Publication_Type as Type}from"./messenger.js";export class Info{constructor({affix:e,suffixes:t,type:s,data:n}){this.affix=e,this.suffixes=Array.from(t),this.type=s,this.data=n,Object.freeze(this.suffixes),Object.freeze(this)}Affix(){return this.affix}Suffixes(){return this.suffixes}Type(){return this.type}Data(){return this.data}}export class Instance{static From(e){return e[Instance.KEY]}constructor(e,t,s){0,this.messenger=e,this.execution_frame=t,this.info=s,this.has_executed=!1,this.info.Data()[Instance.KEY]=this}Has_Executed(){return this.has_executed}Execute(){return __awaiter(this,void 0,void 0,(function*(){0,this.has_executed=!0,yield this.execution_frame.Execute(this.info.Type(),function(){return __awaiter(this,void 0,void 0,(function*(){const e=this.info.Affix(),t=this.info.Suffixes(),s=new Messenger.Publication_Info({type:Messenger.Publication_Type.IMMEDIATE,data:this.info.Data()});for(const n of[Prefix.BEFORE,Prefix.ON,Prefix.AFTER]){for(const i of t)yield this.messenger.Publish(new Name(n,e,i).String(),s);yield this.messenger.Publish(new Name(n,e).String(),s)}}))}.bind(this))}))}}Instance.KEY=Symbol("Used to get Event.Instance from Event.Data");