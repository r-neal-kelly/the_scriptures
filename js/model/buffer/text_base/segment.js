import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Data from"../../data.js";import*as Text from"../../text.js";import*as Buffer from"./instance.js";export class Instance extends Entity.Instance{constructor({row:t,index:e,text:s}){super(),this.row=t,this.index=e,this.text=s,this.items=[],0}Is_Blank(){return null==this.text}Buffer(){return this.Row().Buffer()}Row(){return this.row}Index(){return this.index}Text(){return 0,this.text}Min_Item_Count(){return Buffer.Use_Average_Counts()?Data.Singleton().Info().Avg_Macro_Item_Count({line_index:this.Row().Column().Line().Index(),column_index:this.Row().Column().Index(),row_index:this.Row().Index(),segment_index:this.Index()}):Data.Singleton().Info().Max_Macro_Item_Count({line_index:this.Row().Column().Line().Index(),column_index:this.Row().Column().Index(),row_index:this.Row().Index(),segment_index:this.Index()})}Item_Count(){return this.items.length}Item_At(t){return 0,t<this.Item_Count()?this.items[t]:this.Blank_Item(t)}Push_Item(t){0,this.items.push(t)}Has_Left_To_Right_Style(){return 0,this.Text().Segment_Type()===Text.Segment.Type.MACRO_LEFT_TO_RIGHT}Has_Right_To_Left_Style(){return 0,this.Text().Segment_Type()===Text.Segment.Type.MACRO_RIGHT_TO_LEFT}}