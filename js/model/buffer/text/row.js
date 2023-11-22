import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Language from"../../language.js";import*as Text from"../../text.js";import*as Segment from"./segment.js";export class Instance extends Entity.Instance{static Min_Segment_Count(){return Instance.min_segment_count}static Set_Min_Segment_Count(t){0,Instance.min_segment_count=t}constructor({column:t,index:e,text:n}){if(super(),this.column=t,this.index=e,this.text=n,this.segments=[],null==n)0,0;else if(0,0,""===n.Value()){const t=new Text.Segment.Instance({segment_type:Text.Segment.Type.MACRO,index:0});t.Add_Item(new Text.Part.Instance({part_type:Text.Part.Type.POINT,index:0,value:" ",status:Text.Part.Status.GOOD,style:Text.Part.Style._NONE_,language:null})),this.segments.push(new Segment.Instance({row:this,index:0,text:t}))}else for(let t=0,e=n.Macro_Segment_Count();t<e;t+=1)this.segments.push(new Segment.Instance({row:this,index:t,text:n.Macro_Segment(t)}));this.Add_Dependencies(this.segments)}Column(){return 0,this.column}Index(){return 0,this.index}Has_Text(){return null!=this.text}Text(){return 0,this.text}Value(){return this.Text().Value()}Segment_Count(){return this.segments.length}Segment_At(t){return 0,t<this.Segment_Count()?this.segments[t]:Instance.blank_segment}Is_Blank(){return null==this.text}Is_New_Line(){return""===this.Text().Value()}Is_Centered(){return this.Text().Can_Be_Centered()&&this.Text().Is_Centered()}Is_Padded(){return this.Text().Can_Be_Padded()&&this.Text().Is_Padded()}Padding_Count(){return this.Text().Can_Be_Padded()?this.Text().Padding_Count():0}Padding_Direction(){return this.Column().Line().Buffer().Default_Text_Direction()}Has_Styles(){return this.Has_Text()}Styles(){if(this.Has_Styles()){if(this.Is_Padded()){const t=`${this.Column().Line().Buffer().Pad_EM(this.Padding_Count())}em`,e=this.Padding_Direction()===Language.Direction.LEFT_TO_RIGHT?"left":"right";return`\n                    margin-${e}: ${t};\n                    border-${e}-width: 1px;\n                `}return""}return""}}Instance.min_segment_count=70,Instance.blank_segment=new Segment.Instance({row:null,index:null,text:null});