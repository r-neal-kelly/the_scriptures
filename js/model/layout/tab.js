import*as Entity from"../entity.js";export class Instance extends Entity.Instance{constructor({tabs:t,window:i}){super(),this.tabs=t,this.window=i,this.Add_Dependencies([])}Tabs(){return this.tabs}Window(){return this.window}Title(){return this.Window().Is_Ready()?this.Window().Program().Model_Instance().Short_Title():"Loading"}Is_Active(){return this.Tabs().Bar().Layout().Maybe_Active_Window()===this.Window()}}