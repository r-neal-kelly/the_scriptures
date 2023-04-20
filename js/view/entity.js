var Life_Cycle_State,Life_Cycle_Listener,Life_Cycle_Skip,__awaiter=this&&this.__awaiter||function(e,t,i,s){return new(i||(i=Promise))((function(n,l){function _(e){try{h(s.next(e))}catch(e){l(e)}}function r(e){try{h(s.throw(e))}catch(e){l(e)}}function h(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(_,r)}h((s=s.apply(e,t||[])).next())}))};import*as Utils from"../utils.js";import*as Unique_ID from"../unique_id.js";export class Animation_Frame{constructor({now:e,start:t,elapsed:i}){this.now=e,this.start=t,this.elapsed=i,Object.freeze(this)}Now(){return this.now}Start(){return this.start}Elapsed(){return this.elapsed}}!function(e){e[e.UNBORN=0]="UNBORN",e[e.ALIVE=1]="ALIVE",e[e.DEAD=2]="DEAD"}(Life_Cycle_State||(Life_Cycle_State={})),function(e){e[e._NONE_=0]="_NONE_",e[e.ON_LIFE=1]="ON_LIFE",e[e.ON_REFRESH=2]="ON_REFRESH",e[e.ON_RECLASS=3]="ON_RECLASS",e[e.ON_RESTYLE=4]="ON_RESTYLE",e[e.BEFORE_DEATH=5]="BEFORE_DEATH"}(Life_Cycle_Listener||(Life_Cycle_Listener={})),function(e){e[e._NONE_=0]="_NONE_",e[e.CHILDREN=1]="CHILDREN",e[e.REMAINING_SIBLINGS=2]="REMAINING_SIBLINGS"}(Life_Cycle_Skip||(Life_Cycle_Skip={}));export class Instance{constructor({element:e,parent:t,event_grid:i}){this.id=Unique_ID.New(),this.element=e instanceof HTMLElement?e:document.createElement(e),this.event_grid=i,this.css=null,this.css_to_add=null,this.parent=t,this.children=new Map,this.life_cycle_state=Life_Cycle_State.UNBORN,this.life_cycle_listener=Life_Cycle_Listener._NONE_,this.life_cycle_skip=Life_Cycle_Skip._NONE_}Live(){if(this.Is_Unborn())if(this.life_cycle_state=Life_Cycle_State.ALIVE,this.element.setAttribute("id",this.HTML_ID()),null!=this.parent){const e=this.parent;this.parent=null,e.Adopt_Child(this),this.Life_This()}else this.Life_This(),this.Refresh()}Life_This(){this.Is_Alive()&&Object.getPrototypeOf(this).hasOwnProperty("On_Life")&&(this.life_cycle_listener=Life_Cycle_Listener.ON_LIFE,this.css_to_add="",this.Event_Grid().Add_Many_Listeners(this,this.On_Life()),""!==this.css_to_add&&(this.css=Utils.Create_Style_Element(this.css_to_add)),this.css_to_add=null,this.life_cycle_listener=Life_Cycle_Listener._NONE_)}Refresh(){if(this.Is_Alive()){if(this.life_cycle_skip&=~Life_Cycle_Skip.CHILDREN,this.Refresh_This(),this.Reclass_This(),this.Restyle_This(),this.life_cycle_skip&Life_Cycle_Skip.CHILDREN)return;for(const e of this.children.values())if(e.life_cycle_skip&=~Life_Cycle_Skip.REMAINING_SIBLINGS,e.Refresh(),e.life_cycle_skip&Life_Cycle_Skip.REMAINING_SIBLINGS)return}}Refresh_This(){this.Is_Alive()&&Object.getPrototypeOf(this).hasOwnProperty("On_Refresh")&&(this.life_cycle_listener=Life_Cycle_Listener.ON_REFRESH,this.On_Refresh(),this.life_cycle_listener=Life_Cycle_Listener._NONE_)}Reclass(){if(this.Is_Alive()){if(this.life_cycle_skip&=~Life_Cycle_Skip.CHILDREN,this.Reclass_This(),this.Restyle_This(),this.life_cycle_skip&Life_Cycle_Skip.CHILDREN)return;for(const e of this.children.values())if(e.life_cycle_skip&=~Life_Cycle_Skip.REMAINING_SIBLINGS,e.Reclass(),e.life_cycle_skip&Life_Cycle_Skip.REMAINING_SIBLINGS)return}}Reclass_This(){if(this.Is_Alive()&&Object.getPrototypeOf(this).hasOwnProperty("On_Reclass")){this.life_cycle_listener=Life_Cycle_Listener.ON_RECLASS;const e=this.On_Reclass().join(" ");this.life_cycle_listener=Life_Cycle_Listener._NONE_;const t=this.Element(),i=t.getAttribute("class");null!=i&&i===e||t.setAttribute("class",e)}}Restyle(){if(this.Is_Alive()){if(this.life_cycle_skip&=~Life_Cycle_Skip.CHILDREN,this.Restyle_This(),this.life_cycle_skip&Life_Cycle_Skip.CHILDREN)return;for(const e of this.children.values())if(e.life_cycle_skip&=~Life_Cycle_Skip.REMAINING_SIBLINGS,e.Restyle(),e.life_cycle_skip&Life_Cycle_Skip.REMAINING_SIBLINGS)return}}Restyle_This(){if(this.Is_Alive()&&Object.getPrototypeOf(this).hasOwnProperty("On_Restyle")){this.life_cycle_listener=Life_Cycle_Listener.ON_RESTYLE;const e=this.On_Restyle();if(this.life_cycle_listener=Life_Cycle_Listener._NONE_,e instanceof Object){const t=this.Element();for(const i of Object.entries(e))t.style[i[0]]=i[1]}else this.Element().setAttribute("style",e)}}Die(){if(this.Is_Alive()){Object.getPrototypeOf(this).hasOwnProperty("Before_Death")&&(this.life_cycle_listener=Life_Cycle_Listener.BEFORE_DEATH,this.Before_Death(),this.life_cycle_listener=Life_Cycle_Listener._NONE_);for(const e of this.children.values())e.Die();if(this.Has_Parent()){const e=this.Parent(),t=e.Element(),i=this.Element();i.parentElement===t&&t.removeChild(i),this.parent=null,e.children.delete(i)}null!=this.css&&Utils.Destroy_Style_Element(this.css),this.Event_Grid().Remove(this),this.element=document.body,this.life_cycle_state=Life_Cycle_State.DEAD}}On_Life(){return Utils.Assert(!1,"This method must be overridden to be used."),[]}On_Refresh(){Utils.Assert(!1,"This method must be overridden to be used.")}On_Reclass(){return Utils.Assert(!1,"This method must be overridden to be used."),[]}On_Restyle(){return Utils.Assert(!1,"This method must be overridden to be used."),""}Before_Death(){Utils.Assert(!1,"This method must be overridden to be used.")}Is_Unborn(){return this.life_cycle_state===Life_Cycle_State.UNBORN}Is_Alive(){return this.life_cycle_state===Life_Cycle_State.ALIVE}Is_Dead(){return this.life_cycle_state===Life_Cycle_State.DEAD}ID(){return Utils.Assert(this.Is_Alive(),"Cannot get an ID from a dead entity."),this.id}HTML_ID(){return Utils.Assert(this.Is_Alive(),"Cannot get an html ID from a dead entity."),`Entity_${Instance.class_id}_${this.ID()}`}Element(){return Utils.Assert(this.Is_Alive(),"Cannot get an element from a dead entity."),this.element}Add_CSS(e){Utils.Assert(this.Is_Alive(),"Cannot add css on a dead entity."),Utils.Assert(this.life_cycle_listener===Life_Cycle_Listener.ON_LIFE,"You can only add css during On_Life().");const t=this.HTML_ID();this.css_to_add+=`\n            /* CSS for ${t} and its Children: */\n        `,this.css_to_add+=e.replace(/(}\s*|^\s*)([^@{]+)({)/g,(function(e,i,s,n){let l="";const _=s.trim().split(/\s*,\s*/g);for(let e=0,i=_.length;e<i;e+=1){const s=_[e];l+=`${s.replace(/^([^\s>~+|]*)/,`$1#${t}`)}, `,l+=e!==i-1?`#${t} ${s}, `:`#${t} ${s} `}return`${i}${l}${n}`}))}Add_This_CSS(e){Utils.Assert(this.Is_Alive(),"Cannot add this_css on a dead entity."),Utils.Assert(this.life_cycle_listener===Life_Cycle_Listener.ON_LIFE,"You can only add this_css during On_Life().");const t=this.HTML_ID();this.css_to_add+=`\n            /* CSS for ${t}: */\n        `,this.css_to_add+=e.replace(/(}\s*|^\s*)([^@{]+)({)/g,(function(e,i,s,n){let l="";const _=s.trim().split(/\s*,\s*/g);for(let e=0,i=_.length;e<i;e+=1){const s=_[e];l+=e!==i-1?`${s.replace(/^([^\s>~+|]*)/,`$1#${t}`)}, `:`${s.replace(/^([^\s>~+|]*)/,`$1#${t}`)} `}return`${i}${l}${n}`}))}Add_Children_CSS(e){Utils.Assert(this.Is_Alive(),"Cannot add children_css on a dead entity."),Utils.Assert(this.life_cycle_listener===Life_Cycle_Listener.ON_LIFE,"You can only add children_css during On_Life().");const t=this.HTML_ID();this.css_to_add+=`\n            /* CSS for ${t}'s Children: */\n        `,this.css_to_add+=e.replace(/(}\s*|^\s*)([^@{]+)({)/g,(function(e,i,s,n){let l="";const _=s.trim().split(/\s*,\s*/g);for(let e=0,i=_.length;e<i;e+=1){const s=_[e];l+=e!==i-1?`#${t} ${s}, `:`#${t} ${s} `}return`${i}${l}${n}`}))}Has_Parent(){return Utils.Assert(this.Is_Alive(),"Cannot know if a dead entity has a parent."),null!=this.parent}Parent(){return Utils.Assert(this.Is_Alive(),"Cannot get a parent from a dead entity."),Utils.Assert(this.Has_Parent(),"Entity does not have a parent, use Maybe_Parent or Has_Parent."),this.parent}Maybe_Parent(){return Utils.Assert(this.Is_Alive(),"Cannot get a parent from a dead entity."),this.parent}Child_Count(){return Utils.Assert(this.Is_Alive(),"Cannot know a dead entity's child count."),this.children.size}Has_Child(e){return Utils.Assert(this.Is_Alive(),"Cannot know if a dead entity has a child."),Utils.Assert(e>=0,"Cannot have an index less than 0."),e<this.Child_Count()}Child(e){return Utils.Assert(this.Is_Alive(),"Cannot get a child from a dead entity."),Utils.Assert(e>=0,"Cannot have an index less than 0."),Utils.Assert(this.Has_Child(e),"Entity does not have the indexed child, use Maybe_Child or Has_Child."),this.children.get(this.Element().children[e])}Maybe_Child(e){return this.Has_Child(e)?this.Child(e):null}Children(){return Utils.Assert(this.Is_Alive(),"Cannot get children from a dead entity."),Array.from(this.Element().children).map(function(e){return this.children.get(e)}.bind(this))}Adopt_Child(e){Utils.Assert(this.Is_Alive(),"A parent must be alive to adopt a child."),Utils.Assert(this.life_cycle_listener===Life_Cycle_Listener.ON_REFRESH,"You can only adopt a child during On_Refresh()."),Utils.Assert(e.Is_Alive(),"A child must be alive to be adopted."),Utils.Assert(!e.Has_Parent(),"A child must not have a parent to be adopted."),Utils.Assert(this.Child_Count()+1<1/0,"Can not add any more children!"),this.children.set(e.Element(),e),e.parent=this,this.Element().appendChild(e.Element())}Abort_Child(e){Utils.Assert(this.Is_Alive(),"A parent must be alive to abort a child."),Utils.Assert(this.life_cycle_listener===Life_Cycle_Listener.ON_REFRESH,"You can only abort a child during On_Refresh()."),Utils.Assert(e.Is_Alive(),"A child must be alive to be aborted."),Utils.Assert(e.Parent()===this,"A child must have this parent to be aborted."),e.Die()}Abort_All_Children(){for(const e of Array.from(this.children.values()))this.Abort_Child(e)}Skip_Children(){Utils.Assert(this.life_cycle_listener===Life_Cycle_Listener.ON_REFRESH||this.life_cycle_listener===Life_Cycle_Listener.ON_RECLASS||this.life_cycle_listener===Life_Cycle_Listener.ON_RESTYLE,"You can only skip children during On_Refresh(), On_Reclass(), or On_Restyle()."),this.life_cycle_skip|=Life_Cycle_Skip.CHILDREN}Skip_Remaining_Siblings(){Utils.Assert(this.life_cycle_listener===Life_Cycle_Listener.ON_REFRESH||this.life_cycle_listener===Life_Cycle_Listener.ON_RECLASS||this.life_cycle_listener===Life_Cycle_Listener.ON_RESTYLE,"You can only skip remaining siblings during On_Refresh(), On_Reclass(), or On_Restyle()."),this.life_cycle_skip|=Life_Cycle_Skip.REMAINING_SIBLINGS}Event_Grid(){return Utils.Assert(this.Is_Alive(),"Cannot get an event grid from a dead entity."),this.event_grid}Add_Listeners(e){this.Event_Grid().Add_Many_Listeners(this,e)}Remove_Listeners(){this.Event_Grid().Remove_All_Listeners(this)}Set_Listeners(e){this.Remove_Listeners(),this.Add_Listeners(e)}Send(e){return __awaiter(this,void 0,void 0,(function*(){return this.Event_Grid().Send(e)}))}Animate(e,t){return __awaiter(this,void 0,void 0,(function*(){if(Utils.Assert(e.length>=2,"Must have at least two keyframes."),Utils.Assert(0===e[0].offset,"First keyframe's offset must be 0.0"),Utils.Assert(1===e[e.length-1].offset,"Last keyframe's offset must be 1.0"),Utils.Assert(void 0===t.direction||"normal"===t.direction||"reverse"===t.direction,"Invalid direction."),Utils.Assert(void 0===t.fill||"both"===t.fill,"Invalid fill."),void 0===t.direction&&(t.direction="normal"),void 0===t.fill&&(t.fill="none"),this.Is_Alive()){const i=this.Element();let s,n;"normal"===t.direction?(s=e[0],n=e[e.length-1]):(s=e[e.length-1],n=e[0]);for(const[e,t]of Object.entries(s))"offset"!==e&&null!=t&&(i.style[e]=t.toString());yield new Promise((function(s){const n=new Animation(new KeyframeEffect(i,e,t));n.onfinish=function(e){s()},n.play()}));for(const[e,t]of Object.entries(n))"offset"!==e&&null!=t&&(i.style[e]=t.toString())}}))}Animate_By_Frame(e,t){return __awaiter(this,void 0,void 0,(function*(){return new Promise(function(i){let s=null,n=-1;window.requestAnimationFrame(function l(_){return __awaiter(this,void 0,void 0,(function*(){this.Is_Alive()?(null==s&&(s=_),n!==_?(n=_,(yield e(new Animation_Frame({now:_,start:s,elapsed:_-s}),t))?window.requestAnimationFrame(l.bind(this)):i()):window.requestAnimationFrame(l.bind(this))):i()}))}.bind(this))}.bind(this))}))}}Instance.class_id=`${(new Date).getTime()}${Math.random().toString().replace(/\./g,"")}`;