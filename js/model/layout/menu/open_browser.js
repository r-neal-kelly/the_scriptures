import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({menu:e}){super(),this.menu=e,this.Add_Dependencies([])}Menu(){return this.menu}Text(){return"Open Browser"}}