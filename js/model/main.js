import*as Entity from"./entity.js";import*as Layout from"./layout.js";export class Instance extends Entity.Instance{constructor(){super(),this.layout=new Layout.Instance,this.Add_Dependencies([this.layout])}Layout(){return this.layout}}