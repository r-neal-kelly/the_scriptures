import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({slot:t,index:e,name:s}){super(),this.slot=t,this.index=e,this.name=s}Slot(){return this.slot}Index(){return this.index}Name(){return this.name}Is_Selected(){return this.Slot().Has_Selected_Item()&&this.Slot().Selected_Item()===this}Select(){this.Slot().Select_Item(this)}}