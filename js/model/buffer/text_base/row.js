import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Data from"../../data.js";export class Instance extends Entity.Instance{constructor({column:t,index:s,text:e}){super(),this.column=t,this.index=s,this.text=e,this.segments=[],null==t?(0,0):(0,0)}Is_Blank(){return null==this.text}Buffer(){return 0,this.Column().Buffer()}Column(){return 0,this.column}Index(){return 0,this.index}Text(){return 0,this.text}Min_Segment_Count({line_index:t,column_index:s,row_index:e}){return Data.Singleton().Info().Max_Macro_Segment_Count({line_index:t,column_index:s,row_index:e})}Segment_Count(){return this.segments.length}Segment_At(t){return 0,t<this.Segment_Count()?this.segments[t]:this.Blank_Segment()}Push_Segment(t){0,this.segments.push(t)}Is_Transparent(){return 0,""===this.Text().Value()}Is_Centered(){return 0,this.Text().Can_Be_Centered()&&this.Text().Is_Centered()}Is_Padded(){return 0,this.Text().Can_Be_Padded()&&this.Text().Is_Padded()}Padding_Count(){return 0,0,this.Text().Can_Be_Padded()?this.Text().Padding_Count():0}Padding_Direction(){return 0,0,this.Buffer().Default_Language_Direction()}}