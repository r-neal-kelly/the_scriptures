import*as Utils from"../../utils.js";import*as Entity from"../entity.js";import*as Tab from"./tab.js";export class Instance extends Entity.Instance{constructor({taskbar:t}){super(),this.taskbar=t,this.tabs=[],this.Add_Dependencies([])}Taskbar(){return this.taskbar}Tab_Count(){return this.tabs.length}Has_Tab(t){return this.tabs.indexOf(t)>-1}Has_Tab_At(t){return t>-1&&t<this.tabs.length}Tab_At(t){return 0,0,this.tabs[t]}Tabs(){return Array.from(this.tabs)}Add_Tab(){this.tabs.push(new Tab.Instance({tabs:this,index:this.tabs.length}))}Remove_Tab(t){0,this.tabs.splice(t,1);for(let s=t,a=this.tabs.length;s<a;s+=1)this.Tab_At(s).__Set_Index__(s)}}