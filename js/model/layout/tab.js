import*as Entity from"../entity.js";export class Instance extends Entity.Instance{constructor({tabs:t,index:i}){super(),this.tabs=t,this.index=i,this.Add_Dependencies([])}Tabs(){return this.tabs}Index(){return this.index}__Set_Index__(t){this.index=t}Window(){return this.Tabs().Taskbar().Layout().Wall().Window_At(this.Index())}Title(){return this.Window().Is_Ready()?this.Window().Program().Model_Instance().Short_Title():"Loading"}Is_Active(){return this.Window().Is_Active()}Is_Maximized(){return this.Window().Is_Maximized()}Is_Minimized(){return this.Window().Is_Minimized()}}