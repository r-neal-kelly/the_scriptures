import*as Text_Base from"../text_base.js";import*as Item from"./item.js";export class Instance extends Text_Base.Segment.Instance{constructor({row:e,model:t,index:s}){super({row:e,model:t,index:s}),this.Live()}Add_Item(e){new Item.Instance({segment:this,model:()=>this.Model().Item_At(e)})}}