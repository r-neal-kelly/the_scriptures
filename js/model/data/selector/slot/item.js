import*as Entity from"../../../entity.js";export class Instance extends Entity.Instance{constructor({slot:t,index:e,name:s,file:i}){super(),this.slot=t,this.index=e,this.name=s,this.file=i,this.Add_Dependencies([])}Slot(){return this.slot}Index(){return this.index}Name(){return this.name}Title(){return null!=this.file?this.file.Title():this.name}Is_Selected(){return this.Slot().Has_Selected_Item()&&this.Slot().Selected_Item()===this}__Select__(){}Select(){this.Slot().Select_Item(this)}}