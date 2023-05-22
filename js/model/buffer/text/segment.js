import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Text from"../../text.js";import*as Item from"./item.js";export class Instance extends Entity.Instance{static Min_Item_Count(){return Instance.min_item_count}static Set_Min_Item_Count(t){Utils.Assert(t>=0,"min_item_count must be greater than or equal to 0."),Instance.min_item_count=t}constructor({line:t,index:e,text:n}){if(super(),this.line=t,this.index=e,this.text=n,this.items=[],null==n)Utils.Assert(null==t,"line must be null."),Utils.Assert(null==e,"index must be null.");else{Utils.Assert(null!=t,"line must not be null."),Utils.Assert(null!=e&&e>-1,"index must not be null, and must be greater than -1.");for(let t=0,e=n.Item_Count();t<e;t+=1)this.items.push(new Item.Instance({segment:this,index:t,text:n.Item(t)}))}this.Add_Dependencies(this.items)}Line(){return Utils.Assert(null!=this.line,"Doesn't have line."),this.line}Index(){return Utils.Assert(null!=this.index,"Doesn't have an index."),this.index}Text(){return Utils.Assert(null!=this.text,"Doesn't have text."),this.text}Item_Count(){return this.items.length}Item_At(t){return Utils.Assert(t>-1,`item_index (${t}) must be greater than -1.`),t<this.Item_Count()?this.items[t]:Instance.blank_item}Is_Blank(){return null==this.text}Has_Left_To_Right_Style(){return this.Text().Segment_Type()===Text.Segment.Type.MACRO_LEFT_TO_RIGHT}Has_Right_To_Left_Style(){return this.Text().Segment_Type()===Text.Segment.Type.MACRO_RIGHT_TO_LEFT}}Instance.min_item_count=2,Instance.blank_item=new Item.Instance({segment:null,index:null,text:null});