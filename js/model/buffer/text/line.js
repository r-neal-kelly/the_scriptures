import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Text from"../../text.js";import*as Segment from"./segment.js";export class Instance extends Entity.Instance{static Min_Segment_Count(){return Instance.min_segment_count}static Set_Min_Segment_Count(t){Utils.Assert(t>=0,"min_segment_count must be greater than or equal to 0."),Instance.min_segment_count=t}constructor({buffer:t,index:e,text:n}){if(super(),this.buffer=t,this.index=e,this.text=n,this.segments=[],null==n)Utils.Assert(null==t,"buffer must be null."),Utils.Assert(null==e,"index must be null.");else if(Utils.Assert(null!=t,"buffer must not be null."),Utils.Assert(null!=e&&e>-1,"index must not be null, and must be greater than -1."),""===n.Value()){const t=new Text.Segment.Instance({segment_type:Text.Segment.Type.MACRO});t.Add_Item(new Text.Part.Instance({part_type:Text.Part.Type.POINT,value:" ",status:Text.Part.Status.GOOD,style:Text.Part.Style._NONE_})),this.segments.push(new Segment.Instance({line:this,index:0,text:t}))}else for(let t=0,e=n.Macro_Segment_Count();t<e;t+=1)this.segments.push(new Segment.Instance({line:this,index:t,text:n.Macro_Segment(t)}));this.Add_Dependencies(this.segments)}Buffer(){return Utils.Assert(null!=this.buffer,"Doesn't have buffer."),this.buffer}Index(){return Utils.Assert(null!=this.index,"Doesn't have an index."),this.index}Text(){return Utils.Assert(null!=this.text,"Doesn't have text."),this.text}Segment_Count(){return this.segments.length}Segment_At(t){return Utils.Assert(t>-1,`segment_index (${t}) must be greater than -1.`),t<this.Segment_Count()?this.segments[t]:Instance.blank_segment}Is_Blank(){return null==this.text}Is_New_Line(){return""===this.Text().Value()}}Instance.min_segment_count=70,Instance.blank_segment=new Segment.Instance({line:null,index:null,text:null});