export class Instance{constructor({settings:e,index:t,value:n,name:s}){this.settings=e,this.index=t,this.value=n,this.name=s}Settings(){return this.settings}Index(){return this.index}Value(){return this.value}Name(){return this.name}Is_Selected(){return this.Settings().Current_Slot_Order_Index()===this.Index()}Select(){this.Settings().__Select_Current_Slot_Order_Index__(this.Index())}}